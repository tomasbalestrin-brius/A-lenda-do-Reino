-- Execute este script no painel SQL Editor do Supabase E ATIVE O REALTIME NAS TABELAS DEPOIS!

-- 1. Criar tabela de Mesas/Salas
create table if not exists public.rooms (
  id uuid default gen_random_uuid() primary key,
  join_code text unique not null,
  name text not null,
  game_master_id uuid references auth.users not null default auth.uid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabela de Jogadores na Mesa
create table if not exists public.room_players (
  room_id uuid references public.rooms on delete cascade not null,
  user_id uuid references auth.users not null,
  character_id uuid references public.characters, -- Pode ser nulo se o jogador for Mestre ou ainda não puxou a ficha
  role text not null default 'player', -- 'player' ou 'game_master'
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (room_id, user_id)
);

-- 3. Histórico de Ações (O Chat / Rolagens) 
create table if not exists public.room_events (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references public.rooms on delete cascade not null,
  user_id uuid references auth.users not null,
  event_type text not null, -- 'message', 'dice_roll', 'system'
  content text not null, -- JSON em formato de string se for rolagem, ou só texto
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. RLS - Segurança Básica (Ajuste conforme necessidade de privacidade da mesa)
alter table public.rooms enable row level security;
create policy "Todos os usuários autenticados podem ver salas" on rooms for select using (auth.role() = 'authenticated');
create policy "Mestres podem criar salas" on rooms for insert with check (auth.uid() = game_master_id);

alter table public.room_players enable row level security;
create policy "Qualquer autenticado pode ver quem ta na sala" on room_players for select using (auth.role() = 'authenticated');
create policy "Qualquer autenticado pode entrar na sala pela chave" on room_players for insert with check (auth.role() = 'authenticated');

alter table public.room_events enable row level security;
create policy "Qualquer autenticado pode ver logs de combate" on room_events for select using (auth.role() = 'authenticated');
create policy "Participantes da sala podem enviar logs" on room_events for insert with check (auth.role() = 'authenticated');

-- 5. LIGANDO O MOTOR DE TEMPO REAL (REALTIME)
-- Isso é CRUCIAL para que rolagens cheguem no mesmo segundo na tela de outros.
alter publication supabase_realtime add table public.room_events;
