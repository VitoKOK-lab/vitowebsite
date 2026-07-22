"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, Send, Mail, Check, Minus, Plus, X } from "lucide-react";
import { cn, twd } from "@/lib/utils";
import { calcQuote, type QuoteResult } from "../calc";
import type { IndustryKey } from "@/lib/types";

export function QuoteCalculator({
  industry,
  itemLabel,
  unitLabel,
}: {
  industry: IndustryKey;
  itemLabel: string;
  unitLabel: string;
}) {
  const [name, setName] = React.useState("");
  const [qty, setQty] = React.useState(50);
  const [margin, setMargin] = React.useState(25);
  const [result, setResult] = React.useState<QuoteResult | null>(null);
  const [sent, setSent] = React.useState(false);
  const [computing, setComputing] = React.useState(false);

  function compute() {
    setComputing(true);
    // 模擬「3 秒出報價」的即時感(實際即時)
    const r = calcQuote(industry, qty, margin);
    setTimeout(() => {
      setResult(r);
      setComputing(false);
    }, 300);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-center gap-1.5">
        <Calculator className="h-4 w-4 text-brand-500" />
        <h2 className="text-[14px] font-semibold text-slate-800">快速報價試算</h2>
      </div>

      <div className="mt-3 space-y-3">
        <div>
          <label className="text-[12px] font-medium text-slate-500">{itemLabel}名稱</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`輸入${itemLabel}名稱`}
            className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[14px] outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] font-medium text-slate-500">數量({unitLabel})</label>
            <Stepper value={qty} onChange={setQty} step={10} min={1} />
          </div>
          <div>
            <label className="text-[12px] font-medium text-slate-500">目標毛利率</label>
            <Stepper value={margin} onChange={setMargin} step={1} min={1} max={80} suffix="%" />
          </div>
        </div>

        <button
          onClick={compute}
          disabled={computing}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-[15px] font-semibold text-white shadow-pop active:scale-[0.98] disabled:opacity-60"
        >
          {computing ? "計算中…" : "產生報價"}
        </button>
      </div>

      <AnimatePresence>
        {result && !computing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-4"
          >
            <div className="text-center">
              <p className="text-[12px] text-slate-500">AI 建議售價</p>
              <p className="text-3xl font-bold tracking-tight text-brand-700 tabular-nums">
                {twd(result.suggestedPrice)}
              </p>
              <p className="text-[12px] text-slate-400">
                {name || itemLabel} · {result.qty} {unitLabel} · 毛利 {result.marginPct}%
              </p>
            </div>

            <div className="mt-3 space-y-1 rounded-xl bg-white p-3">
              <p className="mb-1 text-[11px] font-semibold text-slate-400">單位成本組成</p>
              {result.breakdown.map((b, i) => (
                <div key={i} className="flex items-center justify-between text-[12px]">
                  <span className="text-slate-500">{b.label}</span>
                  <span className="font-medium text-slate-700 tabular-nums">
                    {twd(b.amount)}
                    {b.note && <span className="ml-1 text-slate-300">/{b.note}</span>}
                  </span>
                </div>
              ))}
              <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-1 text-[12px]">
                <span className="font-semibold text-slate-600">總成本</span>
                <span className="font-bold text-slate-800 tabular-nums">
                  {twd(result.totalCost)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSent(true)}
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-[14px] font-semibold text-white active:scale-[0.98]"
            >
              <Send className="h-4 w-4" /> 一鍵產生 PDF 並寄出
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* email 寄出模擬 */}
      <AnimatePresence>
        {sent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm"
            onClick={() => setSent(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-500">
                  <Mail className="h-4 w-4" /> 報價 Email 已寄出
                </div>
                <button onClick={() => setSent(false)} className="text-slate-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[13px] text-slate-500">主旨</p>
                <p className="text-[14px] font-semibold text-slate-800">
                  {name || itemLabel}報價單 — 建議售價 {result && twd(result.suggestedPrice)}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[12px]">
                  <span className="flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-600">
                    <Check className="h-3 w-3" /> 已寄出
                  </span>
                  <span className="text-slate-400">將自動追蹤:已讀 / 成交</span>
                </div>
              </div>
              <button
                onClick={() => setSent(false)}
                className="mt-4 h-10 w-full rounded-xl bg-slate-900 text-[14px] font-semibold text-white"
              >
                完成
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stepper({
  value,
  onChange,
  step,
  min = 0,
  max = 99999,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  step: number;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-slate-50">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        className="flex h-10 w-9 items-center justify-center text-slate-500 active:scale-90"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="flex-1 text-center text-[15px] font-bold text-slate-800 tabular-nums">
        {value}
        {suffix}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        className="flex h-10 w-9 items-center justify-center text-slate-500 active:scale-90"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
