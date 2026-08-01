"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  AlertTriangle,
  Sparkles,
  Clock,
  Trophy,
  ChevronRight,
  ArrowUpRight,
  Timer,
  CircleDollarSign,
} from "lucide-react";
import { cn, num } from "@/lib/utils";
import { CountUp } from "@/lib/ui/count-up";
import { Avatar } from "@/lib/ui/avatar";
import { Sparkline } from "./Sparkline";
import { LineChart, BarChart } from "@/lib/ui/charts";
import { accentFor } from "@/lib/ui/chart-theme";
import { BarChart3, LineChart as LineIcon } from "lucide-react";
import type { IndustryKey } from "@/lib/types";
import type { OwnerMetrics, LeaderRow, AlertRow } from "../service";

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, type: "spring", stiffness: 300, damping: 30 },
  }),
};

export function OwnerDashboard({
  metrics,
  leaders,
  alertRows,
  growth,
  industry,
  industryName,
  roleLabel,
  catData,
}: {
  metrics: OwnerMetrics;
  leaders: LeaderRow[];
  alertRows: AlertRow[];
  growth: { adoptRate: number; hoursSaved: number; revenueImpact: number; learnedCount: number };
  industry: IndustryKey;
  industryName: string;
  roleLabel: string;
  catData: { labels: string[]; counts: number[] };
}) {
  const accent = accentFor(industry);
  // 近 7 日日期標籤(結束於 7/21)
  const base = new Date("2026-07-21T00:00:00+08:00").getTime();
  const revLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base - (6 - i) * 86400000);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {/* 標題 */}
      <motion.div custom={0} variants={fade} initial="hidden" animate="show">
        <p className="text-[13px] font-medium text-slate-400">{industryName} · 7 月 21 日</p>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 lg:text-2xl">
          {roleLabel}的營運總覽
        </h1>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        {/* 左欄 */}
        <div className="space-y-4">
          {/* 營收 Hero */}
          <motion.div custom={1} variants={fade} initial="hidden" animate="show">
            <Link
              href="/demo/orders"
              className="group relative block overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-pop"
            >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
                  <CircleDollarSign className="h-3.5 w-3.5" /> 今日營收
                </div>
                <div className="mt-1 text-[32px] font-bold leading-none tracking-tight text-slate-900 tabular-nums">
                  <CountUp value={metrics.revenueToday} prefix="$" />
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[12px] font-semibold",
                      metrics.revenueTrend >= 0
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    )}
                  >
                    <ArrowUpRight className="h-3 w-3" />
                    {metrics.revenueTrend}%
                  </span>
                  <span className="text-[12px] text-slate-400">較昨日</span>
                </div>
              </div>
              <div className="w-28 text-brand-500">
                <Sparkline data={metrics.spark} className="h-10 w-full" />
              </div>
            </div>
            </Link>
          </motion.div>

          {/* KPI grid */}
          <div className="grid grid-cols-2 gap-3">
            <Kpi
              custom={2}
              label="待交訂單"
              value={metrics.pendingOrders}
              icon={<Package className="h-4 w-4" />}
              tone="brand"
              hint={metrics.delayedOrders > 0 ? `${metrics.delayedOrders} 件延遲` : "全部準時"}
              hintTone={metrics.delayedOrders > 0 ? "rose" : "emerald"}
              href="/demo/orders"
            />
            <Kpi
              custom={3}
              label="異常警示"
              value={alertRows.length}
              icon={<AlertTriangle className="h-4 w-4" />}
              tone="amber"
              hint="需關注"
              hintTone="amber"
              href="/demo/inventory"
            />
          </div>

          {/* AI 成長卡 */}
          <motion.div custom={4} variants={fade} initial="hidden" animate="show">
            <Link
              href="/demo/decisions"
              className="block overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white shadow-pop"
            >
              <div className="absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/10" />
              <div className="relative flex items-center gap-1.5 text-[13px] font-semibold text-brand-100">
                <Sparkles className="h-4 w-4" /> AI 同事本月成長
              </div>
              <div className="relative mt-3 grid grid-cols-3 gap-2">
                <GrowthStat label="建議採納率" value={growth.adoptRate} suffix="%" />
                <GrowthStat label="省下工時" value={growth.hoursSaved} suffix="hr" />
                <GrowthStat label="貢獻營收" value={Math.round(growth.revenueImpact / 10000)} suffix="萬" />
              </div>
              <div className="relative mt-3 flex items-center justify-between text-[12px] text-brand-100">
                <span>已學習 {growth.learnedCount} 次偏好</span>
                <span className="flex items-center gap-0.5 font-medium">
                  待你決策 <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* 近 7 日營收趨勢 */}
          <motion.div
            custom={5}
            variants={fade}
            initial="hidden"
            animate="show"
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card"
          >
            <div className="mb-2 flex items-center gap-1.5 px-1">
              <LineIcon className="h-4 w-4 text-brand-500" />
              <h2 className="text-[14px] font-semibold text-slate-800">
                近 7 日營收趨勢
              </h2>
            </div>
            <LineChart
              labels={revLabels}
              data={metrics.spark}
              accent={accent}
              currency
              height={160}
            />
          </motion.div>
        </div>

        {/* 右欄 */}
        <div className="space-y-4">
          {/* 貢獻排行 */}
          <motion.div
            custom={5}
            variants={fade}
            initial="hidden"
            animate="show"
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card"
          >
            <div className="mb-3 flex items-center gap-1.5 px-1">
              <Trophy className="h-4 w-4 text-amber-500" />
              <h2 className="text-[14px] font-semibold text-slate-800">員工貢獻排行</h2>
            </div>
            <div className="space-y-1">
              {leaders.map((l, idx) => (
                <LeaderItem key={l.id} row={l} rank={idx + 1} maxScore={leaders[0].score} />
              ))}
            </div>
          </motion.div>

          {/* 待決策類別分布 */}
          {catData.counts.length > 0 && (
            <motion.div
              custom={6}
              variants={fade}
              initial="hidden"
              animate="show"
              className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card"
            >
              <div className="mb-2 flex items-center gap-1.5 px-1">
                <BarChart3 className="h-4 w-4 text-brand-500" />
                <h2 className="text-[14px] font-semibold text-slate-800">
                  待決策類別分布
                </h2>
              </div>
              <BarChart
                labels={catData.labels}
                data={catData.counts}
                accent={accent}
                suffix=" 件"
                height={Math.max(140, catData.labels.length * 30)}
              />
            </motion.div>
          )}

          {/* 異常警示 */}
          {alertRows.length > 0 && (
            <motion.div
              custom={6}
              variants={fade}
              initial="hidden"
              animate="show"
              className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card"
            >
              <div className="mb-3 flex items-center gap-1.5 px-1">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h2 className="text-[14px] font-semibold text-slate-800">異常警示</h2>
              </div>
              <div className="space-y-2">
                {alertRows.map((a) => (
                  <Link
                    key={a.id}
                    href={a.href}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 transition-colors hover:bg-slate-100"
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        a.kind === "delay" && "bg-rose-100 text-rose-600",
                        a.kind === "low_stock" && "bg-amber-100 text-amber-600",
                        a.kind === "expiry" && "bg-violet-100 text-violet-600"
                      )}
                    >
                      {a.kind === "delay" ? (
                        <Timer className="h-4 w-4" />
                      ) : a.kind === "expiry" ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <Package className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium text-slate-800">
                        {a.title}
                      </div>
                      <div className="truncate text-[11px] text-slate-400">{a.detail}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({
  custom,
  label,
  value,
  icon,
  tone,
  hint,
  hintTone,
  href,
}: {
  custom: number;
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "brand" | "amber";
  hint: string;
  hintTone: "rose" | "emerald" | "amber";
  href?: string;
}) {
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-slate-400">{label}</span>
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg",
            tone === "brand" ? "bg-brand-50 text-brand-600" : "bg-amber-50 text-amber-600"
          )}
        >
          {icon}
        </span>
      </div>
      <div className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
        <CountUp value={value} />
      </div>
      <div
        className={cn(
          "mt-0.5 flex items-center gap-0.5 text-[11px] font-medium",
          hintTone === "rose" && "text-rose-500",
          hintTone === "emerald" && "text-emerald-500",
          hintTone === "amber" && "text-amber-500"
        )}
      >
        {hint}
        {href && <ChevronRight className="h-3 w-3 opacity-60" />}
      </div>
    </>
  );
  const cls =
    "block rounded-2xl border border-slate-200 bg-white p-4 shadow-card" +
    (href ? " transition-shadow hover:shadow-pop" : "");
  return (
    <motion.div custom={custom} variants={fade} initial="hidden" animate="show">
      {href ? (
        <Link href={href} className={cls}>
          {inner}
        </Link>
      ) : (
        <div className={cls}>{inner}</div>
      )}
    </motion.div>
  );
}

function GrowthStat({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-sm">
      <div className="text-[20px] font-bold leading-none tabular-nums">
        <CountUp value={value} suffix={suffix} />
      </div>
      <div className="mt-1 text-[10px] text-brand-100">{label}</div>
    </div>
  );
}

function LeaderItem({ row, rank, maxScore }: { row: LeaderRow; rank: number; maxScore: number }) {
  const medal = ["🥇", "🥈", "🥉"][rank - 1];
  return (
    <Link
      href={`/demo/team/${row.id}`}
      className="flex items-center gap-3 rounded-xl px-1.5 py-2 transition-colors hover:bg-slate-50"
    >
      <span className="w-6 text-center text-[13px] font-bold text-slate-400 tabular-nums">
        {medal ?? rank}
      </span>
      <Avatar name={row.name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold text-slate-800">{row.name}</span>
          <span className="text-[11px] text-slate-400">{row.dept}</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-brand-500"
            initial={{ width: 0 }}
            animate={{ width: `${(row.score / maxScore) * 100}%` }}
            transition={{ delay: 0.2 + rank * 0.06, duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
      <div className="text-right">
        <div className="text-[13px] font-bold text-slate-800 tabular-nums">{num(row.closed)}</div>
        <div className="text-[10px] text-slate-400">
          準時 {row.onTime}%{row.winRate ? ` · 成交 ${row.winRate}%` : ""}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
    </Link>
  );
}
