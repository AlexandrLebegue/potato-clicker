// Sons optionnels via Web Audio API (pas d'assets externes).
// Coups par défaut ; le bouton mute active/désactive.

type SoundName = "click" | "buy" | "golden" | "toast" | "denied" | "prestige" | "weather";

let ctx: AudioContext | null = null;
let enabled = false;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  ctx: AudioContext,
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
  osc.connect(gain).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

export function setSoundEnabled(on: boolean): void {
  enabled = on;
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export function playSound(name: SoundName): void {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  switch (name) {
    case "click":
      tone(c, 520 + Math.random() * 160, t, 0.07, "triangle", 0.05);
      break;
    case "buy":
      tone(c, 420, t, 0.09, "square", 0.05);
      tone(c, 640, t + 0.08, 0.12, "square", 0.05);
      break;
    case "golden":
      [660, 880, 1100, 1320].forEach((f, i) => tone(c, f, t + i * 0.07, 0.1, "triangle", 0.06));
      break;
    case "toast":
      tone(c, 880, t, 0.12, "sine", 0.05);
      tone(c, 1174, t + 0.1, 0.16, "sine", 0.05);
      break;
    case "denied":
      tone(c, 140, t, 0.12, "sawtooth", 0.04);
      break;
    case "prestige":
      [330, 440, 550, 660, 880].forEach((f, i) => tone(c, f, t + i * 0.09, 0.14, "triangle", 0.06));
      break;
    case "weather":
      tone(c, 260, t, 0.2, "sine", 0.04);
      tone(c, 390, t + 0.18, 0.25, "sine", 0.04);
      break;
  }
}
