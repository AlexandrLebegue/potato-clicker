import { describe, expect, it } from "vitest";
import { musicEngine, noteToFreq } from "../lib/music";
import { MUSIC_TRACKS, TRACK_IDS, trackById } from "../lib/musicTracks";

describe("noteToFreq", () => {
  it("A4 = 440 Hz", () => {
    expect(noteToFreq("A4")).toBeCloseTo(440, 3);
  });

  it("calcule les notes voisines", () => {
    expect(noteToFreq("C4")).toBeCloseTo(261.63, 0);
    expect(noteToFreq("C#4")).toBeCloseTo(277.18, 0);
    expect(noteToFreq("B3")).toBeCloseTo(246.94, 0);
    expect(noteToFreq("F#2")).toBeCloseTo(92.5, 0);
  });

  it("une note invalide retombe sur 440 Hz", () => {
    expect(noteToFreq("R")).toBe(440);
    expect(noteToFreq("zzz")).toBe(440);
  });

  it("bémols et dièses sont enharmoniques", () => {
    expect(noteToFreq("Bb4")).toBeCloseTo(noteToFreq("A#4"), 6);
    expect(noteToFreq("Db4")).toBeCloseTo(noteToFreq("C#4"), 6);
    expect(noteToFreq("Eb4")).toBeCloseTo(noteToFreq("D#4"), 6);
  });
});

describe("données des morceaux", () => {
  it("7 morceaux, coûts croissants (1..25 graines)", () => {
    expect(MUSIC_TRACKS).toHaveLength(7);
    const costs = MUSIC_TRACKS.map((t) => t.cost);
    expect(costs).toEqual([1, 3, 5, 8, 12, 16, 25]);
    for (let i = 1; i < costs.length; i++) {
      expect(costs[i]).toBeGreaterThan(costs[i - 1]);
    }
  });

  it("chaque morceau a des notes valides et un mode de synthèse connu", () => {
    const valid = /^[A-G][#b]?\d$|^R$/;
    for (const t of MUSIC_TRACKS) {
      expect(t.notes.length).toBeGreaterThan(0);
      for (const [note] of t.notes) {
        expect(note).toMatch(valid);
      }
      expect(["sine", "square", "triangle", "sawtooth"]).toContain(t.wave);
    }
  });

  it("TRACK_IDS couvre tous les morceaux et trackById les retrouve", () => {
    expect(TRACK_IDS.size).toBe(MUSIC_TRACKS.length);
    for (const t of MUSIC_TRACKS) {
      expect(TRACK_IDS.has(t.id)).toBe(true);
      expect(trackById(t.id)?.name).toBe(t.name);
    }
    expect(trackById("inexistant")).toBeNull();
  });
});

describe("MusicEngine (sans AudioContext : mode 1 clic = 1 note)", () => {
  it("mémorise le morceau chargé", () => {
    const id = MUSIC_TRACKS[0].id;
    musicEngine.load(id);
    expect(musicEngine.trackId).toBe(id);
    expect(musicEngine.consumed).toBe(0);
    expect(musicEngine.noteIndex).toBe(0);

    musicEngine.load(MUSIC_TRACKS[2].id);
    expect(musicEngine.trackId).toBe(MUSIC_TRACKS[2].id);
    expect(musicEngine.consumed).toBe(0);
  });

  it("chargement inconnu / null : aucun morceau", () => {
    musicEngine.load("inexistant");
    expect(musicEngine.trackId).toBeNull();
    musicEngine.load(MUSIC_TRACKS[0].id);
    musicEngine.load(null);
    expect(musicEngine.trackId).toBeNull();
  });

  it("sans AudioContext, playNext ne joue rien et ne consomme aucune note", () => {
    musicEngine.load(MUSIC_TRACKS[0].id);
    expect(musicEngine.playNext()).toBe(-1);
    expect(musicEngine.consumed).toBe(0);
    musicEngine.stop(); // doit rester sans effet
    expect(musicEngine.consumed).toBe(0);
  });
});
