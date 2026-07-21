"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Check, X, AlertCircle, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PickingCandidate } from "@/lib/data/models";

export function CandidateCard({ c }: { c: PickingCandidate }) {
  const [state, setState] = React.useState<"idle" | "adopted" | "passed">(
    c.status === "adopted" ? "adopted" : c.status === "passed" ? "passed" : "idle"
  );

  return (
    <motion.div
      layout
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
    >
      <div className="p-4">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-semibold leading-snug text-slate-900">
              {c.productName}
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-400">來源:{c.source}</p>
          </div>
          <div className="flex shrink-0 flex-col items-center rounded-xl bg-brand-50 px-2.5 py-1.5">
            <span className="text-[10px] text-brand-400">趨勢分數</span>
            <span className="text-lg font-bold leading-none text-brand-600 tabular-nums">
              {c.trendScore}
            </span>
          </div>
        </div>

        <p className="mt-2.5 text-[13px] leading-relaxed text-slate-500">{c.analysis}</p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Metric label="預估毛利" value={`${c.estMargin}%`} tone="emerald" />
          <Metric label="建議測款" value={`${c.suggestedTestQty} 件`} tone="brand" />
          <Metric label="預估成本" value={`$${c.estCost}`} tone="slate" />
        </div>

        <div className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[12px] text-amber-700">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>風險:{c.risk}</span>
        </div>
      </div>

      {state === "idle" ? (
        <div className="flex items-stretch border-t border-slate-100">
          <button
            onClick={() => setState("adopted")}
            className="flex flex-1 items-center justify-center gap-1.5 py-3 text-[13px] font-semibold text-emerald-600 hover:bg-emerald-50 active:scale-[0.98]"
          >
            <Check className="h-4 w-4" /> 採納 · 建立測款
          </button>
          <div className="w-px bg-slate-100" />
          <button
            onClick={() => setState("passed")}
            className="flex flex-1 items-center justify-center gap-1.5 py-3 text-[13px] font-semibold text-slate-400 hover:bg-slate-50 active:scale-[0.98]"
          >
            <X className="h-4 w-4" /> 跳過
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center justify-center gap-1.5 py-3 text-[13px] font-semibold",
            state === "adopted"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-50 text-slate-400"
          )}
        >
          {state === "adopted" ? (
            <>
              <FlaskConical className="h-4 w-4" /> 已建立測款任務 ({c.suggestedTestQty} 件)
            </>
          ) : (
            <>已跳過</>
          )}
        </div>
      )}
    </motion.div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "brand" | "slate";
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 text-center">
      <div className="text-[10px] text-slate-400">{label}</div>
      <div
        className={cn(
          "text-[13px] font-bold tabular-nums",
          tone === "emerald" && "text-emerald-600",
          tone === "brand" && "text-brand-600",
          tone === "slate" && "text-slate-700"
        )}
      >
        {value}
      </div>
    </div>
  );
}
