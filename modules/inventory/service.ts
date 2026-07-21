import type { IndustryKey } from "@/lib/types";
import type { Sku } from "@/lib/data/models";
import { db } from "@/lib/data/store";
import { getIndustryConfig } from "@/lib/industry/adapter";

export type StockStatus = "out" | "low" | "expiring" | "normal";

export interface SkuView extends Sku {
  status: StockStatus;
  daysToExpiry?: number;
  suggestedReorder: number;
  coverDays: number;
}

const BASE = new Date("2026-07-21").getTime();

export function skuStatus(s: Sku): { status: StockStatus; daysToExpiry?: number } {
  let daysToExpiry: number | undefined;
  if (s.expiryDate) {
    daysToExpiry = Math.round((new Date(s.expiryDate).getTime() - BASE) / 86400000);
  }
  if (s.onHand === 0) return { status: "out", daysToExpiry };
  if (daysToExpiry !== undefined && daysToExpiry <= 2) return { status: "expiring", daysToExpiry };
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

export function findSku(industry: IndustryKey, q: string): SkuView[] {
  const list = listSkus(industry);
  const kw = q.trim().toLowerCase();
  if (!kw) return list;
  return list.filter(
    (s) => s.name.toLowerCase().includes(kw) || s.sku.toLowerCase().includes(kw)
  );
}

export function getSkuById(industry: IndustryKey, id: string): SkuView | undefined {
  return listSkus(industry).find((s) => s.id === id);
}

/** 盤點差異的 AI 推測原因(mock,情境化) */
export function varianceReason(diff: number, s: Sku): string {
  if (diff === 0) return "帳實相符,無差異 👍";
  if (diff < 0) {
    // 實盤少於帳面
    if (s.category === "海鮮" || s.expiryDate)
      return "可能原因:近期報廢未入帳,或備料耗損高於預期。建議檢查報廢紀錄。";
    if (s.category === "電池" || s.category === "電控")
      return "可能原因:近期樣品出借、或工單領料未即時扣帳。建議比對領料單。";
    return "可能原因:未入帳的出貨、樣品出借或短溢收。建議追查近 7 日異動。";
  }
  return "實盤多於帳面,可能原因:退貨未入帳,或前次盤點少計。建議複核入庫紀錄。";
}
