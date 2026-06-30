/**
 * RPG System Registry
 * 
 * Central registry where each RPG system (T20, D&D 5e, etc.) registers itself
 * with a standardized contract. The rest of the app accesses system-specific
 * logic exclusively through this registry, eliminating scattered conditionals.
 * 
 * Each system must implement the SystemContract interface (see below).
 */

const systems = {};

/**
 * @typedef {Object} SystemStep
 * @property {string} label - Display name for the sidebar
 * @property {React.LazyExoticComponent | React.ComponentType} component - Step component
 * @property {string} [icon] - Optional emoji icon
 */

/**
 * @typedef {Object} SystemContract
 * @property {string} id - Unique system identifier (e.g., 't20', 'dnd5e')
 * @property {string} name - Human-readable system name
 * @property {string} icon - Emoji icon for the system
 * @property {string} color - Primary accent color (hex)
 * @property {string} description - Short system description
 * 
 * @property {Function} computeStats - (charData) => statsObject
 * @property {SystemStep[]} steps - Ordered list of creation steps
 * @property {Function} canGoNext - (stepIndex, char, stats) => { ok, reason }
 * @property {Function} shouldSkipStep - (stepIndex, char, stats) => boolean
 * @property {Function} getInitialCharState - () => object (initial character state)
 * @property {Function} getResetRules - () => object (field reset rules)
 * 
 * @property {React.ComponentType} PlaySheetComponent - Character sheet component
 * @property {React.ComponentType} [CharacterPreviewComponent] - Preview panel component
 * 
 * @property {Object} races - Race data dictionary
 * @property {Object} classes - Class data dictionary
 * @property {Object} origins - Origins/Backgrounds data dictionary
 * 
 * @property {number} [pointBuyPool] - Points available for attribute purchase
 * @property {string[]} [stepLabels] - Computed from steps, cached
 */

/**
 * Registers a system in the registry.
 * @param {SystemContract} system
 */
export function registerSystem(system) {
  if (!system || !system.id) {
    throw new Error('registerSystem: system must have an id');
  }
  if (systems[system.id]) {
    console.warn(`registerSystem: overwriting existing system '${system.id}'`);
  }

  // Cache derived values
  system.stepLabels = system.steps.map(s => s.label);
  system.maxSteps = system.steps.length;

  systems[system.id] = system;
}

/**
 * Retrieves a registered system by ID.
 * @param {string} id
 * @returns {SystemContract}
 */
export function getSystem(id) {
  const system = systems[id];
  if (!system) {
    throw new Error(`getSystem: system '${id}' is not registered. Available: ${Object.keys(systems).join(', ')}`);
  }
  return system;
}

/**
 * Returns all registered system IDs.
 * @returns {string[]}
 */
export function getSystemIds() {
  return Object.keys(systems);
}

/**
 * Returns all registered systems as an array.
 * @returns {SystemContract[]}
 */
export function getAllSystems() {
  return Object.values(systems);
}

/**
 * Checks if a system is registered.
 * @param {string} id
 * @returns {boolean}
 */
export function hasSystem(id) {
  return !!systems[id];
}
