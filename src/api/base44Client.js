/**
 * base44Client.js — Cliente de backend para PadelZone
 *
 * Usa el cliente demo offline que funciona en cualquier dispositivo
 * (celular, computadora, GitHub Pages) sin necesitar servidor.
 */

import { demoBase44 } from './demoClient';

export const base44 = demoBase44;

console.info('%c[PadelZone] 🎾 Modo Demo Offline — Funciona sin servidor', 'color: #3b82f6; font-weight: bold');
