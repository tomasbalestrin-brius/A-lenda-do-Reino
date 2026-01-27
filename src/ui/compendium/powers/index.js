import { combatePowers } from './combate';
import { magiaPowers } from './magia';
import { destinoPowers } from './destino';
import { tormentaPowers } from './tormenta';
// Próximo: concedidos

export const POWERS = [
  ...combatePowers,
  ...magiaPowers,
  ...destinoPowers,
  ...tormentaPowers
];
