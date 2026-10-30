// Indicateur de progression dans le morceau sélectionné (v2.0.2).
// Plus de lecture en arrière-plan : chaque clic sur la patate joue la note
// suivante — ce composant montre à quelle note on en est (et laquelle sera
// jouée au prochain clic).
import { useGame } from "../store/useGame";
import { trackById } from "../lib/musicTracks";

export function TrackProgress({ className = "" }: { className?: string }) {
  const selected = useGame((s) => s.musicSelected);
  const played = useGame((s) => s.musicNotesPlayed);
  const track = selected ? trackById(selected) : null;
  if (!track) return null;

  const total = track.notes.length;
  const pos = total > 0 ? played % total : 0; // notes déjà jouées ce cycle
  const nextNote = pos + 1; // note jouée au prochain clic
  const pct = total > 0 ? Math.round((pos / total) * 100) : 0;

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-1 text-[10px] font-bold text-[#8a6d3b]">
        <span className="truncate">Progression dans le morceau</span>
        <span className="shrink-0 tabular-nums">
          {track.name} — note {nextNote} / {total}
        </span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#3a2414]/15">
        <div
          className="h-full rounded-full bg-[#8b5cf6] transition-[width] duration-150"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
