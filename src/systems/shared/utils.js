/**
 * Shared utility functions used by multiple RPG system engines.
 */

/**
 * Normalizes a string for accent-insensitive, case-insensitive comparison.
 * @param {string} s
 * @returns {string}
 */
export function normalize(s) {
  if (!s || typeof s !== 'string') return '';
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/**
 * Checks whether a power name exists in a Set, handling accents and casing.
 * @param {Set<string>} powerSet
 * @param {string} name
 * @returns {boolean}
 */
export function hasPower(powerSet, name) {
  if (!powerSet || !name) return false;
  const searchName = normalize(name);
  return [...powerSet].some(p => normalize(p) === searchName);
}

/**
 * Standard 6-attribute keys used by both T20 and D&D 5e.
 */
export const ATTR_KEYS = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'];

/**
 * Creates a zeroed attributes object.
 * @returns {{ FOR: number, DES: number, CON: number, INT: number, SAB: number, CAR: number }}
 */
export function emptyAttrs() {
  return { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 };
}
