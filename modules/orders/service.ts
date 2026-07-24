import type { IndustryKey, Role } from "@/lib/types";
import type { WorkOrder } from "@/lib/data/models";
import { db } from "@/lib/data/store";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { iso } from "@/lib/data/seeds/helpers";

/** demo:客戶登入時視為第一位客戶 */
export function currentCustomerId(industry: IndustryKey): string {
  return db(industry).customers[0]?.id ?? "";
}

/** 依角色取得可見訂單(客戶只看自己的) */
export function listOrders(industry: IndustryKey, role: Role): WorkOrder[] {
  const all = db(industry).workOrders;
  if (role === "customer") {
    const cid = currentCustomerId(industry);
    return all.filter((o) => o.customerId === cid);
  }
  // 未完成在前、延遲最前
  return [...all].sort((a, b) => {
    if (a.delayed !== b.delayed) return a.delayed ? -1 : 1;
    if (a.done !== b.done) return a.done ? 1 : -1;
    return 0;
  });
}

export function getOrder(industry: IndustryKey, id: string): WorkOrder | undefined {
  return db(industry).workOrders.find((o) => o.id === id);
}

/** 推進到下一站(手機一鍵) */
export function advanceStage(
  industry: IndustryKey,
  id: string,
  by: string,
  withPhoto = false
): { ok: boolean; stage?: string } {
  const cfg = getIndustryConfig(industry);
  const stages = cfg.orderStages;
  const o = db(industry).workOrders.find((x) => x.id === id);
  if (!o) return { ok: false };
  const idx = stages.findIndex((s) => s.key === o.currentStage);
  if (idx < 0 || idx >= stages.length - 1) {
    // 最後一站 → 標記完成
    o.done = true;
    o.delayed = false;
    o.events.push({ stageKey: o.currentStage, by, at: iso(0, 12), photo: withPhoto });
    return { ok: true, stage: o.currentStage };
  }
  const next = stages[idx + 1];
  o.currentStage = next.key;
  o.delayed = false;
  if (next.key === stages[stages.length - 1].key) o.done = true;
  o.events.push({ stageKey: next.key, by, at: iso(0, 12), photo: withPhoto });
  return { ok: true, stage: next.key };
}

export function stageLabel(industry: IndustryKey, key: string): string {
  return (
    getIndustryConfig(industry).orderStages.find((s) => s.key === key)?.label ?? key
  );
}

/** 延遲且未完成的訂單(給員工待處理、老闆警示用) */
export function delayedOrders(industry: IndustryKey): WorkOrder[] {
  return db(industry).workOrders.filter((o) => o.delayed && !o.done);
}

/** 負責人回報處理方式(老闆端可見) */
export function submitResolution(
  industry: IndustryKey,
  id: string,
  by: string,
  text: string
): boolean {
  const o = db(industry).workOrders.find((x) => x.id === id);
  if (!o || !text.trim()) return false;
  o.resolution = { by, text: text.trim(), at: iso(0, 12) };
  return true;
}
