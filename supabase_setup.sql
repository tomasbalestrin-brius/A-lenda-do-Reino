-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. Criar a tabela de personagens vinculada ao usuário
create table if not exists public.characters (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null default auth.uid(),
  name text not null,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Habilitar Row Level Security (RLS)
alter table public.characters enable row level security;

-- 3. Criar políticas de segurança (Só o dono do herói pode ver/editar)
create policy "Usuários podem ver seus próprios personagens"
  on characters for select
  using ( auth.uid() = user_id );

create policy "Usuários podem criar seus próprios personagens"
  on characters for insert
  with check ( auth.uid() = user_id );

create policy "Usuários podem atualizar seus próprios personagens"
  on characters for update
  using ( auth.uid() = user_id );

create policy "Usuários podem deletar seus próprios personagens"
  on characters for delete
  using ( auth.uid() = user_id );
