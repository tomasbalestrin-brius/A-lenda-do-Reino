import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useCharacterStore } from '../store/useCharacterStore';

const AUTOSAVE_KEY = 'lenda_autosave';
const LOCAL_CHARS_KEY = 'lenda_personagens';
const SCHEMA_VERSION = 2;

/**
 * Gerencia toda a persistência do personagem:
 * - Auto-save em localStorage
 * - Recovery de sessão anterior
 * - CRUD no Supabase com fallback em localStorage
 */
export function useCharacterPersistence({ char, step }) {
  const { updateChar, loadChar } = useCharacterStore();
  const [savedChars, setSavedChars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResume, setShowResume] = useState(false);

  // Auto-save ao mudar personagem ou step
  useEffect(() => {
    if (char.raca || char.classe) {
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ char, step }));
      } catch (e) { /* quota exceeded — ignore */ }
    }
  }, [char, step]);

  // Verifica auto-save ao montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.char?.raca || saved?.char?.classe) setShowResume(true);
      }
    } catch (e) { /* corrompido — ignora */ }

    fetchCharacters();
  }, []);

  async function fetchCharacters() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setSavedChars(data || []);
    } catch {
      try {
        const localRaw = localStorage.getItem(LOCAL_CHARS_KEY);
        const localParsed = localRaw ? JSON.parse(localRaw) : [];
        setSavedChars(Array.isArray(localParsed) ? localParsed : []);
      } catch {
        setSavedChars([]);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleResume = useCallback(() => {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.char) {
          loadChar(saved.char);
          setShowResume(false);
          return saved.step || 0;
        }
      }
    } catch (e) { /* corrompido — recomeça */ }
    setShowResume(false);
    return 0;
  }, [loadChar]);

  const dismissResume = useCallback(() => {
    localStorage.removeItem(AUTOSAVE_KEY);
    setShowResume(false);
  }, []);

  async function handleSave() {
    if (!char.nome?.trim()) return;
    const entry = { ...char, schemaVersion: SCHEMA_VERSION };

    try {
      const { data, error } = await supabase
        .from('characters')
        .upsert({ id: char.id || undefined, name: char.nome, data: entry }, { onConflict: 'id' })
        .select();
      if (error) throw error;

      if (char.id) {
        setSavedChars(prev => prev.map(c => c.id === char.id ? data[0] : c));
      } else {
        setSavedChars(prev => [data[0], ...prev]);
        updateChar({ id: data[0].id });
      }
      localStorage.setItem(LOCAL_CHARS_KEY, JSON.stringify([data[0], ...savedChars.filter(c => c.id !== data[0].id)]));
    } catch {
      const next = [...savedChars, entry];
      setSavedChars(next);
      localStorage.setItem(LOCAL_CHARS_KEY, JSON.stringify(next));
    }
  }

  function handleLoadFromLibrary(savedChar) {
    const charData = savedChar.data || savedChar;
    loadChar(charData);
    return true;
  }

  async function handleDelete(idx) {
    const target = savedChars[idx];
    if (target.id) {
      try {
        const { error } = await supabase.from('characters').delete().eq('id', target.id);
        if (error) throw error;
      } catch (e) {
        console.error('Error deleting character:', e.message);
      }
    }
    const next = savedChars.filter((_, i) => i !== idx);
    setSavedChars(next);
    localStorage.setItem(LOCAL_CHARS_KEY, JSON.stringify(next));
  }

  return {
    savedChars,
    loading,
    showResume,
    handleResume,
    dismissResume,
    handleSave,
    handleLoadFromLibrary,
    handleDelete,
  };
}
