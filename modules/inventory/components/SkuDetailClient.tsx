"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  Truck,
  TrendingUp,
  Package,
  CalendarClock,
  Timer,
} from "lucide-react";
import { useSession } from "@/lib/auth/SessionProvider";
import { findSku } from "@/modules/inventory/service";
import { canSeeClass } from "@/lib/auth/visibility";
import { BackButton } from "@/lib/ui/back-button";
import { Badge } from "@/lib/ui/badge";
import { twd, cn, formatDate } from "@/lib/utils";

const statusMeta = {
  out: { label: "缺貨", tone: "rose" as const },
  low: { label: "低於安全", tone: "amber" as const },
  expiring: { label: "即將到期", tone: "violet" as const },
  normal: { label: "正常", tone: "emerald" as const },
};

export function SkuDetailClient({ id }: { id: string }) {
  const { role, version } = useSession();
  void version;

  const found = findSku(id);
  if (!found) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center text-sm text-slate-400">
        查無此品項
        <div className="mt-3">
          <Link href="/inventory" className="text-brand-600">
            返回進銷存
          </Link>
        </div>
      </div>
    );
  }

  const sku = found.sku;
  const meta = statusMeta[sku.status];
  const seeCost = canSeeClass(role, "cost_structure");
  const seeSupplier = canSeeClass(role, "supplier");
  const pct = Math.min(100, Math.round((sku.onHand / (sku.safetyStock * 2 || 1)) * 100));
  const unit = sku.category === "肉類" || sku.category === "蔬菜" ? "kg" : "件";

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <BackButton label="進銷存" fallback="/inventory" />

      {/* header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">{sku.name}</span>
              {sku.trend === "hot" && <TrendingUp className="h-4 w-4 text-rose-500" />}
            </div>
            <div className="text-[12px] text-slate-400 tabular-nums">
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
        <div className="mt-4">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-slate-400">
              現有{" "}
              <span className="font-bold text-slate-800 tabular-nums">{sku.onHand}</span>
              <span className="text-slate-300"> / 安全 {sku.safetyStock}</span>
            </span>
            <span className="text-slate-400 tabular-nums">可撐 {sku.coverDays} 天</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
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
      </div>

      {/* AI 補貨建議 */}
      {sku.suggestedReorder > 0 && sku.status !== "normal" && (
        <Link
          href="/decisions"
          className="flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50/60 p-4 transition-colors hover:bg-brand-50"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
            <TrendingUp className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-brand-800">
              AI 建議補貨 {sku.suggestedReorder} {unit}
            </div>
            <div className="text-[11px] text-brand-600/80">
              依近期用量 · 前置期 {sku.leadTimeDays} 天推算,前往決策佇列確認
            </div>
          </div>
        </Link>
      )}

      {/* 明細 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <h2 className="mb-3 px-1 text-[13px] font-semibold text-slate-500">品項明細</h2>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Row icon={<Package className="h-4 w-4" />} label="日均用量">
            {sku.avgDailyUse} {unit}/天
          </Row>
          <Row icon={<Timer className="h-4 w-4" />} label="前置期">
            {sku.leadTimeDays} 天
          </Row>
          <Row icon={<TrendingUp className="h-4 w-4" />} label="單位成本">
            {seeCost ? twd(sku.cost) : "＊＊＊"}
          </Row>
          <Row icon={<TrendingUp className="h-4 w-4" />} label="售價">
            {seeCost ? twd(sku.price) : "＊＊＊"}
          </Row>
          <Row icon={<Truck className="h-4 w-4" />} label="供應商">
            {seeSupplier ? sku.supplierName : "＊＊＊"}
          </Row>
          {sku.expiryDate && (
            <Row icon={<CalendarClock className="h-4 w-4" />} label="效期">
              <span className={sku.daysToExpiry !== undefined && sku.daysToExpiry <= 2 ? "text-violet-600" : ""}>
                {formatDate(sku.expiryDate)}
                {sku.daysToExpiry !== undefined && `(${sku.daysToExpiry} 天)`}
              </span>
            </Row>
          )}
        </dl>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-slate-300">{icon}</span>
      <div className="min-w-0">
        <dt className="text-[11px] text-slate-400">{label}</dt>
        <dd className="text-[13px] font-medium text-slate-800 tabular-nums">{children}</dd>
      </div>
    </div>
  );
}
