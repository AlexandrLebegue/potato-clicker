// Petit bus d'événements pour les effets visuels (confettis, flash,
// secousse, pluie de mini-patates). Les actions du store déclenchent,
// le composant FxLayer s'abonne et anime.

export interface FxEvent {
  seq: number;
  tier: 1 | 2 | 3 | 4;
  x?: number; // origine relative 0..1
  y?: number;
  color?: string;
}

type Listener = (e: FxEvent) => void;

let seq = 0;
const listeners = new Set<Listener>();

export function onFx(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function fireFx(tier: 1 | 2 | 3 | 4, x?: number, y?: number, color?: string): void {
  seq += 1;
  const e: FxEvent = { seq, tier, x, y, color };
  listeners.forEach((l) => {
    try {
      l(e);
    } catch {
      // un listener cassé ne bloque pas le jeu
    }
  });
}
