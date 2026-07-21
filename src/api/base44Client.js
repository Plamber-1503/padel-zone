/**
 * base44Client.js — Selector de cliente de backend para PadelZone
 *
 * - En desarrollo local (con servidor en localhost:4000): usa localClient
 * - En producción (GitHub Pages / sin servidor): usa demoClient offline
 */

import { localBase44 } from './localClient';
import { demoBase44 } from './demoClient';

// Si hay un servidor configurado explícitamente via variable de entorno, usamos local.
// En caso contrario (GitHub Pages, mobile, etc.) usamos el cliente demo offline.
const IS_DEMO_MODE = import.meta.env.VITE_API_URL === undefined || import.meta.env.PROD === true;

export const base44 = IS_DEMO_MODE ? demoBase44 : localBase44;

if (IS_DEMO_MODE) {
  console.info('%c[PadelZone] 🎾 Modo Demo Offline — Sin servidor requerido', 'color: #3b82f6; font-weight: bold');
} else {
  console.info('%c[PadelZone] 🎾 Backend Local Activo (Node.js + Express)', 'color: #22c55e; font-weight: bold');
}
