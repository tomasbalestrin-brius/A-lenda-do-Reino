-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. Criar a tabela de personagens
create table if not exists public.characters (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  data jsonb not null,
  created_at timestamptz default now()
);

-- 2. Habilitar Row Level Security (RLS)
alter table public.characters enable row level security;

-- 3. Criar uma política de acesso para todos (exemplo simplificado: anon pode tudo)
-- IMPORTANTE: Em produção, você deve restringir o acesso apenas a usuários autenticados
create policy "Allow all operations for anonymous users" 
on public.characters 
for all 
using (true) 
with check (true);
