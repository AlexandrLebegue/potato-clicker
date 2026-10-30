"use client";

import { useState } from "react";
import { useGame } from "../store/useGame";
import { MusicNoteIcon, SoundOffIcon, SoundOnIcon } from "./icons";
import { Modal } from "./Modal";
import { TrackProgress } from "./TrackProgress";

function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`cartoon-border flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left font-bold disabled:opacity-50 ${
        checked ? "bg-[#ffe9a8]" : "bg-white"
      }`}
    >
      <span className="text-sm text-[#3a2414]">{label}</span>
      <span
        className={`flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-[#3a2414] p-0.5 transition-colors ${
          checked ? "bg-[#7ec850]" : "bg-[#d8cdb8]"
        }`}
        aria-hidden="true"
      >
        <span
          className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </span>
    </button>
  );
}

function VolumeRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = Math.round(value * 100);
  return (
    <label className="block rounded-2xl border-4 border-[#3a2414] bg-white px-3 py-2">
      <span className="mb-1 flex items-center justify-between text-sm font-bold text-[#3a2414]">
        {label}
        <span className="tabular-nums text-[#8a6d3b]">{pct} %</span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={pct}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="w-full"
        style={{ accentColor: "#e07f3f" }}
        aria-label={label}
      />
    </label>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-4 mb-2 text-sm font-black uppercase tracking-wide text-[#8a6d3b]">
    {children}
  </h3>;
}

// Réglages : son (coupure, volumes), musique, et export/import de la
// sauvegarde (filet de sécurité au moment de changer d'APK ou d'appareil).
export function SettingsModal() {
  const soundOn = useGame((s) => s.soundOn);
  const fxVolume = useGame((s) => s.fxVolume);
  const musicVolume = useGame((s) => s.musicVolume);
  const musicOn = useGame((s) => s.musicOn);
  const musicSelected = useGame((s) => s.musicSelected);
  const toggleSound = useGame((s) => s.toggleSound);
  const setFxVolume = useGame((s) => s.setFxVolume);
  const setMusicVolume = useGame((s) => s.setMusicVolume);
  const toggleMusic = useGame((s) => s.toggleMusic);
  const setModal = useGame((s) => s.setModal);

  const [exportCode, setExportCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [importCode, setImportCode] = useState("");
  const [importError, setImportError] = useState("");
  const [imported, setImported] = useState(false);

  const generateCode = () => {
    setExportCode(useGame.getState().exportSaveCode());
    setCopied(false);
  };

  const copyCode = async () => {
    if (!exportCode) return;
    try {
      await navigator.clipboard.writeText(exportCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // repli : on sélectionne le texte pour copier à la main
      setCopied(false);
    }
  };

  const doImport = () => {
    setImportError("");
    setImported(false);
    if (!importCode.trim()) {
      setImportError("Collez d'abord un code de sauvegarde.");
      return;
    }
    const ok = useGame.getState().importSaveCode(importCode);
    if (ok) {
      setImported(true);
    } else {
      setImportError(
        "Code invalide (attendu : POTATO2: …). La sauvegarde actuelle n'a pas été modifiée."
      );
    }
  };

  const hasTrack = musicSelected !== null;

  return (
    <Modal title="Réglages" onClose={() => setModal(null)} wide>
      <SectionTitle>
        Son {soundOn ? <SoundOnIcon className="inline h-5 w-5" /> : <SoundOffIcon className="inline h-5 w-5" />}
      </SectionTitle>
      <div className="flex flex-col gap-2">
        <Toggle
          checked={soundOn}
          onChange={toggleSound}
          label="Couper le son (tout)"
        />
        <VolumeRow label="Effets" value={fxVolume} onChange={setFxVolume} />
      </div>

      <SectionTitle>
        Musique <MusicNoteIcon className="inline h-5 w-5" />
      </SectionTitle>
      <div className="flex flex-col gap-2">
        <Toggle
          checked={musicOn}
          onChange={toggleMusic}
          disabled={!hasTrack}
          label={
            hasTrack
              ? "Une note sonne à chaque clic sur la patate"
              : "Débloquez un morceau dans la boutique (graines)"
          }
        />
        <VolumeRow label="Volume musique" value={musicVolume} onChange={setMusicVolume} />
        {hasTrack && (
          <div className="rounded-2xl border-4 border-[#3a2414] bg-white p-3">
            <TrackProgress />
          </div>
        )}
        <p className="text-[11px] font-semibold text-[#8a6d3b]">
          Les morceaux se débloquent avec des <b>graines légendaires</b> (prestige « Replanter »),
          onglet <b>Musique</b> de la boutique. Chaque clic sur la patate joue la note suivante
          du morceau sélectionné : plus de lecture en arrière-plan, si vous vous arrêtez de
          cliquer, le son s&rsquo;arrête. Le son démarre après votre premier clic
          (règle des navigateurs).
        </p>
      </div>

      <SectionTitle>Sauvegarde</SectionTitle>
      <div className="flex flex-col gap-2">
        <div className="rounded-2xl border-4 border-[#3a2414] bg-white p-3">
          <div className="mb-1 text-sm font-black text-[#3a2414]">Exporter</div>
          <p className="mb-2 text-[11px] font-semibold text-[#8a6d3b]">
            Copiez ce code et gardez-le précieusement : il contient toute votre partie
            (sauvegarde de secours au moment d&rsquo;une mise à jour d&rsquo;APK ou
            d&rsquo;un changement d&rsquo;appareil).
          </p>
          {exportCode ? (
            <>
              <textarea
                readOnly
                value={exportCode}
                onFocus={(e) => e.currentTarget.select()}
                className="h-20 w-full resize-none rounded-xl border-2 border-[#3a2414]/40 bg-[#fff8e8] p-2 font-mono text-[10px] text-[#3a2414]"
                aria-label="Code de sauvegarde"
              />
              <button
                onClick={copyCode}
                className="cartoon-border mt-2 rounded-xl bg-[#4d9fe0] px-4 py-1.5 text-sm font-black text-white"
              >
                {copied ? "Copié !" : "Copier le code"}
              </button>
            </>
          ) : (
            <button
              onClick={generateCode}
              className="cartoon-border rounded-xl bg-[#4d9fe0] px-4 py-2 text-sm font-black text-white"
            >
              Générer le code
            </button>
          )}
        </div>

        <div className="rounded-2xl border-4 border-[#3a2414] bg-white p-3">
          <div className="mb-1 text-sm font-black text-[#3a2414]">Importer</div>
          <p className="mb-2 text-[11px] font-semibold text-[#8a6d3b]">
            Collez un code exporté (ici ou sur un autre appareil). Remplace la partie
            actuelle.
          </p>
          <textarea
            value={importCode}
            onChange={(e) => {
              setImportCode(e.target.value);
              setImportError("");
              setImported(false);
            }}
            placeholder="POTATO2: …"
            className="h-20 w-full resize-none rounded-xl border-2 border-[#3a2414]/40 bg-[#fff8e8] p-2 font-mono text-[10px] text-[#3a2414]"
            aria-label="Code à importer"
          />
          {importError && (
            <p className="mt-1 text-[11px] font-bold text-[#e04444]">{importError}</p>
          )}
          {imported && (
            <div className="mt-2 flex items-center gap-2">
              <p className="text-[11px] font-bold text-[#2d6a12]">
                Import réussi !
              </p>
              <button
                onClick={() => window.location.reload()}
                className="cartoon-border rounded-xl bg-[#7ec850] px-3 py-1.5 text-sm font-black text-white"
              >
                Recharger le jeu
              </button>
            </div>
          )}
          {!imported && (
            <button
              onClick={doImport}
              className="cartoon-border mt-2 rounded-xl bg-[#7ec850] px-4 py-1.5 text-sm font-black text-white"
            >
              Importer
            </button>
          )}
        </div>

        <p className="text-[11px] font-semibold text-[#8a6d3b]">
          Sauvegarde automatique toutes les 5 s. Une sauvegarde illisible
          n&rsquo;est jamais effacée : elle est mise de côté dans la clé locale
          « potato-farm-save-backup ».
        </p>
      </div>
    </Modal>
  );
}
