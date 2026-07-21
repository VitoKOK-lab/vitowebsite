import { FileText, Eye, CheckCircle2 } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { listQuotes, STATUS_META } from "@/modules/quote/service";
import { QuoteCalculator } from "@/modules/quote/components/QuoteCalculator";
import { Badge } from "@/lib/ui/badge";
import { SectionTitle } from "@/lib/ui/card";
import { twd, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function QuotePage() {
  const { industry } = getSession();
  const cfg = getIndustryConfig(industry);
  const quotes = listQuotes(industry);
  const unitLabel = cfg.terms.item === "食材" ? "份" : "件";

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <p className="text-[13px] font-medium text-slate-400">{cfg.displayName}</p>
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <FileText className="h-5 w-5 text-brand-500" /> 報價引擎
        </h1>
      </div>

      <QuoteCalculator
        industry={industry}
        itemLabel={cfg.terms.item}
        unitLabel={unitLabel}
      />

      <div className="space-y-3 pt-1">
        <SectionTitle>近期報價 · 追蹤中</SectionTitle>
        {quotes.map((q) => {
          const meta = STATUS_META[q.status];
          return (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
            >
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-slate-800 tabular-nums">
                  {q.quoteNo}
                </span>
                <Badge tone={meta.tone}>
                  {q.status === "read" && <Eye className="h-3 w-3" />}
                  {q.status === "won" && <CheckCircle2 className="h-3 w-3" />}
                  {meta.label}
                </Badge>
                {q.sentAt && (
                  <span className="ml-auto text-[11px] text-slate-400">
                    {formatDate(q.sentAt)} 寄出
                  </span>
                )}
              </div>
              <div className="mt-1.5 text-[14px] font-medium text-slate-700">
                {q.customerName}
              </div>
              <div className="text-[12px] text-slate-400">
                {q.items.map((it) => `${it.name} ${it.spec} ×${it.qty}`).join("、")}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span className="text-[12px] text-slate-400">
                  毛利 <span className="font-semibold text-slate-700">{q.margin}%</span>
                </span>
                <span className="text-[15px] font-bold text-slate-900 tabular-nums">
                  {twd(q.suggestedPrice)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
