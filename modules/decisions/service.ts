import type { IndustryKey } from "@/lib/types";
import type { AiDecision, AiLearningLog } from "@/lib/data/models";
import { db } from "@/lib/data/store";
import type { LearningNote } from "@/lib/ai/provider";
import { iso } from "@/lib/data/seeds/helpers";

export type DecisionAction = "adopt" | "adjust" | "reject";

/** 取得目前有效的學習偏好(每個 tag 取最新一筆;note 欄位存 learningTag) */
export function activeLearnings(industry: IndustryKey): LearningNote[] {
  const logs = db(industry).learningLog;
  const notes: LearningNote[] = [];
  const seen = new Set<string>();
  for (let i = logs.length - 1; i >= 0; i--) {
    const log = logs[i];
    const t = log.note;
    if (t && !seen.has(t)) {
      seen.add(t);
      notes.push({ tag: t, text: log.learnedText });
    }
  }
  return notes;
}

export interface DecisionView extends AiDecision {
  /** 若同 tag 已有學習,顯示的提示 */
  learnedHint?: string;
  /** 依學習微調後的建議 */
  displaySuggestion: string;
}

/** 取得決策佇列(套用學習微調) */
export function listDecisions(industry: IndustryKey): DecisionView[] {
  const notes = activeLearnings(industry);
  return db(industry)
    .decisions.map((d) => {
      const note = d.learningTag
        ? notes.find((n) => n.tag === d.learningTag)
        : undefined;
      // 偏好以卡片頂端的綠色提示 pill 呈現即可,不再重複附加到建議內文
      return {
        ...d,
        learnedHint: d.status === "pending" ? note?.text : undefined,
        displaySuggestion: d.suggestion,
      };
    })
    .sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return 0;
    });
}

export function pendingCount(industry: IndustryKey): number {
  return db(industry).decisions.filter((d) => d.status === "pending").length;
}

/** AI 今日「完成的事」件數(demo:已決策 + 一個基底) */
export function doneCount(industry: IndustryKey): number {
  const decided = db(industry).decisions.filter(
    (d) => d.status !== "pending"
  ).length;
  return 12 + decided;
}

export interface ActResult {
  ok: boolean;
  learnedText?: string;
  learningTag?: string;
}

/** 執行決策動作,寫入 learning_log(鐵律:每次決策必寫入) */
export function actOnDecision(
  industry: IndustryKey,
  id: string,
  action: DecisionAction,
  payload?: { optionLabel?: string; freeText?: string; decidedBy?: string }
): ActResult {
  const data = db(industry);
  const d = data.decisions.find((x) => x.id === id);
  if (!d) return { ok: false };

  const decidedBy = payload?.decidedBy ?? "老闆";
  const now = iso(0, 12);

  let humanDecision = "";
  let delta = "";
  let learnedText = "";

  if (action === "adopt") {
    d.status = "adopted";
    humanDecision = "採納 AI 建議";
    delta = "無差異";
    learnedText = "您傾向直接採納此類建議";
  } else if (action === "reject") {
    d.status = "rejected";
    humanDecision = "駁回 AI 建議";
    delta = "駁回";
    learnedText = "您對此類建議較保留,下次 AI 會更謹慎";
  } else {
    d.status = "adjusted";
    const chosen =
      payload?.optionLabel ||
      (payload?.freeText ? payload.freeText.trim() : "自訂調整");
    const opt = d.adjustOptions?.find((o) => o.label === payload?.optionLabel);
    learnedText = opt ? opt.learned : `您偏好:${chosen}`;
    humanDecision = `調整為:${chosen}`;
    delta = `AI 原建議 → ${chosen}`;
  }

  d.humanDecision = humanDecision;
  d.decidedBy = decidedBy;
  d.decidedAt = now;

  const log: AiLearningLog = {
    id: `ll-${id}-${data.learningLog.length}`,
    decisionId: id,
    industry,
    situationSnapshot: d.situation,
    aiSuggestion: d.suggestion,
    humanDecision,
    delta,
    note: d.learningTag ?? "",
    learnedText,
    createdAt: now,
  };
  data.learningLog.push(log);

  return {
    ok: true,
    learnedText:
      action === "adjust" || action === "reject" ? learnedText : undefined,
    learningTag: d.learningTag,
  };
}

/** AI 成長指標(給成長卡) */
export function growthStats(industry: IndustryKey) {
  const logs = db(industry).learningLog;
  const decisions = db(industry).decisions;
  const decided = decisions.filter((d) => d.status !== "pending");
  const adopted = decisions.filter(
    (d) => d.status === "adopted" || d.status === "adjusted"
  ).length;
  const adoptRate =
    decided.length > 0 ? Math.round((adopted / decided.length) * 100) : 86;
  return {
    adoptRate: decided.length > 0 ? adoptRate : 86,
    learnedCount: logs.length,
    hoursSaved: 38 + logs.length * 2,
    revenueImpact: 240000,
  };
}
