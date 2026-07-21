import { Radar, Newspaper, Target, Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { db } from "@/lib/data/store";
import { Badge } from "@/lib/ui/badge";

export const dynamic = "force-dynamic";

const importanceMeta = {
  high: { label: "高影響", tone: "rose" as const },
  mid: { label: "中影響", tone: "amber" as const },
  low: { label: "參考", tone: "slate" as const },
};

export default function RadarPage() {
  const { industry } = getSession();
  const cfg = getIndustryConfig(industry);
  const items = db(industry).radar;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <p className="text-[13px] font-medium text-slate-400">{cfg.displayName}</p>
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <Radar className="h-5 w-5 text-brand-500" /> 產業雷達
        </h1>
        <p className="mt-0.5 text-[13px] text-slate-400">
          AI 每日掃描上下游動態,摘要影響並給建議
        </p>
      </div>

      <div className="space-y-3">
        {items.map((r) => {
          const meta = importanceMeta[r.importance];
          return (
            <div
              key={r.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
            >
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                  <span className="ml-auto text-[11px] text-slate-400">{r.source}</span>
                </div>
                <h3 className="mt-2 text-[15px] font-semibold leading-snug text-slate-900">
                  {r.title}
                </h3>

                <div className="mt-3 space-y-2.5">
                  <Segment
                    icon={<Newspaper className="h-3.5 w-3.5" />}
                    label="事實"
                    text={r.fact}
                    tone="slate"
                  />
                  <Segment
                    icon={<Target className="h-3.5 w-3.5" />}
                    label="對你的影響"
                    text={r.impact}
                    tone="amber"
                  />
                  <Segment
                    icon={<Sparkles className="h-3.5 w-3.5" />}
                    label="AI 建議"
                    text={r.suggestion}
                    tone="brand"
                  />
                </div>
              </div>
              {r.importance === "high" && (
                <div className="border-t border-slate-100 bg-brand-50/50 px-4 py-2.5 text-center text-[12px] font-medium text-brand-600">
                  ⚡ 已為此則生成決策卡,前往決策佇列處理
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Segment({
  icon,
  label,
  text,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
  tone: "slate" | "amber" | "brand";
}) {
  const toneCls =
    tone === "amber"
      ? "text-amber-600"
      : tone === "brand"
      ? "text-brand-600"
      : "text-slate-400";
  return (
    <div>
      <div className={`flex items-center gap-1 text-[11px] font-semibold ${toneCls}`}>
        {icon} {label}
      </div>
      <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{text}</p>
    </div>
  );
}
