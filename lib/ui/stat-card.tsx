"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CountUp } from "./count-up";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon?: React.ReactNode;
  tone?: "brand" | "emerald" | "amber" | "rose" | "slate";
  hint?: string;
}

const toneMap = {
  brand: "text-brand-600 bg-brand-50",
  emerald: "text-emerald-600 bg-emerald-50",
  amber: "text-amber-600 bg-amber-50",
  rose: "text-rose-600 bg-rose-50",
  slate: "text-slate-600 bg-slate-100",
};

export function StatCard({
  label,
  value,
  prefix,
  suffix,
  decimals,
  icon,
  tone = "brand",
  hint,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card animate-fade-in-up">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        {icon && (
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              toneMap[tone]
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
        <CountUp
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
        />
      </div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}
