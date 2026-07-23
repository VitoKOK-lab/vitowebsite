import type { IndustryKey } from "@/lib/types";

/** 各產業主題色(RGB triplet,對齊 globals.css 的 --brand-600) */
const ACCENT: Record<IndustryKey, string> = {
  factory: "37 99 235", // blue-600
  ecom: "124 58 237", // violet-600
  kitchen: "5 150 105", // emerald-600
};

export function accentFor(industry: IndustryKey): string {
  return ACCENT[industry] ?? ACCENT.factory;
}

export const rgb = (triplet: string) => `rgb(${triplet})`;
export const rgba = (triplet: string, a: number) => `rgb(${triplet} / ${a})`;

/** 保留的狀態色(good / warning / serious / critical)— 不與主題色混用 */
export const STATUS = {
  good: "16 185 129", // emerald-500
  warning: "245 158 11", // amber-500
  critical: "244 63 94", // rose-500
  info: "139 92 246", // violet-500
  slate: "148 163 184", // slate-400
};

export const INK = {
  grid: "241 245 249", // slate-100
  tick: "148 163 184", // slate-400
};
