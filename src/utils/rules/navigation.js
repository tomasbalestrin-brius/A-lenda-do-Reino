import { getSystem } from '../../systems/registry';

export function canGoNext(step, char, stats) {
  const systemId = char.system || 't20';
  return getSystem(systemId).canGoNext(step, char, stats);
}

export function shouldSkipStep(step, char, stats) {
  const systemId = char.system || 't20';
  return getSystem(systemId).shouldSkipStep(step, char, stats);
}
