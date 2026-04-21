import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Credenciais do Supabase não encontradas! O modo VTT Multiplayer será desativado localmente. Verifique o arquivo .env.local');
}

export const supabase = createClient(supabaseUrl || 'https://mock.supabase.co', supabaseKey || 'mock-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    }
  }
});
