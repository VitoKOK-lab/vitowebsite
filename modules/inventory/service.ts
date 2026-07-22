import type { IndustryKey } from "@/lib/types";
import type { Sku } from "@/lib/data/models";
import { db } from "@/lib/data/store";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { DEMO_MIDNIGHT_MS } from "@/lib/demo-clock";

export type StockStatus = "out" | "low" | "expiring" | "normal";

export interface SkuView extends Sku {
  status: StockStatus;
  daysToExpiry?: number;
  suggestedReorder: number;
  coverDays: number;
}

export function skuStatus(s: Sku): { status: StockStatus; daysToExpiry?: number } {
  let daysToExpiry: number | undefined;
  if (s.expiryDate) {
    daysToExpiry = Math.round(
      (new Date(s.expiryDate).getTime() - DEMO_MIDNIGHT_MS) / 86400000
    );
  }
  if (s.onHand === 0) return { status: "out", daysToExpiry };
  if (daysToExpiry !== undefined && daysToExpiry <= 2)
    return { status: "expiring", daysToExpiry };
  if (s.onHand < s.safetyStock) return { status: "low", daysToExpiry };
  return { status: "normal", daysToExpiry };
}

/** 移動平均補貨建議 */
export function reorderQty(s: Sku): number {
  const need = s.avgDailyUse * s.leadTimeDays + s.safetyStock - s.onHand;
  return Math.max(0, Math.ceil(need));
}

export function listSkus(industry: IndustryKey): SkuView[] {
  return db(industry).skus.map((s) => {
    const { status, daysToExpiry } = skuStatus(s);
    return {
      ...s,
      status,
      daysToExpiry,
      suggestedReorder: reorderQty(s),
      coverDays: s.avgDailyUse > 0 ? Math.round(s.onHand / s.avgDailyUse) : 999,
    };
  });
}

export function inventorySummary(industry: IndustryKey) {
  const list = listSkus(industry);
  return {
    total: list.length,
    out: list.filter((s) => s.status === "out").length,
    low: list.filter((s) => s.status === "low").length,
    expiring: list.filter((s) => s.status === "expiring").length,
    hasExpiry: getIndustryConfig(industry).inventoryMode === "ingredient",
  };
}
