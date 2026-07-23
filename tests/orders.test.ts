import { describe, it, expect, beforeEach } from "vitest";
import { resetStore } from "@/lib/data/store";
import { listOrders, advanceStage, getOrder } from "@/modules/orders/service";

beforeEach(() => resetStore());

describe("advanceStage", () => {
  it("推進到下一站並記錄操作者", () => {
    const before = getOrder("factory", "f-wo-0")!;
    const startStage = before.currentStage;
    const r = advanceStage("factory", "f-wo-0", "測試員");
    expect(r.ok).toBe(true);
    const after = getOrder("factory", "f-wo-0")!;
    expect(after.currentStage).not.toBe(startStage);
    expect(after.events[after.events.length - 1].by).toBe("測試員");
  });
});

describe("listOrders 角色範圍", () => {
  it("客戶只看到自己的訂單", () => {
    const list = listOrders("factory", "customer");
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((o) => o.customerId === "f-c1")).toBe(true);
  });
  it("老闆看到全部訂單", () => {
    expect(listOrders("factory", "owner").length).toBe(32);
  });
});
