import { AlertTriangle, Clock, TrendingUp, Truck } from "lucide-react";
import type { Role } from "@/lib/types";
import type { SkuView } from "../service";
import { Badge } from "@/lib/ui/badge";
import { canSeeClass } from "@/lib/auth/visibility";
import { twd, cn } from "@/lib/utils";

const statusMeta = {
  out: { label: "缺貨", tone: "rose" as const },
  low: { label: "低於安全", tone: "amber" as const },
  expiring: { label: "即將到期", tone: "violet" as const },
  normal: { label: "正常", tone: "emerald" as const },
};

export function SkuCard({ sku, role }: { sku: SkuView; role: Role }) {
  const meta = statusMeta[sku.status];
  const seeCost = canSeeClass(role, "cost_structure");
  const seeSupplier = canSeeClass(role, "supplier");
  const pct = Math.min(100, Math.round((sku.onHand / (sku.safetyStock * 2 || 1)) * 100));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[14px] font-semibold text-slate-800">
              {sku.name}
            </span>
            {sku.trend === "hot" && <TrendingUp className="h-3.5 w-3.5 text-rose-500" />}
          </div>
          <div className="text-[11px] text-slate-400 tabular-nums">
            {sku.sku} · {sku.category}
          </div>
        </div>
        <Badge tone={meta.tone}>
          {sku.status === "out" && <AlertTriangle className="h-3 w-3" />}
          {sku.status === "expiring" && <Clock className="h-3 w-3" />}
          {meta.label}
        </Badge>
      </div>

      {/* stock bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-slate-400">
            現有 <span className="font-semibold text-slate-700 tabular-nums">{sku.onHand}</span>
            <span className="text-slate-300"> / 安全 {sku.safetyStock}</span>
          </span>
          <span className="text-slate-400 tabular-nums">可撐 {sku.coverDays} 天</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn(
              "h-full rounded-full",
              sku.status === "out" || sku.status === "low"
                ? "bg-rose-400"
                : sku.status === "expiring"
                ? "bg-violet-400"
                : "bg-emerald-400"
            )}
            style={{ width: `${Math.max(4, pct)}%` }}
          />
        </div>
      </div>

      {/* meta row */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-500">
        <span>成本 <span className="font-medium tabular-nums">{seeCost ? twd(sku.cost) : "＊＊＊"}</span></span>
        <span className="flex items-center gap-1">
          <Truck className="h-3 w-3" /> {seeSupplier ? sku.supplierName : "＊＊＊"}
        </span>
        {sku.daysToExpiry !== undefined && (
          <span className={sku.daysToExpiry <= 2 ? "text-violet-600" : ""}>
            效期 {sku.daysToExpiry} 天
          </span>
        )}
      </div>

      {/* reorder suggestion */}
      {sku.suggestedReorder > 0 && (
        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-brand-50/70 px-2.5 py-1.5 text-[12px] text-brand-700">
          <TrendingUp className="h-3.5 w-3.5" />
          AI 建議補貨 <span className="font-bold tabular-nums">{sku.suggestedReorder}</span>{" "}
          {sku.category === "肉類" || sku.category === "蔬菜" ? "kg" : "件"}
        </div>
      )}
    </div>
  );
}
