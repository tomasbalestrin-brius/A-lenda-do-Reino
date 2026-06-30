import React, { createContext, useContext, useMemo } from 'react';
import { getSystem } from './registry';

/**
 * React Context that provides the active RPG system to the entire component tree.
 * 
 * Usage:
 *   <SystemProvider systemId="t20">
 *     <CharacterCreation />
 *   </SystemProvider>
 * 
 * Inside any child component:
 *   const system = useSystem();
 *   system.computeStats(char);
 *   system.races, system.classes, etc.
 */

const SystemContext = createContext(null);

/**
 * Provider component that wraps the app tree with the active system context.
 * @param {{ systemId: string, children: React.ReactNode }} props
 */
export function SystemProvider({ systemId, children }) {
  const system = useMemo(() => {
    try {
      return getSystem(systemId);
    } catch (err) {
      console.error(err.message);
      return null;
    }
  }, [systemId]);

  if (!system) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-8">
        <div className="bg-red-950/40 border border-red-500/30 rounded-3xl p-8 max-w-md text-center">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h2 className="text-red-400 font-black text-lg uppercase tracking-wider mb-2">
            Sistema não encontrado
          </h2>
          <p className="text-red-300/70 text-sm">
            O sistema <code className="bg-red-900/30 px-2 py-0.5 rounded">"{systemId}"</code> não está registrado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SystemContext.Provider value={system}>
      {children}
    </SystemContext.Provider>
  );
}

/**
 * Hook to access the active RPG system from any child component.
 * @returns {import('./registry').SystemContract}
 */
export function useSystem() {
  const system = useContext(SystemContext);
  if (!system) {
    throw new Error(
      'useSystem() must be used within a <SystemProvider>. ' +
      'Wrap your component tree with <SystemProvider systemId="t20"> or equivalent.'
    );
  }
  return system;
}

/**
 * Hook that returns the system only if available (does not throw).
 * Useful in components that may render outside a SystemProvider (e.g. library).
 * @returns {import('./registry').SystemContract | null}
 */
export function useSystemOptional() {
  return useContext(SystemContext);
}
