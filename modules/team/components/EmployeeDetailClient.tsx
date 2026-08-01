"use client";

import Link from "next/link";
import {
  Trophy,
  Package,
  CheckCircle2,
  Timer,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import { useSession } from "@/lib/auth/SessionProvider";
import { employeeDetail } from "@/modules/dashboard/service";
import { BackButton } from "@/lib/ui/back-button";
import { Avatar } from "@/lib/ui/avatar";
import { Badge } from "@/lib/ui/badge";
import { cn } from "@/lib/utils";
import type { IndustryKey } from "@/lib/types";

const INDUSTRIES: IndustryKey[] = ["factory", "ecom", "kitchen"];

export function EmployeeDetailClient({ id }: { id: string }) {
  const { version } = useSession();
  void version; // 訂閱 mutation,結案數變動後重讀

  // 跨產業定位員工(id 全域唯一)
  let detail;
  for (const k of INDUSTRIES) {
    const d = employeeDetail(k, id);
    if (d) {
      detail = d;
      break;
    }
  }

  if (!detail) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center text-sm text-slate-400">
        查無此員工
        <div className="mt-3">
          <Link href="/demo/dashboard" className="text-brand-600">
            返回總覽
          </Link>
        </div>
      </div>
    );
  }

  const medal = ["🥇", "🥈", "🥉"][detail.rank - 1];

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <BackButton label="員工貢獻" fallback="/demo/dashboard" />

      {/* 名片 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex items-center gap-4">
          <Avatar name={detail.name} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">{detail.name}</span>
              <Badge tone={detail.role === "manager" ? "brand" : "slate"}>
                {detail.role === "manager" ? "主管" : "員工"}
              </Badge>
            </div>
            <div className="text-[13px] text-slate-400">{detail.dept}</div>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-amber-50 px-3 py-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="mt-0.5 text-lg font-bold leading-none text-amber-600 tabular-nums">
              {medal ?? `#${detail.rank}`}
            </span>
            <span className="text-[10px] text-amber-500/80">貢獻排名</span>
          </div>
        </div>

        {/* 指標 */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Metric label="累計結案" value={detail.closed} />
          <Metric label="準時率" value={detail.onTime} suffix="%" />
          {detail.winRate > 0 ? (
            <Metric label="成交率" value={detail.winRate} suffix="%" />
          ) : (
            <Metric label="進行中" value={detail.orders.total - detail.orders.done} />
          )}
        </div>
      </div>

      {/* 負責訂單概況 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <h2 className="mb-3 flex items-center gap-1.5 px-1 text-[13px] font-semibold text-slate-500">
          <Package className="h-4 w-4 text-brand-500" /> 負責訂單
          <span className="ml-auto flex items-center gap-2 text-[11px] font-normal">
            <span className="text-emerald-600">完成 {detail.orders.done}</span>
            {detail.orders.delayed > 0 && (
              <span className="text-rose-600">延遲 {detail.orders.delayed}</span>
            )}
          </span>
        </h2>
        {detail.openOrders.length === 0 ? (
          <p className="px-1 py-3 text-center text-[13px] text-slate-400">
            目前沒有進行中的訂單
          </p>
        ) : (
          <div className="space-y-2">
            {detail.openOrders.map((o) => (
              <Link
                key={o.id}
                href={`/demo/orders/${o.id}`}
                className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 transition-colors hover:bg-slate-100"
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    o.delayed ? "bg-rose-100 text-rose-600" : "bg-brand-50 text-brand-600"
                  )}
                >
                  {o.delayed ? <Timer className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-slate-800 tabular-nums">
                    {o.orderNo}
                    {o.delayed && (
                      <span className="ml-1.5 text-[11px] font-medium text-rose-500">延遲</span>
                    )}
                  </div>
                  <div className="truncate text-[11px] text-slate-400">{o.customerName}</div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 今日任務 */}
      {detail.tasks.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <h2 className="mb-3 flex items-center gap-1.5 px-1 text-[13px] font-semibold text-slate-500">
            <ClipboardList className="h-4 w-4 text-brand-500" /> 今日任務
          </h2>
          <div className="space-y-1.5">
            {detail.tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-2.5 px-1 py-1">
                {t.done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-200" />
                )}
                <span
                  className={cn(
                    "text-[13px]",
                    t.done ? "text-slate-400 line-through" : "font-medium text-slate-700"
                  )}
                >
                  {t.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <div className="text-xl font-bold text-slate-900 tabular-nums">
        {value}
        {suffix && <span className="text-sm text-slate-400">{suffix}</span>}
      </div>
      <div className="mt-0.5 text-[11px] text-slate-400">{label}</div>
    </div>
  );
}
