"use client";

import { useMemo } from "react";
import { WEATHER, type WeatherType } from "../lib/data";
import { useGame } from "../store/useGame";
import { formatTime } from "../lib/format";

const SKY: Record<WeatherType, string> = {
  none: "linear-gradient(#7ec8f7 0%, #b6e3fa 55%, #d9f2ff 100%)",
  sun: "linear-gradient(#4db8f0 0%, #8fd6ff 55%, #ffe9a8 100%)",
  rain: "linear-gradient(#7f97ad 0%, #9db4c9 55%, #c3d3e0 100%)",
  storm: "linear-gradient(#3c4a63 0%, #56688a 55%, #71819e 100%)",
};

function Cloud({ top, scale, duration, delay }: { top: string; scale: number; duration: number; delay: number }) {
  return (
    <div
      className="cloud"
      style={{
        top,
        transform: `scale(${scale})`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
      aria-hidden="true"
    >
      <div className="relative h-10 w-24">
        <div className="absolute left-0 top-3 h-8 w-16 rounded-full bg-white/90" />
        <div className="absolute left-6 top-0 h-10 w-12 rounded-full bg-white/95" />
        <div className="absolute left-12 top-2 h-8 w-14 rounded-full bg-white/90" />
      </div>
    </div>
  );
}

function Sun() {
  return (
    <div className="absolute left-8 top-8" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="sun-rays h-28 w-28" style={{ transformOrigin: "center" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={i}
            x="57"
            y="2"
            width="6"
            height="26"
            rx="3"
            fill="#ffd23f"
            transform={`rotate(${i * 30} 60 60)`}
          />
        ))}
      </svg>
      <div className="absolute inset-0 m-auto h-16 w-16 rounded-full border-4 border-[#e0a413] bg-[#ffd23f] shadow-[inset_-6px_-6px_0_rgba(224,164,19,0.4)]" />
    </div>
  );
}

function Rain({ count, fast }: { count: number; fast?: boolean }) {
  const drops = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: fast ? 0.5 + Math.random() * 0.4 : 0.9 + Math.random() * 0.8,
      })),
    [count, fast]
  );
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {drops.map((d, i) => (
        <span
          key={i}
          className="raindrop"
          style={{
            left: `${d.left}%`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            transform: fast ? "rotate(14deg)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

function Field() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 h-[26vh]"
      aria-hidden="true"
      style={{
        background: "linear-gradient(#7ec850 0%, #5aa832 100%)",
        borderTop: "6px solid #3f7d1f",
      }}
    >
      <div
        className="absolute inset-x-0 top-2 h-6"
        style={{
          background: "radial-gradient(circle 14px at 10px 0, #8fd963 0 13px, transparent 14px)",
          backgroundSize: "44px 24px",
          backgroundRepeat: "repeat-x",
        }}
      />
      <div
        className="absolute inset-x-0 top-8 h-6"
        style={{
          background: "radial-gradient(circle 14px at 10px 0, #86d15b 0 13px, transparent 14px)",
          backgroundSize: "44px 24px",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "22px 0",
        }}
      />
    </div>
  );
}

function WeatherBadge() {
  const weather = useGame((s) => s.weather);
  const lastTickAt = useGame((s) => s.lastTickAt);
  if (!weather) return null;
  const def = WEATHER[weather.type];
  const remaining = Math.max(0, weather.until - lastTickAt);
  return (
    <div
      className="pointer-events-none absolute bottom-3 right-3 z-10 flex items-center gap-2 rounded-2xl border-4 border-[#3a2414] bg-[#fff8e8]/95 px-3 py-1.5"
      role="status"
      aria-live="polite"
    >
      <span className="text-lg" aria-hidden="true">
        {weather.type === "sun" ? "☀️" : weather.type === "rain" ? "🌧️" : "⛈️"}
      </span>
      <div className="text-xs font-black leading-tight text-[#3a2414]">
        {def.name}
        <span className="block font-bold text-[#8a6d3b]">
          {def.cpsMult > 1 ? `production ×${def.cpsMult}` : ""} · {formatTime(remaining)}
        </span>
      </div>
    </div>
  );
}

export function WeatherLayer() {
  const weather = useGame((s) => s.weather?.type ?? "none");
  const dark = weather === "storm";
  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 transition-[background] duration-1000"
        style={{ background: SKY[weather] }}
      />
      {(weather === "none" || weather === "sun") && <Sun />}
      <Cloud top="10%" scale={1} duration={70} delay={-20} />
      <Cloud top="24%" scale={0.7} duration={95} delay={-60} />
      <Cloud top="6%" scale={0.5} duration={120} delay={-90} />
      {(weather === "rain" || weather === "storm") && (
        <Rain count={weather === "storm" ? 60 : 36} fast={weather === "storm"} />
      )}
      {weather === "storm" && (
        <div className="lightning absolute inset-0 bg-white" />
      )}
      <Field />
      {dark && <div className="absolute inset-0 bg-[#1a2233]/40" />}
      <WeatherBadge />
    </div>
  );
}
