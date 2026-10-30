// Sons d'interface (effets) via Web Audio API, sur la bus « fx » partagée
// (lib/audio.ts). Aucun asset externe. Coups par défaut ; le réglage global
// « couper le son » passe le master à 0.

import { getAudio, setMuted } from "./audio";

type SoundName = "click" | "buy" | "golden" | "toast" | "denied" | "prestige" | "weather";

let enabled = false;

function tone(
  ctx: AudioContext,
  out: GainNode,
  freq: number,
  at: number,
  dur: number,
  type: OscillatorType,
  vol: number
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(vol, at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain).connect(out);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

/** Le son global est-il activé (bouton du bandeau) ? */
export function isSoundEnabled(): boolean {
  return enabled;
}

export function setSoundEnabled(on: boolean): void {
  enabled = on;
  setMuted(!on);
}

export function playSound(name: SoundName): void {
  if (!enabled) return;
  const a = getAudio();
  if (!a) return; // pas encore d'interaction utilisateur : audio non débloqué
  const t = a.ctx.currentTime;
  const out = a.fx;
  switch (name) {
    case "click":
      tone(a.ctx, out, 520 + Math.random() * 160, t, 0.07, "triangle", 0.05);
      break;
    case "buy":
      tone(a.ctx, out, 420, t, 0.09, "square", 0.05);
      tone(a.ctx, out, 640, t + 0.08, 0.12, "square", 0.05);
      break;
    case "golden":
      [660, 880, 1100, 1320].forEach((f, i) =>
        tone(a.ctx, out, f, t + i * 0.07, 0.1, "triangle", 0.06)
      );
      break;
    case "toast":
      tone(a.ctx, out, 880, t, 0.12, "sine", 0.05);
      tone(a.ctx, out, 1174, t + 0.1, 0.16, "sine", 0.05);
      break;
    case "denied":
      tone(a.ctx, out, 140, t, 0.12, "sawtooth", 0.04);
      break;
    case "prestige":
      [330, 440, 550, 660, 880].forEach((f, i) =>
        tone(a.ctx, out, f, t + i * 0.09, 0.14, "triangle", 0.06)
      );
      break;
    case "weather":
      tone(a.ctx, out, 260, t, 0.2, "sine", 0.04);
      tone(a.ctx, out, 390, t + 0.18, 0.25, "sine", 0.04);
      break;
  }
}
