import type { IndustryKey } from "@/lib/types";
import type { Quote } from "@/lib/data/models";
import { db } from "@/lib/data/store";

export { calcQuote } from "./calc";
export type { QuoteResult, QuoteBreakItem } from "./calc";

export function listQuotes(industry: IndustryKey): Quote[] {
  return db(industry).quotes;
}

export const STATUS_META: Record<
  Quote["status"],
  { label: string; tone: "slate" | "brand" | "amber" | "emerald" | "rose" }
> = {
  draft: { label: "草稿", tone: "slate" },
  sent: { label: "已寄出", tone: "brand" },
  read: { label: "已讀", tone: "amber" },
  won: { label: "成交", tone: "emerald" },
  lost: { label: "未成交", tone: "rose" },
};
