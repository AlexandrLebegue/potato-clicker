// Lecteur de musique « MIDI-like » 100 % Web Audio : des oscillateurs
// synthétisent les notes stockées dans le code (lib/musicTracks.ts).
// Aucune dépendance, aucun fichier audio externe.
//
// v2.0.2 — plus AUCUNE lecture en arrière-plan / en boucle. Le seul mode :
//   1 clic sur la patate = la note suivante du morceau sélectionné.
//   - c'est le joueur qui crée le rythme ;
//   - la note a une durée courte et fixe, et est COUPÉE si un nouveau clic
//     arrive avant sa fin (« plafonnée jusqu'au clic suivant ») ;
//   - aucune note sans clic : si le joueur s'arrête, le son s'arrête.

import { getAudio } from "./audio";
import { trackById, type MusicTrack } from "./musicTracks";

const NOTE_OFFSETS: Record<string, number> = {
  C: -9, "C#": -8, Db: -8, D: -7, "D#": -6, Eb: -6, E: -5, F: -4,
  "F#": -3, Gb: -2, G: -2, "G#": -1, Ab: -1, A: 0, "A#": 1, Bb: 1, B: 2,
};

/** "C4" -> 261.63 Hz (A4 = 440 Hz). */
export function noteToFreq(note: string): number {
  const m = /^([A-G][#b]?)(-?\d+)$/.exec(note);
  if (!m) return 440;
  const semis = (NOTE_OFFSETS[m[1]] ?? 0) + (Number(m[2]) - 4) * 12;
  return 440 * 2 ** (semis / 12);
}

/** Durée (secondes) d'une note jouée par clic : courte et fixe. */
const CLICK_NOTE_DUR = 0.18;

export class MusicEngine {
  private track: MusicTrack | null = null;
  private index = 0; // notes consommées (croît au-delà d'un cycle : on boucle)
  private current: { osc: OscillatorNode; gain: GainNode } | null = null;

  get trackId(): string | null {
    return this.track?.id ?? null;
  }

  /** Position 0-based de la dernière note jouée dans le morceau (bougée). */
  get noteIndex(): number {
    return this.track ? this.index % this.track.notes.length : 0;
  }

  /** Nombre de notes jouées depuis le chargement du morceau (non borné). */
  get consumed(): number {
    return this.index;
  }

  /** Charge (ou change) le morceau. Efface la position et coupe le son. */
  load(trackId: string | null): void {
    this.stop();
    this.track = trackById(trackId);
    this.index = 0;
  }

  /**
   * Coupe la note en train de sonner (si elle a été « plafonnée » par un
   * clic suivant avant la fin de sa durée). Sans cet appel, plus rien ne
   * peut sonner : il n'y a plus de lecture automatique.
   */
  stop(): void {
    if (!this.current) return;
    const { osc, gain } = this.current;
    this.current = null;
    const a = getAudio();
    const now = a ? a.ctx.currentTime : 0;
    try {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0.0001, now);
      osc.stop(now + 0.02);
    } catch {
      // osc déjà arrêté : rien à faire
    }
  }

  /**
   * Le seul mode de jeu : joue la NOTE SUIVANTE du morceau (la mélodie
   * avance au rythme des clics du joueur). Coupe la note précédente si elle
   * sonne encore (plafonnée jusqu'au clic suivant).
   * Retourne le nombre total de notes consommées (>= 1) si une note a été
   * consommée, -1 sinon (morceau absent ou audio non débloqué).
   */
  playNext(): number {
    if (!this.track || !getAudio()) return -1;
    this.stop(); // plafonne la note précédente au clic suivant
    const [note] = this.track.notes[this.index % this.track.notes.length];
    if (note !== "R") this.playNote(this.track, note);
    this.index += 1;
    return this.index;
  }

  private playNote(t: MusicTrack, note: string): void {
    const a = getAudio();
    if (!a) return;
    const now = a.ctx.currentTime;
    const dur = CLICK_NOTE_DUR;
    const osc = a.ctx.createOscillator();
    const gain = a.ctx.createGain();
    osc.type = t.wave;
    osc.frequency.setValueAtTime(noteToFreq(note), now);
    const peak = Math.max(0.001, t.volume * 0.55);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain).connect(a.music);
    osc.start(now);
    osc.stop(now + dur + 0.05);
    this.current = { osc, gain };
    // référence nettoyée une fois la note finie d'elle-même
    osc.onended = () => {
      if (this.current && this.current.osc === osc) this.current = null;
    };
  }
}

export const musicEngine = new MusicEngine();
