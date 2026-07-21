"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/lib/ui/badge";
import type { DecisionView } from "../service";

const categoryTone: Record<string, string> = {
  補貨: "brand",
  調價: "amber",
  工單延遲: "rose",
  品檢: "violet",
  滯銷: "amber",
  選品: "emerald",
  平台費: "amber",
  效期警示: "rose",
  備料不足: "amber",
  成本: "amber",
  耗損: "violet",
};

export interface ActPayload {
  action: "adopt" | "adjust" | "reject";
  optionLabel?: string;
  freeText?: string;
}

export function DecisionCard({
  decision,
  onAct,
}: {
  decision: DecisionView;
  onAct: (id: string, payload: ActPayload) => Promise<void>;
}) {
  const [showReasoning, setShowReasoning] = React.useState(false);
  const [adjustOpen, setAdjustOpen] = React.useState(false);
  const [freeText, setFreeText] = React.useState("");
  const [busy, setBusy] = React.useState<null | string>(null);

  const tone = (categoryTone[decision.category] ?? "slate") as
    | "brand"
    | "amber"
    | "rose"
    | "violet"
    | "emerald"
    | "slate";

  async function act(payload: ActPayload) {
    setBusy(payload.action);
    await onAct(decision.id, payload);
  }

  return (
    <motion.div
      layout
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
    >
      <div className="p-4 sm:p-5">
        {/* header */}
        <div className="flex items-center gap-2">
          <Badge tone={tone}>{decision.category}</Badge>
          <span className="ml-auto flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Sparkles className="h-3 w-3 text-brand-400" />
            AI 建議
          </span>
        </div>

        {/* title */}
        <h3 className="mt-2.5 text-[15px] font-semibold leading-snug text-slate-900">
          {decision.title}
        </h3>

        {/* situation */}
        <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
          {decision.situation}
        </p>

        {/* learned hint */}
        {decision.learnedHint && (
          <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[12px] text-emerald-700">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>已依您的偏好調整:{decision.learnedHint}</span>
          </div>
        )}

        {/* suggestion */}
        <div className="mt-3 rounded-xl bg-brand-50/60 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
            AI 建議
          </div>
          <p className="mt-1 whitespace-pre-line text-[14px] font-medium leading-relaxed text-slate-800">
            {decision.displaySuggestion}
          </p>
        </div>

        {/* impact chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {decision.impact.map((im, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5"
            >
              <span className="text-[11px] text-slate-400">{im.label}</span>
              <span
                className={cn(
                  "text-[13px] font-bold",
                  im.tone === "rose" && "text-rose-600",
                  im.tone === "amber" && "text-amber-600",
                  im.tone === "emerald" && "text-emerald-600",
                  im.tone === "brand" && "text-brand-600",
                  (!im.tone || im.tone === "slate") && "text-slate-600"
                )}
              >
                {im.value}
              </span>
            </div>
          ))}
        </div>

        {/* reasoning toggle */}
        <button
          onClick={() => setShowReasoning((v) => !v)}
          className="mt-3 flex items-center gap-1 text-[12px] font-medium text-slate-400 hover:text-slate-600"
        >
          AI 判斷理由
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              showReasoning && "rotate-180"
            )}
          />
        </button>
        {showReasoning && (
          <p className="mt-1.5 animate-fade-in-up rounded-lg bg-slate-50 p-2.5 text-[12px] leading-relaxed text-slate-500">
            {decision.reasoning}
          </p>
        )}

        {/* adjust panel */}
        {adjustOpen && (
          <div className="mt-3 animate-fade-in-up space-y-2 rounded-xl border border-amber-100 bg-amber-50/50 p-3">
            <div className="text-[12px] font-semibold text-amber-700">
              怎麼調整?選一個或直接輸入
            </div>
            {decision.adjustOptions?.map((o) => (
              <button
                key={o.label}
                disabled={!!busy}
                onClick={() => act({ action: "adjust", optionLabel: o.label })}
                className="flex w-full items-center gap-2 rounded-lg border border-amber-200 bg-white px-3 py-2 text-left text-[13px] font-medium text-slate-700 transition-colors hover:bg-amber-50 active:scale-[0.99] disabled:opacity-50"
              >
                <ArrowRight className="h-3.5 w-3.5 text-amber-500" />
                {o.label}
              </button>
            ))}
            <div className="flex gap-2">
              <input
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="或輸入你的想法…"
                className="h-9 flex-1 rounded-lg border border-amber-200 bg-white px-3 text-[13px] outline-none focus:ring-2 focus:ring-amber-300"
              />
              <button
                disabled={!!busy || !freeText.trim()}
                onClick={() => act({ action: "adjust", freeText })}
                className="h-9 rounded-lg bg-amber-500 px-3 text-[13px] font-semibold text-white disabled:opacity-40"
              >
                送出
              </button>
            </div>
          </div>
        )}
      </div>

      {/* actions */}
      <div className="flex items-stretch border-t border-slate-100">
        <button
          disabled={!!busy}
          onClick={() => act({ action: "adopt" })}
          className="flex flex-1 items-center justify-center gap-1.5 py-3 text-[13px] font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 active:scale-[0.98] disabled:opacity-50"
        >
          <Check className="h-4 w-4" /> 採納
        </button>
        <div className="w-px bg-slate-100" />
        <button
          disabled={!!busy}
          onClick={() => setAdjustOpen((v) => !v)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 py-3 text-[13px] font-semibold transition-colors active:scale-[0.98] disabled:opacity-50",
            adjustOpen
              ? "bg-amber-50 text-amber-700"
              : "text-amber-600 hover:bg-amber-50"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" /> 調整
        </button>
        <div className="w-px bg-slate-100" />
        <button
          disabled={!!busy}
          onClick={() => act({ action: "reject" })}
          className="flex flex-1 items-center justify-center gap-1.5 py-3 text-[13px] font-semibold text-slate-400 transition-colors hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50"
        >
          <X className="h-4 w-4" /> 駁回
        </button>
      </div>
    </motion.div>
  );
}
