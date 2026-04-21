-- ============================================================
-- MIGRAÇÃO V2: Colunas para Grid, Combate e Personagens
-- Execute no SQL Editor do Supabase
-- ============================================================

-- 1. Adicionar colunas de estado na tabela rooms
ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS combat_state jsonb DEFAULT '{"combatants":[],"currentTurn":0,"round":1}'::jsonb,
  ADD COLUMN IF NOT EXISTS grid_state   jsonb DEFAULT '{"tokens":[]}'::jsonb;

-- 2. Adicionar colunas de personagem e HP em room_players
ALTER TABLE public.room_players
  ADD COLUMN IF NOT EXISTS character_name      text,
  ADD COLUMN IF NOT EXISTS character_portrait  text,
  ADD COLUMN IF NOT EXISTS hp_current          integer,
  ADD COLUMN IF NOT EXISTS hp_max              integer;

-- 3. Política UPDATE para rooms (Mestres podem atualizar o estado da sala)
DROP POLICY IF EXISTS "Mestres podem atualizar salas" ON public.rooms;
CREATE POLICY "Mestres podem atualizar salas"
  ON public.rooms FOR UPDATE
  USING (auth.uid() = game_master_id);

-- 4. Política UPDATE para room_players (Jogadores atualizam próprio registro)
DROP POLICY IF EXISTS "Jogadores atualizam proprio registro" ON public.room_players;
CREATE POLICY "Jogadores atualizam proprio registro"
  ON public.room_players FOR UPDATE
  USING (auth.uid() = user_id);

-- 5. Política DELETE para room_players (GMs podem expulsar jogadores)
DROP POLICY IF EXISTS "GMs podem remover jogadores" ON public.room_players;
CREATE POLICY "GMs podem remover jogadores"
  ON public.room_players FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.rooms r
      WHERE r.id = room_players.room_id
        AND r.game_master_id = auth.uid()
    )
  );

-- 6. Política DELETE para room_events (GMs podem limpar o chat)
DROP POLICY IF EXISTS "GMs podem limpar eventos" ON public.room_events;
CREATE POLICY "GMs podem limpar eventos"
  ON public.room_events FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.rooms r
      WHERE r.id = room_events.room_id
        AND r.game_master_id = auth.uid()
    )
  );

-- 7. Ativar Realtime nas tabelas que ainda não têm
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_players;

-- 8. Função RPC para exclusão de conta pelo próprio usuário
-- Permite que o usuário logado delete seu próprio registro na tabela auth.users
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- PRONTO! Verifique no Table Editor que as colunas apareceram.
-- ============================================================
