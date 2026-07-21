import type { IndustryKey } from "@/lib/types";
import type { Quote } from "@/lib/data/models";
import { db } from "@/lib/data/store";
import { getIndustryConfig, type PricingVariable } from "@/lib/industry/adapter";

export function listQuotes(industry: IndustryKey): Quote[] {
  return db(industry).quotes;
}

export interface QuoteBreakItem {
  label: string;
  amount: number;
  note?: string;
}

export interface QuoteResult {
  qty: number;
  unitCost: number;
  totalCost: number;
  marginPct: number;
  suggestedPrice: number;
  breakdown: QuoteBreakItem[];
}

/** 3 秒報價試算:依產業計價變數集計算成本、建議售價 */
export function calcQuote(
  industry: IndustryKey,
  qty: number,
  marginPct: number,
  overrides?: Record<string, number>
): QuoteResult {
  const vars = getIndustryConfig(industry).pricingVariables;
  const val = (v: PricingVariable) => overrides?.[v.key] ?? v.value;

  const breakdown: QuoteBreakItem[] = [];
  // 非百分比變數 → 基礎單位成本
  let baseCost = 0;
  for (const v of vars) {
    if (v.unit.includes("%")) continue;
    baseCost += val(v);
    breakdown.push({ label: v.label, amount: val(v), note: v.unit });
  }
  // 百分比變數 → 以基礎成本加成
  let pctAdd = 0;
  for (const v of vars) {
    if (!v.unit.includes("%")) continue;
    const add = Math.round((baseCost * val(v)) / 100);
    pctAdd += add;
    breakdown.push({ label: `${v.label}(${val(v)}%)`, amount: add, note: "加成" });
  }

  const unitCost = baseCost + pctAdd;
  const totalCost = unitCost * qty;
  const m = Math.min(80, Math.max(1, marginPct));
  const suggestedPrice = Math.round(totalCost / (1 - m / 100));

  return { qty, unitCost, totalCost, marginPct: m, suggestedPrice, breakdown };
}

export const STATUS_META: Record<
  Quote["status"],
  { label: string; tone: "slate" | "brand" | "amber" | "emerald" | "rose" }
> = {
  draft: { label: "草稿", tone: "slate" },
  sent: { label: "已寄出", tone: "brand" },
  read: { label: "已讀", tone: "amber" },
  won: { label: "成交", tone: "emerald" },
  lost: { label: "未成交", tone: "rose" },
};
