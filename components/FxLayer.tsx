"use client";

import { useEffect, useMemo, useRef } from "react";
import confetti from "canvas-confetti";
import { useReducedMotion } from "framer-motion";
import { onFx } from "../lib/fx";
import { useGame } from "../store/useGame";
import { MiniPotatoIcon } from "./icons";

const COLORS = ["#ffd23f", "#7ec850", "#4d9fe0", "#e04444", "#8b5cf6", "#ffffff"];

// Couche d'effets : étincelles -> confettis -> explosion plein écran ->
// pluie de mini-patates, selon le log10 du prix de l'achat.
export function FxLayer() {
  const reduced = useReducedMotion();
  const flash = useGame((s) => s.flash);
  const potatoRain = useGame((s) => s.potatoRain);
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const setStore = useGame.setState;
    const off = onFx((e) => {
      if (reduced) {
        if (e.tier >= 2) {
          setStore({ flash: { seq: e.seq, big: false } });
          setTimeout(() => setStore({ flash: null }), 500);
        }
        return;
      }
      const origin = { x: e.x ?? 0.5, y: e.y ?? 0.5 };
      if (e.tier >= 1) {
        confetti({
          particleCount: 10 + e.tier * 10,
          spread: 55 + e.tier * 10,
          startVelocity: 14 + e.tier * 4,
          gravity: 0.9,
          scalar: 0.9,
          colors: e.color ? [e.color, "#ffffff", "#ffd23f"] : COLORS,
          origin,
        });
      }
      if (e.tier >= 2) {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 75,
          startVelocity: 45,
          gravity: 0.9,
          colors: COLORS,
          origin: { x: 0, y: 0.95 },
        });
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 75,
          startVelocity: 45,
          gravity: 0.9,
          colors: COLORS,
          origin: { x: 1, y: 0.95 },
        });
        setStore({ flash: { seq: e.seq, big: e.tier >= 3 } });
        setTimeout(() => setStore({ flash: null }), 550);
      }
      if (e.tier >= 3) {
        setStore({ shaking: true });
        if (shakeTimer.current) clearTimeout(shakeTimer.current);
        shakeTimer.current = setTimeout(() => setStore({ shaking: false }), 500);
      }
      if (e.tier >= 4) {
        setStore({ potatoRain: { seq: e.seq, count: 12 } });
        setTimeout(() => setStore({ potatoRain: null }), 3400);
      }
    });
    return () => {
      off();
      if (shakeTimer.current) clearTimeout(shakeTimer.current);
    };
  }, [reduced]);

  const drops = useMemo(
    () =>
      potatoRain
        ? Array.from({ length: potatoRain.count }).map((_, i) => ({
            left: 5 + Math.random() * 90,
            duration: 1.6 + Math.random() * 1.2,
            delay: Math.random() * 0.8,
            size: i % 3 === 0 ? "h-10 w-10" : "h-7 w-7",
          }))
        : [],
    [potatoRain]
  );

  return (
    <>
      {/* Flash */}
      {flash && (
        <div
          key={flash.seq}
          className="flash pointer-events-none fixed inset-0 z-40"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(255,244,196,0.95) 0%, rgba(255,210,63,0.5) 40%, transparent 75%)",
          }}
          aria-hidden="true"
        />
      )}
      {/* Rayons de lumière */}
      {flash?.big && (
        <div
          key={`r${flash.seq}`}
          className="rays pointer-events-none fixed z-30"
          style={{
            left: "50%",
            top: "45%",
            width: "160vmin",
            height: "160vmin",
            transform: "translate(-50%, -50%)",
            background:
              "repeating-conic-gradient(rgba(255,210,63,0.55) 0deg 10deg, transparent 10deg 20deg)",
            WebkitMaskImage: "radial-gradient(circle, black 15%, transparent 68%)",
            maskImage: "radial-gradient(circle, black 15%, transparent 68%)",
          }}
          aria-hidden="true"
        />
      )}
      {/* Pluie de mini-patates */}
      {potatoRain && (
        <div
          key={potatoRain.seq}
          className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
          aria-hidden="true"
        >
          {drops.map((d, i) => (
            <div
              key={i}
              className="mini-potato"
              style={{
                left: `${d.left}%`,
                animationDuration: `${d.duration}s`,
                animationDelay: `${d.delay}s`,
              }}
            >
              <MiniPotatoIcon className={d.size} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
