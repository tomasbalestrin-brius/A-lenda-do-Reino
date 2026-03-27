import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useCharacterStore } from '../store/useCharacterStore';

const AUTOSAVE_KEY = 'lenda_autosave';
const LOCAL_CHARS_KEY = 'lenda_personagens';
const SCHEMA_VERSION = 2;

/** Detecta se localStorage está disponível (falha em modo privado Safari) */
function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gerencia toda a persistência do personagem:
 * - Auto-save em localStorage com debounce de 800ms
 * - Recovery de sessão anterior
 * - CRUD no Supabase com fallback em localStorage
 */
export function useCharacterPersistence({ char, step }) {
  const { updateChar, loadChar } = useCharacterStore();
  const [savedChars, setSavedChars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResume, setShowResume] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const saveTimerRef = useRef(null);

  // Verificar disponibilidade do localStorage uma vez
  useEffect(() => {
    if (!isStorageAvailable()) {
      setStorageUnavailable(true);
    }
  }, []);

  // Auto-save com debounce de 800ms — evita JSON.stringify bloqueante a cada keystroke
  useEffect(() => {
    if (!char.raca && !char.classe) return;
    if (storageUnavailable) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ char, step }));
      } catch { /* quota exceeded — ignore */ }
    }, 800);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [char, step, storageUnavailable]);

  // Verifica auto-save ao montar
  useEffect(() => {
    if (!storageUnavailable) {
      try {
        const raw = localStorage.getItem(AUTOSAVE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved?.char?.raca || saved?.char?.classe) setShowResume(true);
        }
      } catch { /* corrompido — ignora */ }
    }

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
      if (!storageUnavailable) {
        try {
          const localRaw = localStorage.getItem(LOCAL_CHARS_KEY);
          const localParsed = localRaw ? JSON.parse(localRaw) : [];
          setSavedChars(Array.isArray(localParsed) ? localParsed : []);
        } catch {
          setSavedChars([]);
        }
      } else {
        setSavedChars([]);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleResume = useCallback(() => {
    if (storageUnavailable) { setShowResume(false); return 0; }
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
    } catch { /* corrompido — recomeça */ }
    setShowResume(false);
    return 0;
  }, [loadChar, storageUnavailable]);

  const dismissResume = useCallback(() => {
    if (!storageUnavailable) localStorage.removeItem(AUTOSAVE_KEY);
    setShowResume(false);
  }, [storageUnavailable]);

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
      if (!storageUnavailable) {
        localStorage.setItem(LOCAL_CHARS_KEY, JSON.stringify([data[0], ...savedChars.filter(c => c.id !== data[0].id)]));
      }
    } catch {
      const next = [...savedChars, entry];
      setSavedChars(next);
      if (!storageUnavailable) {
        localStorage.setItem(LOCAL_CHARS_KEY, JSON.stringify(next));
      }
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
    if (!storageUnavailable) {
      localStorage.setItem(LOCAL_CHARS_KEY, JSON.stringify(next));
    }
  }

  return {
    savedChars,
    loading,
    showResume,
    storageUnavailable,
    handleResume,
    dismissResume,
    handleSave,
    handleLoadFromLibrary,
    handleDelete,
  };
}
