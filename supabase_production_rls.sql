-- POLÍTICAS DE SEGURANÇA DE PRODUÇÃO (RLS)
-- Execute este script para garantir que jogadores não possam manipular dados de outros ou do Mestre.

-- 1. SEGURANÇA NA TABELA 'ROOMS'
-- Apenas o GM pode alterar o estado do mapa, iniciativa ou nome da sala.
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Mestres podem atualizar suas salas" ON public.rooms;
CREATE POLICY "Mestres podem atualizar suas salas" ON public.rooms 
FOR UPDATE 
USING (auth.uid() = game_master_id)
WITH CHECK (auth.uid() = game_master_id);

-- 2. SEGURANÇA NA TABELA 'ROOM_PLAYERS'
-- Jogadores só podem atualizar seu próprio HP/Ficha ou o GM pode atualizar todos.
ALTER TABLE public.room_players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso total aos players da própria sala" ON public.room_players;
CREATE POLICY "Acesso total aos players da própria sala" ON public.room_players
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.room_players AS rp 
    WHERE rp.room_id = room_id AND rp.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Atualização de dados do player" ON public.room_players;
CREATE POLICY "Atualização de dados do player" ON public.room_players
FOR UPDATE
USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.rooms WHERE id = room_id AND game_master_id = auth.uid())
);

DROP POLICY IF EXISTS "Saída ou expulsão de jogadores" ON public.room_players;
CREATE POLICY "Saída ou expulsão de jogadores" ON public.room_players
FOR DELETE
USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.rooms WHERE id = room_id AND game_master_id = auth.uid())
);

-- 3. SEGURANÇA NA TABELA 'ROOM_EVENTS' (CHAT/DADOS)
-- Apenas quem está na sala pode ler ou escrever nela.
ALTER TABLE public.room_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Participantes leem eventos da sala" ON public.room_events;
CREATE POLICY "Participantes leem eventos da sala" ON public.room_events
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.room_players 
    WHERE room_id = room_events.room_id AND user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Participantes enviam eventos para a sala" ON public.room_events;
CREATE POLICY "Participantes enviam eventos para a sala" ON public.room_events
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.room_players 
    WHERE room_id = room_events.room_id AND user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Mestre limpa o chat" ON public.room_events;
CREATE POLICY "Mestre limpa o chat" ON public.room_events
FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.rooms WHERE id = room_id AND game_master_id = auth.uid())
);
