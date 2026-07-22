import { describe, it, expect } from "vitest";
import {
  canSeeClass,
  canSeeModule,
  visibleModules,
  canSeeGlobalData,
} from "@/lib/auth/visibility";
import { FACTORY, ECOM } from "@/lib/industry/adapter";

describe("機密欄位可見性", () => {
  it("成本結構僅老闆可見", () => {
    expect(canSeeClass("owner", "cost_structure")).toBe(true);
    expect(canSeeClass("manager", "cost_structure")).toBe(false);
    expect(canSeeClass("staff", "cost_structure")).toBe(false);
  });
  it("客戶名單:老闆與主管可見,員工不可", () => {
    expect(canSeeClass("manager", "customer_list")).toBe(true);
    expect(canSeeClass("staff", "customer_list")).toBe(false);
  });
});

describe("模組可見性", () => {
  it("員工看不到 admin / decisions,但看得到 dashboard", () => {
    expect(canSeeModule("staff", "admin", FACTORY)).toBe(false);
    expect(canSeeModule("staff", "decisions", FACTORY)).toBe(false);
    expect(canSeeModule("staff", "dashboard", FACTORY)).toBe(true);
  });
  it("AI 選品僅電商啟用", () => {
    expect(canSeeModule("owner", "picking", FACTORY)).toBe(false);
    expect(canSeeModule("owner", "picking", ECOM)).toBe(true);
  });
  it("客戶只看到 orders 與 cs", () => {
    expect(visibleModules("customer", FACTORY).sort()).toEqual(["cs", "orders"]);
  });
  it("全局數據僅老闆/主管", () => {
    expect(canSeeGlobalData("owner")).toBe(true);
    expect(canSeeGlobalData("manager")).toBe(true);
    expect(canSeeGlobalData("staff")).toBe(false);
    expect(canSeeGlobalData("customer")).toBe(false);
  });
});
