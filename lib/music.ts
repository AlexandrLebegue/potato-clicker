// Lecteur de musique « MIDI-like » 100 % Web Audio : des oscillateurs
// synthétisent les notes stockées dans le code (lib/musicTracks.ts).
// Aucune dépendance, aucun fichier audio externe.
//
// Deux modes de jeu :
//  - boucle temps réel : les notes s'enchaînent d'elles-mêmes, en boucle ;
//  - « 1 clic = 1 note » : la mélodie ne avance qu'au rythme des clics sur
//    la patate (chaque clic joue la note suivante).

import { getAudio } from "./audio";
import { trackById, type MusicTrack } from "./musicTracks";

const NOTE_OFFSETS: Record<string, number> = {
  C: -9, "C#": -8, D: -7, "D#": -6, E: -5, F: -4,
  "F#": -3, G: -2, "G#": -1, A: 0, "A#": 1, B: 2,
};

/** "C4" -> 261.63 Hz (A4 = 440 Hz). */
export function noteToFreq(note: string): number {
  const m = /^([A-G][#b]?)(-?\d+)$/.exec(note);
  if (!m) return 440;
  const semis = (NOTE_OFFSETS[m[1]] ?? 0) + (Number(m[2]) - 4) * 12;
  return 440 * 2 ** (semis / 12);
}

export class MusicEngine {
  private track: MusicTrack | null = null;
  private index = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private loop = false; // boucle temps réel
  private clickMode = false; // 1 clic = 1 note
  private playing = false;

  get isPlaying(): boolean {
    return this.playing;
  }

  get trackId(): string | null {
    return this.track?.id ?? null;
  }

  /** Change de morceau (et arrête la lecture). */
  load(trackId: string | null): void {
    this.stop();
    this.track = trackById(trackId);
    this.index = 0;
  }

  /** Active la boucle temps réel (no-op si déjà en cours). */
  play(): void {
    if (!this.track || this.playing || this.clickMode) return;
    if (!getAudio()) return; // pas encore de geste utilisateur : on attend
    this.loop = true;
    this.playing = true;
    this.schedule();
  }

  /** Arrête tout (boucle et clics). */
  stop(): void {
    this.loop = false;
    this.playing = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /** Bascule le mode « 1 clic = 1 note ». */
  setClickMode(on: boolean): void {
    this.clickMode = on;
    if (on) {
      // la boucle cède la place aux clics
      this.loop = false;
      this.playing = false;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }
  }

  /**
   * Mode « 1 clic = 1 note » : joue la note suivante du morceau.
   * Retourne true si une note a été jouée.
   */
  playNext(): boolean {
    if (!this.track || !getAudio()) return false;
    const [note, beats] = this.track.notes[this.index % this.track.notes.length];
    if (note !== "R") this.playNote(this.track, note, beats);
    this.index += 1;
    return true;
  }

  /** Relance la boucle si elle était censée tourner (après un primeAudio). */
  resume(): void {
    if (this.loop && !this.playing) {
      this.playing = true;
      this.schedule();
    }
  }

  private schedule(): void {
    if (!this.playing || !this.track) return;
    const t = this.track;
    const [note, beats] = t.notes[this.index % t.notes.length];
    const durMs = (beats * 60 * 1000) / t.bpm;
    if (note !== "R") this.playNote(t, note, beats);
    this.index += 1;
    this.timer = setTimeout(() => this.schedule(), durMs);
  }

  private playNote(t: MusicTrack, note: string, beats: number): void {
    const a = getAudio();
    if (!a) return;
    const now = a.ctx.currentTime;
    const dur = Math.max(0.14, ((beats * 60) / t.bpm) * 0.92);
    const osc = a.ctx.createOscillator();
    const gain = a.ctx.createGain();
    osc.type = t.wave;
    osc.frequency.setValueAtTime(noteToFreq(note), now);
    const peak = Math.max(0.001, t.volume * 0.55);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain).connect(a.music);
    osc.start(now);
    osc.stop(now + dur + 0.05);
  }
}

export const musicEngine = new MusicEngine();
