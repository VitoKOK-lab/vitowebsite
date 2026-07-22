import type { IndustryKey } from "@/lib/types";
import { db } from "@/lib/data/store";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { twd } from "@/lib/utils";

export interface LineDaily {
  title: string;
  lines: string[];
  time: string;
}

/**
 * 產生「LINE 每日摘要」推播內容(畫面模擬,不真的推送)。
 * pending/done 由呼叫端(page)傳入,維持 lib 不反向依賴 modules。
 */
export function buildDailyPush(
  industry: IndustryKey,
  counts: { pending: number; done: number }
): LineDaily {
  const data = db(industry);
  const cfg = getIndustryConfig(industry);
  const pend = counts.pending;
  const done = counts.done;
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
