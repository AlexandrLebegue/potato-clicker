import { describe, expect, it } from "vitest";
import { formatNumber, formatTime, formatCps } from "../lib/format";

describe("formatNumber", () => {
  it("laisse les petits nombres intacts", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(42)).toBe("42");
    expect(formatNumber(999)).toBe("999");
  });

  it("formate les décimales < 1000 sans zéros inutiles", () => {
    expect(formatNumber(0.5)).toBe("0.5");
    expect(formatNumber(999.9)).toBe("999.9");
  });

  it("utilise les suffixes courts", () => {
    expect(formatNumber(1000)).toBe("1K");
    expect(formatNumber(1500)).toBe("1.5K");
    expect(formatNumber(12345)).toBe("12.3K");
    expect(formatNumber(123456)).toBe("123K");
    expect(formatNumber(1_000_000)).toBe("1M");
    expect(formatNumber(2_400_000)).toBe("2.4M");
    expect(formatNumber(1e9)).toBe("1B");
    expect(formatNumber(5.6e9)).toBe("5.6B");
    expect(formatNumber(1e12)).toBe("1T");
  });

  it("arrondit en frontal (999.6K -> 1M)", () => {
    expect(formatNumber(999_600)).toBe("1M");
    expect(formatNumber(9_996_000)).toBe("10M");
  });

  it("continue au-delà de Dc avec aa, ab, ...", () => {
    expect(formatNumber(1e15)).toBe("1Qa");
    expect(formatNumber(1e18)).toBe("1Qi");
    expect(formatNumber(1e21)).toBe("1Sx");
    expect(formatNumber(1e24)).toBe("1Sp");
    expect(formatNumber(1e27)).toBe("1Oc");
    expect(formatNumber(1e30)).toBe("1No");
    expect(formatNumber(1e33)).toBe("1Dc");
    expect(formatNumber(1e36)).toBe("1aa");
    expect(formatNumber(2.5e38)).toBe("250aa");
    expect(formatNumber(1e39)).toBe("1ab");
    expect(formatNumber(1e111)).toBe("1az"); // suite lexicographique : aa..az, ba..
  });

  it("gère les négatifs et l'infini", () => {
    expect(formatNumber(-1500)).toBe("-1.5K");
    expect(formatNumber(Infinity)).toBe("∞");
  });
});

describe("formatTime", () => {
  it("formate secondes, minutes, heures, jours", () => {
    expect(formatTime(42_000)).toBe("42s");
    expect(formatTime(310_000)).toBe("5m 10s");
    expect(formatTime(5 * 3600_000 + 12 * 60_000)).toBe("5h 12m");
    expect(formatTime(30 * 3600_000)).toBe("1j 6h");
  });

  it("négatif -> 0s", () => {
    expect(formatTime(-5000)).toBe("0s");
  });
});

describe("formatCps", () => {
  it("affiche 1 décimale pour les petites valeurs", () => {
    expect(formatCps(0)).toBe("0");
    expect(formatCps(0.1)).toBe("0.1");
    expect(formatCps(1.23)).toBe("1.2");
    expect(formatCps(1500)).toBe("1.5K");
  });
});
