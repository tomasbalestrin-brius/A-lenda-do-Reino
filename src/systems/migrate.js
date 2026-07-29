// Domínio: systems | Dono ÚNICO de: migrate.js
/**
 * Migration utility for converting characters saved in the old format
 * (with inline system-specific fields) to the new format.
 * 
 * This is a safety net: the new architecture stores system-specific state
 * inside `char.data`, but old characters have everything at root level.
 * 
 * The migration is idempotent — running it multiple times produces the same result.
 */

import { hasSystem } from './registry';

const CURRENT_SCHEMA_VERSION = 3;

/**
 * Checks if a character needs migration.
 * @param {Object} char
 * @returns {boolean}
 */
export function needsMigration(char) {
  if (!char) return false;
  // Characters without schemaVersion or with version < CURRENT are old format
  return (char.schemaVersion || 0) < CURRENT_SCHEMA_VERSION;
}

/**
 * Migrates a character from old format to new format.
 * Old format: everything at root level (char.raca, char.classe, etc.)
 * New format: system-agnostic fields at root, system-specific in same structure
 *             but tagged with schemaVersion for future migrations.
 * 
 * For now, we do NOT restructure into `char.data` — we simply tag the character
 * with the current schema version so we can detect and upgrade later.
 * This keeps full backward compatibility during the transition.
 * 
 * @param {Object} char - The character in old format
 * @returns {Object} - The migrated character
 */
export function migrateCharacter(char) {
  if (!char) return char;
  if (!needsMigration(char)) return char;

  const migrated = { ...char };

  // Ensure system field exists (default to t20 for legacy characters)
  if (!migrated.system) {
    migrated.system = 't20';
  }

  // Validate that the system is registered
  if (!hasSystem(migrated.system)) {
    console.warn(`migrateCharacter: system '${migrated.system}' is not registered, defaulting to 't20'`);
    migrated.system = 't20';
  }

  // Stamp the schema version
  migrated.schemaVersion = CURRENT_SCHEMA_VERSION;

  return migrated;
}

/**
 * Batch-migrates an array of characters.
 * @param {Object[]} characters
 * @returns {Object[]}
 */
export function migrateAll(characters) {
  if (!Array.isArray(characters)) return [];
  return characters.map(c => migrateCharacter(c));
}
