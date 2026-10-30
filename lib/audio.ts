// Contexte Web Audio partagé : créé uniquement après une interaction
// utilisateur (les navigateurs/WebView refusent de démarrer l'audio sans
// geste). Trois buses : master (mute général), fx (effets), music (morceaux).

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let fx: GainNode | null = null;
let music: GainNode | null = null;

function make(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    fx = ctx.createGain();
    music = ctx.createGain();
    master.gain.value = 1;
    fx.gain.value = 0.6;
    music.gain.value = 0.6;
    fx.connect(master);
    music.connect(master);
    master.connect(ctx.destination);
    return ctx;
  } catch {
    return null;
  }
}

/** Contexte prêt à jouer (null tant qu'aucun geste utilisateur n'a eu lieu). */
export function getAudio():
  | { ctx: AudioContext; master: GainNode; fx: GainNode; music: GainNode }
  | null {
  if (!ctx || !master || !fx || !music) return null;
  if (ctx.state !== "running") return null;
  return { ctx, master, fx, music };
}

/**
 * À appeler sur un événement utilisateur (pointerdown / keydown) :
 * crée le contexte puis le réactive si suspendu. Retourne true si prêt.
 */
export function primeAudio(): boolean {
  if (!ctx) make();
  if (!ctx) return false;
  if (ctx.state === "suspended") void ctx.resume();
  return ctx.state === "running";
}

/** Mute général (réglage « couper le son »). */
export function setMuted(muted: boolean): void {
  if (master) master.gain.value = muted ? 0 : 1;
}

export function setFxVolume(v: number): void {
  if (fx) fx.gain.value = Math.min(1, Math.max(0, v));
}

export function setMusicVolume(v: number): void {
  if (music) music.gain.value = Math.min(1, Math.max(0, v));
}
