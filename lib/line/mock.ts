import type { IndustryKey } from "@/lib/types";
import { db } from "@/lib/data/store";
import { pendingCount, doneCount } from "@/modules/decisions/service";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { twd } from "@/lib/utils";

export interface LineDaily {
  title: string;
  lines: string[];
  time: string;
}

/** 產生「LINE 每日摘要」推播內容(畫面模擬,不真的推送) */
export function buildDailyPush(industry: IndustryKey): LineDaily {
  const data = db(industry);
  const cfg = getIndustryConfig(industry);
  const pend = pendingCount(industry);
  const done = doneCount(industry);
  const delayed = data.workOrders.filter((w) => w.delayed).length;
  const lowStock = data.skus.filter((s) => s.onHand < s.safetyStock).length;

  return {
    title: `📊 ${cfg.displayName} 今日摘要`,
    time: "08:00",
    lines: [
      `昨日營收 ${twd(data.revenueToday)}`,
      `AI 已完成 ${done} 件工作`,
      `待您決策 ${pend} 件`,
      `${cfg.terms.order}延遲 ${delayed} 件 · 低於安全庫存 ${lowStock} 項`,
      pend > 0 ? `👉 點我開啟決策佇列` : `✅ 今日無待決策事項`,
    ],
  };
}
