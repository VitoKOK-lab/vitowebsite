"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Clock, GraduationCap } from "lucide-react";
import { CountUp } from "@/lib/ui/count-up";

export function GrowthReport({
  adoptRate,
  hoursSaved,
  revenueImpact,
  learnedCount,
}: {
  adoptRate: number;
  hoursSaved: number;
  revenueImpact: number;
  learnedCount: number;
}) {
  const stats = [
    { icon: TrendingUp, label: "建議採納率", value: adoptRate, suffix: "%" },
    { icon: Clock, label: "本月省下工時", value: hoursSaved, suffix: " hr" },
    { icon: Sparkles, label: "貢獻營收估算", value: Math.round(revenueImpact / 10000), suffix: " 萬" },
    { icon: GraduationCap, label: "已學習偏好", value: learnedCount, suffix: " 次" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white shadow-pop"
    >
      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-100">
        <Sparkles className="h-4 w-4" /> AI 同事成長報告 · 本月
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
            <s.icon className="h-4 w-4 text-brand-100" />
            <div className="mt-1.5 text-2xl font-bold leading-none tabular-nums">
              <CountUp value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-1 text-[11px] text-brand-100">{s.label}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[12px] text-brand-100/90">
        AI 把自己當成一位有 KPI 的員工,每次你的決策都讓它更貼近你的偏好。
      </p>
    </motion.div>
  );
}
