// Morceaux du jeu, stockés en notes (aucun fichier audio).
// Le lecteur Web Audio (lib/music.ts) les synthétise à la volée.
//
// Droit d'auteur :
//  - "blowman", "drunksailor", "wellerman", "hornpipe" : airs marins
//    traditionnels du domaine public (transcriptions approchées de la
//    mélodie traditionnelle).
//  - "jardin", "corsaire", "cosmic" : compositions originales de l'app.
//  NE JAMAIS recopier une œuvre protégée (ex. Pirates des Caraïbes).

export interface MusicTrack {
  id: string;
  name: string;
  desc: string;
  cost: number; // en graines légendaires
  bpm: number;
  wave: OscillatorType; // "square" | "sawtooth" | "triangle" | "sine"
  volume: number; // volume relatif 0..1
  notes: [string, number][]; // [note, durée en croches] ; "R" = silence
}

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: "jardin",
    name: "Jardin du matin",
    desc: "Petite mélodie gaie pour démarrer la ferme.",
    cost: 1,
    bpm: 104,
    wave: "triangle",
    volume: 0.5,
    notes: [
      ["E4", 1], ["G4", 1], ["A4", 1], ["C5", 2],
      ["B4", 1], ["A4", 1], ["G4", 1], ["E4", 2],
      ["D4", 1], ["E4", 1], ["F4", 1], ["G4", 2],
      ["E4", 1], ["D4", 1], ["C4", 4],
      ["A4", 1], ["C5", 1], ["B4", 1], ["A4", 1], ["G4", 2],
      ["E4", 1], ["G4", 1], ["A4", 2], ["C5", 4],
    ],
  },
  {
    id: "blowman",
    name: "Blow the Man Down",
    desc: "Air marin traditionnel (domaine public).",
    cost: 3,
    bpm: 118,
    wave: "square",
    volume: 0.32,
    notes: [
      ["C4", 1], ["C4", 1], ["D4", 1], ["C4", 1], ["B3", 1], ["C4", 1], ["D4", 2],
      ["E4", 1], ["D4", 1], ["C4", 1], ["D4", 1], ["E4", 1], ["D4", 1], ["C4", 2],
      ["G3", 1], ["A3", 1], ["B3", 1], ["C4", 1], ["D4", 1], ["C4", 1], ["B3", 1], ["A3", 1], ["G3", 2],
      ["A3", 1], ["B3", 1], ["C4", 1], ["D4", 1], ["E4", 2], ["D4", 2],
      ["C4", 1], ["C4", 1], ["D4", 1], ["C4", 1], ["B3", 1], ["C4", 1], ["D4", 2],
      ["E4", 1], ["D4", 1], ["C4", 1], ["D4", 1], ["E4", 1], ["D4", 1], ["C4", 4],
    ],
  },
  {
    id: "drunksailor",
    name: "Drunken Sailor",
    desc: "Chant de marins traditionnel, joyeux et un peu fêlé.",
    cost: 5,
    bpm: 112,
    wave: "square",
    volume: 0.32,
    notes: [
      ["C4", 0.5], ["C4", 0.5], ["C4", 0.5], ["C4", 0.5], ["E4", 1], ["D4", 0.5], ["C4", 0.5], ["G3", 1],
      ["A4", 0.5], ["G4", 0.5], ["A4", 0.5], ["G4", 0.5], ["C4", 2],
      ["C4", 0.5], ["C4", 0.5], ["C4", 0.5], ["C4", 0.5], ["E4", 1], ["D4", 0.5], ["C4", 0.5], ["G3", 1],
      ["A4", 0.5], ["G4", 0.5], ["A4", 0.5], ["G4", 0.5], ["C4", 2],
      ["F4", 0.5], ["F4", 0.5], ["F4", 0.5], ["F4", 0.5], ["A4", 1], ["G4", 0.5], ["F4", 0.5], ["C4", 1],
      ["F4", 0.5], ["E4", 0.5], ["F4", 0.5], ["E4", 0.5], ["C4", 2],
      ["C4", 0.5], ["C4", 0.5], ["C4", 0.5], ["C4", 0.5], ["E4", 1], ["D4", 0.5], ["C4", 0.5], ["G3", 1],
      ["A4", 0.5], ["G4", 0.5], ["A4", 0.5], ["G4", 0.5], ["C4", 4],
    ],
  },
  {
    id: "wellerman",
    name: "The Wellerman",
    desc: "Mélodie traditionnelle XIXe — le bateau de ravitaillement arrive.",
    cost: 8,
    bpm: 96,
    wave: "triangle",
    volume: 0.5,
    notes: [
      ["E4", 1], ["E4", 1], ["G4", 1], ["A4", 1], ["B4", 1], ["B4", 1], ["A4", 0.5], ["G4", 0.5],
      ["E4", 1], ["E4", 1], ["G4", 1], ["A4", 1], ["B4", 1], ["B4", 1], ["A4", 0.5], ["G4", 0.5],
      ["A4", 1], ["G4", 1], ["F#4", 1], ["G4", 1], ["A4", 1], ["A4", 1], ["G4", 0.5], ["F#4", 0.5],
      ["E4", 2], ["E4", 2],
      ["E4", 1], ["G4", 1], ["A4", 1], ["B4", 1], ["C#5", 1], ["B4", 1], ["A4", 1], ["G4", 1],
      ["A4", 1], ["G4", 1], ["F#4", 1], ["G4", 1], ["E4", 4],
    ],
  },
  {
    id: "hornpipe",
    name: "Sailor's Hornpipe",
    desc: "Pipée de marine endiablée, au violon.",
    cost: 12,
    bpm: 152,
    wave: "sawtooth",
    volume: 0.26,
    notes: [
      ["A4", 0.5], ["A4", 0.5], ["B4", 0.5], ["C#5", 0.5], ["D5", 1], ["C#5", 0.5], ["B4", 0.5],
      ["A4", 0.5], ["G#4", 0.5], ["A4", 0.5], ["B4", 0.5], ["C#5", 1], ["B4", 1],
      ["A4", 0.5], ["A4", 0.5], ["B4", 0.5], ["C#5", 0.5], ["D5", 0.5], ["E5", 0.5], ["F#5", 1], ["E5", 0.5], ["D5", 0.5],
      ["C#5", 0.5], ["B4", 0.5], ["A4", 1], ["B4", 1], ["C#5", 1], ["D5", 1],
      ["E5", 0.5], ["D5", 0.5], ["C#5", 0.5], ["B4", 0.5], ["A4", 0.5], ["G#4", 0.5], ["A4", 1], ["B4", 1],
      ["C#5", 1], ["D5", 2],
      ["A4", 0.5], ["A4", 0.5], ["B4", 0.5], ["C#5", 0.5], ["D5", 1], ["C#5", 0.5], ["B4", 0.5],
      ["A4", 2], ["B4", 2], ["C#5", 4],
    ],
  },
  {
    id: "corsaire",
    name: "Le Corsaire de la baie",
    desc: "Ambiance pirate en sol mineur, dans l'esprit des chants de marins.",
    cost: 16,
    bpm: 92,
    wave: "sawtooth",
    volume: 0.3,
    notes: [
      ["A4", 0.5], ["R", 0.5], ["C5", 0.5], ["R", 0.5], ["A4", 1], ["G4", 1],
      ["E4", 1], ["F4", 1], ["G4", 1], ["A4", 1],
      ["C5", 0.5], ["R", 0.5], ["A4", 0.5], ["G4", 0.5], ["E4", 1], ["F4", 1],
      ["G4", 0.5], ["F4", 0.5], ["E4", 0.5], ["D4", 0.5], ["C4", 1], ["D4", 1],
      ["E4", 0.5], ["R", 0.5], ["G4", 0.5], ["R", 0.5], ["A4", 1], ["C5", 1],
      ["A4", 1], ["C5", 1], ["B4", 1], ["G4", 1],
      ["A4", 0.5], ["R", 0.5], ["C5", 0.5], ["R", 0.5], ["A4", 1], ["G4", 1],
      ["E4", 1], ["D4", 1], ["C4", 2], ["R", 1],
    ],
  },
  {
    id: "cosmic",
    name: "Patate Cosmique",
    desc: "Nappes lentes et arpèges, pour la phase spatiale.",
    cost: 25,
    bpm: 76,
    wave: "sine",
    volume: 0.6,
    notes: [
      ["D4", 1], ["A4", 1], ["F5", 1], ["D5", 1],
      ["Bb4", 1], ["F5", 1], ["B4", 1], ["F4", 1],
      ["D4", 1], ["A4", 1], ["G5", 1], ["D5", 1],
      ["F4", 1], ["C5", 1], ["A4", 1], ["F4", 1],
      ["D4", 1], ["A4", 1], ["F5", 1], ["D5", 1],
      ["Bb4", 1], ["F5", 1], ["B4", 1], ["F4", 1],
      ["E4", 1], ["C5", 1], ["A4", 1], ["E4", 1],
      ["D4", 2], ["D5", 2],
    ],
  },
];

export function trackById(id: string | null | undefined): MusicTrack | null {
  if (!id) return null;
  return MUSIC_TRACKS.find((t) => t.id === id) ?? null;
}

export const TRACK_IDS = new Set(MUSIC_TRACKS.map((t) => t.id));
