import { Lightbulb } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { db } from "@/lib/data/store";
import { CandidateCard } from "@/modules/picking/components/CandidateCard";

export const dynamic = "force-dynamic";

export default function PickingPage() {
  const { industry } = getSession();
  const cfg = getIndustryConfig(industry);
  const candidates = db(industry).candidates;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <p className="text-[13px] font-medium text-slate-400">{cfg.displayName}</p>
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <Lightbulb className="h-5 w-5 text-brand-500" /> AI 選品
        </h1>
        <p className="mt-0.5 text-[13px] text-slate-400">
          AI 掃描趨勢資料,產出爆品候選卡與建議測款量
        </p>
      </div>

      {candidates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">
          AI 選品為電商產業專屬模組
          <br />
          切換到「3C 選品電商」即可體驗
        </div>
      ) : (
        <div className="space-y-3">
          {candidates.map((c) => (
            <CandidateCard key={c.id} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}
