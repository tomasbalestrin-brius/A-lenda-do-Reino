import { create } from 'zustand';
import { supabase } from '../services/supabaseClient';

export const useVttStore = create((set, get) => ({
  currentRoom: null,
  players: [],
  events: [],
  combatState: { combatants: [], currentTurn: 0, round: 1 },
  gridState: { tokens: [] },
  isConnected: false,
  error: null,
  currentUserId: null,

  setRoom: (room) => set({ currentRoom: room }),
  setPlayers: (players) => set({ players }),
  setCombatState: (combatState) => set({ combatState }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  
  clearRoom: () => set({ 
    currentRoom: null, 
    players: [], 
    events: [], 
    isConnected: false,
    currentUserId: null,
  }),

  // Método para entrar em uma sala
  joinRoom: async (joinCode, user) => {
    try {
      if (!supabase) throw new Error("Cliente Supabase não configurado.");

      // Guardar userId no store para uso interno (resolve o bug do localStorage)
      if (user?.id) set({ currentUserId: user.id });
      
      // Busca a sala
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('join_code', joinCode)
        .single();
        
      if (roomError) throw roomError;
      if (!room) throw new Error("Sala não encontrada.");
      
      // Initialize combat and grid state from room
      if (room.combat_state) {
        set({ combatState: room.combat_state });
      }
      if (room.grid_state) {
        set({ gridState: room.grid_state });
      }

      // Registra o jogador na sala (upsert garante idempotência)
      if (user) {
         await supabase.from('room_players').upsert({
           room_id: room.id,
           user_id: user.id,
           role: room.game_master_id === user.id ? 'game_master' : 'player',
         }, { onConflict: 'room_id,user_id' });
      }

      set({ currentRoom: room, error: null });
      await get().fetchPlayers(room.id);
      // Fix 2: Carrega o histórico de eventos ao entrar na sala
      await get().fetchEvents(room.id);
      get().subscribeToRoom(room.id);
      
    } catch (err) {
      console.error("Erro ao entrar na sala:", err.message);
      set({ error: err.message });
    }
  },

  // Fix 2: Carregar histórico de eventos ao entrar na sala
  fetchEvents: async (roomId) => {
    const { data, error } = await supabase
      .from('room_events')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(100);
    
    if (!error && data) {
      set({ events: data });
    }
  },

  // Buscar lista de jogadores com HP
  fetchPlayers: async (roomId) => {
    const { data, error } = await supabase
      .from('room_players')
      .select('user_id, role, joined_at, character_id, character_name, character_portrait, hp_current, hp_max')
      .eq('room_id', roomId);
    
    if (!error && data) {
      set({ players: data });
    }
  },

  // Vincular Personagem à Sessão
  linkCharacter: async (char) => {
    const { currentRoom } = get();
    const user = (await supabase.auth.getUser()).data.user;
    if (!currentRoom || !user) return;

    const { error } = await supabase
      .from('room_players')
      .update({
        character_id: char.id,
        character_name: char.name,
        character_portrait: char.data?.portrait || null
      })
      .eq('room_id', currentRoom.id)
      .eq('user_id', user.id);

    if (error) {
      console.error("Erro ao vincular personagem:", error.message);
    } else {
      await get().fetchPlayers(currentRoom.id);
    }
  },

  // Expulsar Jogador (Apenas GM)
  kickPlayer: async (userId) => {
    const { currentRoom } = get();
    if (!currentRoom) return;

    await supabase
      .from('room_players')
      .delete()
      .eq('room_id', currentRoom.id)
      .eq('user_id', userId);
    
    // O Realtime cuidará de atualizar a lista para todos
  },

  // Limpar Chat (Apenas GM)
  clearChat: async () => {
    const { currentRoom } = get();
    if (!currentRoom) return;

    const { error } = await supabase
      .from('room_events')
      .delete()
      .eq('room_id', currentRoom.id);

    if (!error) {
      set({ events: [] });
    }
  },

  // Inscrever-se nos eventos Realtime (Chat, Rolagens, Jogadores e Iniciativa)
  subscribeToRoom: (roomId) => {
    if (!supabase) return;

    const channel = supabase
      .channel(`room:${roomId}`)
      // Eventos de Chat/Dados
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'room_events', filter: `room_id=eq.${roomId}` },
        (payload) => {
          get().addEvent(payload.new);
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'room_events', filter: `room_id=eq.${roomId}` },
        () => {
          set({ events: [] }); // Chat limpo
        }
      )
      // Eventos de Jogadores (Entrada/Saída/HP)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'room_players', filter: `room_id=eq.${roomId}` },
        async (payload) => {
          await get().fetchPlayers(roomId);
          // Se eu fui expulso (DELETE com meu user_id)
          if (payload.eventType === 'DELETE') {
            const { data: authData } = await supabase.auth.getUser();
            const myId = authData?.user?.id;
            if (myId && payload.old?.user_id === myId) {
              get().leaveRoom();
            }
          }
        }
      )
      // Eventos da Sala (Iniciativa/Estado de Combate/Grid)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        (payload) => {
          if (payload.new.combat_state) {
            set({ combatState: payload.new.combat_state });
          }
          if (payload.new.grid_state) {
            set({ gridState: payload.new.grid_state });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          set({ isConnected: true });
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          set({ isConnected: false });
        }
      });
  },

  // Deixar a sala
  leaveRoom: async () => {
    const { currentRoom } = get();
    if (currentRoom) {
      await supabase.removeAllChannels();
    }
    get().clearRoom();
  },

  // Atualizar Estado de Combate Global
  updateCombatState: async (newState) => {
    const { currentRoom } = get();
    if (!currentRoom) return;

    // Local update for responsiveness
    set({ combatState: newState });

    // Remote update
    const { error } = await supabase
      .from('rooms')
      .update({ combat_state: newState })
      .eq('id', currentRoom.id);

    if (error) {
      console.error("Erro ao sincronizar iniciativa:", error.message);
    }
  },

  // Atualizar Estado do Grid (Posição de Tokens)
  updateGridState: async (newState) => {
    const { currentRoom } = get();
    if (!currentRoom) return;

    // Local update
    set({ gridState: newState });

    // Remote update
    const { error } = await supabase
      .from('rooms')
      .update({ grid_state: newState })
      .eq('id', currentRoom.id);

    if (error) {
      console.error("Erro ao sincronizar grid:", error.message);
    }
  },
  
  // Método para criar uma sala nova
  createRoom: async (roomName, user) => {
    try {
      if (!supabase) throw new Error("Cliente Supabase não configurado.");
      if (!user) throw new Error("Usuário não autenticado.");

      // Gerar código de sala único (RK-XXX-XXX)
      const generateCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
        return `RK-${code.substring(0,3)}-${code.substring(3)}`;
      };

      const joinCode = generateCode();

      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .insert({
          name: roomName || `Aventura de ${user.email?.split('@')[0]}`,
          join_code: joinCode,
          game_master_id: user.id
        })
        .select()
        .single();

      if (roomError) throw roomError;

      await get().joinRoom(joinCode, user);
      return room;
    } catch (err) {
      console.error("Erro ao criar sala:", err.message);
      set({ error: err.message });
      return null;
    }
  },

  // Fix 1: sendEvent usa currentUserId do store — não precisa mais de localStorage
  sendEvent: async (eventType, content, visibility = 'public') => {
    const { currentRoom, currentUserId } = get();
    if (!currentRoom || !currentUserId) return;

    // Encapsula visibility no conteúdo JSON se for secreto
    let finalContent = content;
    if (visibility === 'secret') {
      try {
        const obj = typeof content === 'string' ? JSON.parse(content) : content;
        finalContent = JSON.stringify({ ...obj, visibility: 'secret' });
      } catch {
        finalContent = JSON.stringify({ text: content, visibility: 'secret' });
      }
    }
    
    await supabase.from('room_events').insert({
      room_id: currentRoom.id,
      user_id: currentUserId,
      event_type: eventType,
      content: finalContent
    });
  },

  // Fix 4: Sincronizar HP atual para outros jogadores verem no token
  syncHp: async (currentHp, maxHp) => {
    const { currentRoom, currentUserId } = get();
    if (!currentRoom || !currentUserId) return;

    await supabase
      .from('room_players')
      .update({ hp_current: currentHp, hp_max: maxHp })
      .eq('room_id', currentRoom.id)
      .eq('user_id', currentUserId);
    // O realtime listener já existente em room_players vai refletir para todos
  },
}));
