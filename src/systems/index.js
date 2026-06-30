/**
 * Systems module — central entry point.
 * 
 * This file:
 * 1. Exports the registry API (registerSystem, getSystem, etc.)
 * 2. Exports the React context API (SystemProvider, useSystem)
 * 3. Exports the migration API
 * 4. Triggers auto-registration of all available systems (side-effect import)
 * 
 * Usage:
 *   import { getSystem, useSystem, SystemProvider } from '../systems';
 */

// Re-export registry
export { registerSystem, getSystem, getSystemIds, getAllSystems, hasSystem } from './registry';

// Re-export context
export { SystemProvider, useSystem, useSystemOptional } from './SystemContext';

// Re-export migration
export { needsMigration, migrateCharacter, migrateAll } from './migrate';

// ─── Auto-register all available systems ──────────────────────────────────────
// Importing these modules triggers their self-registration via registerSystem().
// Add new systems here as they are created.

import './t20';
import './dnd5e';
