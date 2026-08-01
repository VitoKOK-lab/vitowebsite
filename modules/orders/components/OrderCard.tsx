import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";
import type { WorkOrder } from "@/lib/data/models";
import type { IndustryConfig } from "@/lib/industry/adapter";
import type { Role } from "@/lib/types";
import { StageProgress } from "@/lib/ui/stage-progress";
import { Badge } from "@/lib/ui/badge";
import { canSeeGlobalData } from "@/lib/auth/visibility";
import { twd, formatDate } from "@/lib/utils";

export function OrderCard({
  order,
  cfg,
  role,
}: {
  order: WorkOrder;
  cfg: IndustryConfig;
  role: Role;
}) {
  const showMoney = canSeeGlobalData(role);
  return (
    <Link
      href={`/demo/orders/${order.id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-bold text-slate-800 tabular-nums">
          {order.orderNo}
        </span>
        {order.delayed && (
          <Badge tone="rose">
            <AlertTriangle className="h-3 w-3" /> 延遲
          </Badge>
        )}
        {order.done && <Badge tone="emerald">已完成</Badge>}
        <ChevronRight className="ml-auto h-4 w-4 text-slate-300" />
      </div>

      <div className="mt-1 flex items-center justify-between">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-medium text-slate-700">
            {order.customerName}
          </div>
          <div className="truncate text-[12px] text-slate-400">
            {order.itemsSummary} · {order.qty} {cfg.terms.item === "食材" ? "份" : "件"}
          </div>
        </div>
        {showMoney && (
          <div className="shrink-0 text-right">
            <div className="text-[13px] font-bold text-slate-800 tabular-nums">
              {twd(order.amount)}
            </div>
            <div className="text-[11px] text-slate-400">
              預計 {formatDate(order.dueDate)}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3">
        <StageProgress
          stages={cfg.orderStages}
          currentKey={order.currentStage}
          delayed={order.delayed}
        />
      </div>
    </Link>
  );
}
