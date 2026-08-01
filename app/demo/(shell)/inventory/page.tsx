"use client";

import Link from "next/link";
import { Boxes, ClipboardList, ChevronRight } from "lucide-react";
import { useSession } from "@/lib/auth/SessionProvider";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { listSkus, inventorySummary } from "@/modules/inventory/service";
import { SkuCard } from "@/modules/inventory/components/SkuCard";
import { SectionTitle } from "@/lib/ui/card";
import { DoughnutChart } from "@/lib/ui/charts";
import { STATUS } from "@/lib/ui/chart-theme";
import { cn } from "@/lib/utils";


export default function InventoryPage() {
  const { role, industry } = useSession();
  const cfg = getIndustryConfig(industry);
  const list = listSkus(industry);
  const summary = inventorySummary(industry);

  const attention = list.filter((s) => s.status !== "normal");
  const normal = list.filter((s) => s.status === "normal");

  const chips = [
    { label: "總品項", value: summary.total, tone: "slate" },
    { label: "缺貨", value: summary.out, tone: "rose" },
    { label: "低於安全", value: summary.low, tone: "amber" },
    ...(summary.hasExpiry
      ? [{ label: "即將到期", value: summary.expiring, tone: "violet" }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium text-slate-400">{cfg.displayName}</p>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
            <Boxes className="h-5 w-5 text-brand-500" /> 進銷存
          </h1>
        </div>
        <Link
          href="/demo/inventory/stocktake"
          className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2 text-[13px] font-semibold text-white shadow-sm active:scale-95"
        >
          <ClipboardList className="h-4 w-4" /> 盤點
        </Link>
      </div>

      {/* summary chips */}
      <div className="grid grid-cols-4 gap-2">
        {chips.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-center shadow-card"
          >
            <div
              className={cn(
                "text-lg font-bold tabular-nums",
                c.tone === "rose" && "text-rose-600",
                c.tone === "amber" && "text-amber-600",
                c.tone === "violet" && "text-violet-600",
                c.tone === "slate" && "text-slate-800"
              )}
            >
              {c.value}
            </div>
            <div className="text-[10px] text-slate-400">{c.label}</div>
          </div>
        ))}
      </div>

      {/* 庫存健康分布 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <SectionTitle className="mb-2">庫存健康分布</SectionTitle>
        <DoughnutChart
          labels={[
            "正常",
            "低於安全",
            "缺貨",
            ...(summary.hasExpiry ? ["即將到期"] : []),
          ]}
          data={[
            summary.total - summary.out - summary.low - summary.expiring,
            summary.low,
            summary.out,
            ...(summary.hasExpiry ? [summary.expiring] : []),
          ]}
          colors={[
            STATUS.good,
            STATUS.warning,
            STATUS.critical,
            ...(summary.hasExpiry ? [STATUS.info] : []),
          ]}
          height={170}
        />
      </div>

      {attention.length > 0 && (
        <div>
          <SectionTitle className="mb-3">需關注 · {attention.length}</SectionTitle>
          <div className="grid gap-3 lg:grid-cols-2">
            {attention.map((s) => (
              <SkuCard key={s.id} sku={s} role={role} />
            ))}
          </div>
        </div>
      )}

      <div className="pt-1">
        <SectionTitle className="mb-3">庫存充足 · {normal.length}</SectionTitle>
        <div className="grid gap-3 lg:grid-cols-2">
          {normal.slice(0, 8).map((s) => (
            <SkuCard key={s.id} sku={s} role={role} />
          ))}
        </div>
        {normal.length > 8 && (
          <div className="mt-3 flex items-center justify-center gap-1 rounded-xl border border-dashed border-slate-200 py-3 text-[13px] text-slate-400">
            還有 {normal.length - 8} 項 <ChevronRight className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
    </div>
  );
}