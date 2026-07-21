import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Camera, Clock, User } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { getOrder, stageLabel } from "@/modules/orders/service";
import { canSeeGlobalData } from "@/lib/auth/visibility";
import { StageProgress } from "@/lib/ui/stage-progress";
import { Badge } from "@/lib/ui/badge";
import { AdvanceButton } from "@/modules/orders/components/AdvanceButton";
import { twd, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { role, industry } = getSession();
  const cfg = getIndustryConfig(industry);
  const order = getOrder(industry, params.id);
  if (!order) notFound();

  const stages = cfg.orderStages;
  const idx = stages.findIndex((s) => s.key === order.currentStage);
  const nextStage = order.done ? null : stages[idx + 1] ?? null;
  const isLast = idx === stages.length - 2;
  const canAdvance = !order.done && role !== "customer";
  const showMoney = canSeeGlobalData(role);

  return (
    <div className="space-y-4">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1 text-[13px] font-medium text-slate-400 hover:text-slate-600"
      >
        <ArrowLeft className="h-4 w-4" /> {cfg.terms.orderNoun}
      </Link>

      {/* header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-slate-900 tabular-nums">
            {order.orderNo}
          </span>
          {order.delayed && <Badge tone="rose">延遲</Badge>}
          {order.done && <Badge tone="emerald">已完成</Badge>}
        </div>
        <div className="mt-1 text-[14px] font-medium text-slate-700">
          {order.customerName}
        </div>
        <div className="text-[13px] text-slate-400">
          {order.itemsSummary} · {order.qty}{" "}
          {cfg.terms.item === "食材" ? "份" : "件"}
        </div>
        <div className="mt-3 flex items-center gap-4 text-[13px]">
          <span className="flex items-center gap-1 text-slate-500">
            <Clock className="h-3.5 w-3.5" /> 預計 {formatDate(order.dueDate)}
          </span>
          {showMoney && (
            <span className="font-semibold text-slate-800 tabular-nums">
              {twd(order.amount)}
            </span>
          )}
        </div>
        <div className="mt-4">
          <StageProgress
            stages={stages}
            currentKey={order.currentStage}
            delayed={order.delayed}
          />
        </div>
      </div>

      {/* advance */}
      {canAdvance && (
        <AdvanceButton
          orderId={order.id}
          nextLabel={nextStage?.label ?? null}
          isLast={isLast}
        />
      )}

      {/* events */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <h2 className="mb-3 px-1 text-[13px] font-semibold text-slate-500">
          進度紀錄
        </h2>
        <div className="space-y-3">
          {[...order.events].reverse().map((e, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-600">
                ✓
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-slate-700">
                  {stageLabel(industry, e.stageKey)}
                  {e.photo && (
                    <span className="ml-1.5 inline-flex items-center gap-0.5 text-[11px] text-brand-500">
                      <Camera className="h-3 w-3" /> 附照
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <User className="h-3 w-3" /> {e.by}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 客戶查詢連結 */}
      {role !== "customer" && (
        <Link
          href={`/track/${order.orderNo}`}
          className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-[13px] font-medium text-slate-500 hover:bg-slate-100"
        >
          🔗 客戶自助查詢頁(只看得到進度與交期)
        </Link>
      )}
    </div>
  );
}
