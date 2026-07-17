// Domínio/Infra: client único do Supabase (browser). Dono ÚNICO da instância GoTrue.
// NUNCA criar um segundo createClient() no app: duas instâncias disputam o mesmo refresh
// token na mesma storage key e derrubam a sessão uma da outra (logout aleatório em sessão
// de VTT). Todo consumidor — auth, persistência de personagem, VTT/realtime — importa daqui.
// realtime.eventsPerSecond: exigido pelo VTT (useVttStore/VttGrid); inerte para quem não
// abre canal.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Credenciais do Supabase não encontradas (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
    'Login e VTT Multiplayer ficam desativados. Verifique o arquivo .env.'
  );
}

// Fallback para não quebrar o boot em dev sem .env.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder_key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
