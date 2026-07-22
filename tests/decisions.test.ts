import { describe, it, expect, beforeEach } from "vitest";
import { resetStore, db } from "@/lib/data/store";
import {
  listDecisions,
  actOnDecision,
  pendingCount,
} from "@/modules/decisions/service";

beforeEach(() => resetStore());

describe("決策佇列 + 學習迴圈", () => {
  it("調整寫入 learning_log 並回傳學到的偏好", () => {
    const r = actOnDecision("factory", "f-d2", "adjust", {
      optionLabel: "改補 50 支",
    });
    expect(r.ok).toBe(true);
    expect(r.learnedText).toContain("15%");
    expect(db("factory").learningLog).toHaveLength(1);
  });

  it("第二個哇:調整一張 reorder 卡後,另一張 reorder 卡顯示已學習提示", () => {
    // 尚未學習時,兄弟卡沒有提示
    expect(listDecisions("factory").find((d) => d.id === "f-d5")?.learnedHint).toBeUndefined();
    // 調整 f-d2(reorder)
    actOnDecision("factory", "f-d2", "adjust", { optionLabel: "改補 50 支" });
    // f-d5 同為 reorder,應立即反映偏好
    const sibling = listDecisions("factory").find((d) => d.id === "f-d5")!;
    expect(sibling.learnedHint).toBeTruthy();
    expect(sibling.learnedHint).toContain("15%");
  });

  it("採納使待決策數 −1", () => {
    const before = pendingCount("factory");
    actOnDecision("factory", "f-d1", "adopt");
    expect(pendingCount("factory")).toBe(before - 1);
  });

  it("鐵律:每次決策(採納/駁回/調整)都寫入 learning_log", () => {
    actOnDecision("factory", "f-d1", "adopt");
    actOnDecision("factory", "f-d3", "reject");
    actOnDecision("factory", "f-d2", "adjust", { freeText: "自訂" });
    expect(db("factory").learningLog).toHaveLength(3);
  });
});
