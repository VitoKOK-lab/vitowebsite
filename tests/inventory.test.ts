import { describe, it, expect } from "vitest";
import { reorderQty, skuStatus } from "@/modules/inventory/service";
import { varianceReason } from "@/modules/inventory/variance";
import type { Sku } from "@/lib/data/models";

const base: Sku = {
  id: "x", sku: "X", name: "n", category: "電控",
  cost: 100, price: 140, onHand: 10, safetyStock: 20,
  avgDailyUse: 2, leadTimeDays: 7, supplierName: "s",
};

describe("reorderQty", () => {
  it("need = 日用量×前置期 + 安全 − 現有,不為負", () => {
    expect(reorderQty(base)).toBe(2 * 7 + 20 - 10); // 24
    expect(reorderQty({ ...base, onHand: 999 })).toBe(0);
  });
});

describe("skuStatus", () => {
  it("現有 0 → 缺貨", () => expect(skuStatus({ ...base, onHand: 0 }).status).toBe("out"));
  it("低於安全 → low", () => expect(skuStatus(base).status).toBe("low"));
  it("高於安全 → normal", () =>
    expect(skuStatus({ ...base, onHand: 50 }).status).toBe("normal"));
  it("效期 ≤2 天 → expiring(優先於庫存狀態)", () => {
    const soon = new Date("2026-07-22T00:00:00+08:00").toISOString();
    expect(skuStatus({ ...base, onHand: 50, expiryDate: soon }).status).toBe("expiring");
  });
});

describe("varianceReason", () => {
  it("零差異 → 相符", () =>
    expect(varianceReason(0, { category: "電控", perishable: false })).toContain("相符"));
  it("負差 + 電控 → 領料單", () =>
    expect(varianceReason(-3, { category: "電控", perishable: false })).toContain("領料"));
  it("負差 + 易腐 → 報廢紀錄", () =>
    expect(varianceReason(-1, { category: "海鮮", perishable: true })).toContain("報廢"));
  it("正差 → 複核入庫", () =>
    expect(varianceReason(2, { category: "x", perishable: false })).toContain("入庫"));
});
