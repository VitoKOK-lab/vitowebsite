import type { IndustryKey } from "@/lib/types";
import type { AiDecision } from "../models";

/** deterministic 日期(不用 Math.random/Date.now,保 demo 穩定) */
export function iso(daysFromBase: number, hour = 9): string {
  const base = new Date("2026-07-21T00:00:00+08:00").getTime();
  const d = new Date(base + daysFromBase * 86400000);
  d.setHours(hour, (Math.abs(daysFromBase) * 7) % 60, 0, 0);
  return d.toISOString();
}

export function pad(n: number, len = 3): string {
  return String(n).padStart(len, "0");
}

export interface AiDecisionSeed {
  id: string;
  category: string;
  title: string;
  situation: string;
  suggestion: string;
  reasoning: string;
  impact: AiDecision["impact"];
  learningTag?: string;
  adjustOptions?: AiDecision["adjustOptions"];
  module?: AiDecision["module"];
}

export function materialize(
  d: AiDecisionSeed,
  industry: IndustryKey,
  idx = 0
): AiDecision {
  return {
    id: d.id,
    industry,
    module: d.module ?? "decisions",
    category: d.category,
    title: d.title,
    situation: d.situation,
    suggestion: d.suggestion,
    reasoning: d.reasoning,
    impact: d.impact,
    status: "pending",
    createdAt: iso(0, 7 + idx),
    adjustOptions: d.adjustOptions,
    learningTag: d.learningTag,
  };
}
