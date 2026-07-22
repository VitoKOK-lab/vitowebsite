import { describe, it, expect } from "vitest";
import { calcQuote } from "@/modules/quote/calc";

describe("calcQuote", () => {
  it("factory:累加非%變數,依毛利算建議售價", () => {
    const r = calcQuote("factory", 10, 25);
    // 材料320 + 工時480 + 表面150 = 950(無 %)
    expect(r.unitCost).toBe(950);
    expect(r.totalCost).toBe(9500);
    expect(r.suggestedPrice).toBe(Math.round(9500 / 0.75));
    expect(r.breakdown).toHaveLength(3);
  });

  it("ecom:百分比變數(平台 8%)以基礎成本加成", () => {
    const r = calcQuote("ecom", 1, 20);
    // 進貨680 + 物流60 = 740;平台 8% → +59
    expect(r.unitCost).toBe(740 + Math.round((740 * 8) / 100));
  });

  it("毛利率夾在 1..80", () => {
    expect(calcQuote("factory", 1, 200).marginPct).toBe(80);
    expect(calcQuote("factory", 1, 0).marginPct).toBe(1);
  });
});
