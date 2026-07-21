"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Check, Sparkles, ClipboardCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StockItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  onHand: number;
  perishable: boolean;
}

function reason(diff: number, it: StockItem): string {
  if (diff === 0) return "帳實相符,無差異 👍";
  if (diff < 0) {
    if (it.perishable) return "可能原因:近期報廢未入帳,或耗損高於預期。建議檢查報廢紀錄。";
    if (it.category === "電池" || it.category === "電控")
      return "可能原因:樣品出借或工單領料未即時扣帳。建議比對領料單。";
    return "可能原因:未入帳的出貨、樣品出借或短溢收。建議追查近 7 日異動。";
  }
  return "實盤多於帳面,可能原因:退貨未入帳或前次盤點少計。建議複核入庫。";
}

export function Stocktake({ items }: { items: StockItem[] }) {
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState<StockItem | null>(null);
  const [input, setInput] = React.useState("");
  const [counted, setCounted] = React.useState<Record<string, number>>({});

  const filtered = items.filter(
    (it) =>
      !q ||
      it.name.toLowerCase().includes(q.toLowerCase()) ||
      it.sku.toLowerCase().includes(q.toLowerCase())
  );
  const remaining = filtered.filter((it) => !(it.id in counted));

  function submit() {
    if (!active || input === "") return;
    setCounted((prev) => ({ ...prev, [active.id]: Number(input) }));
    setActive(null);
    setInput("");
  }

  const countedList = items.filter((it) => it.id in counted);
  const diffCount = countedList.filter((it) => counted[it.id] !== it.onHand).length;

  return (
    <div className="space-y-4">
      {/* search / scan */}
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-card">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="掃碼或搜尋品項 / SKU…"
          className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-slate-400"
        />
      </div>

      {/* progress */}
      <div className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2 text-[12px]">
        <span className="text-slate-500">
          已盤 <span className="font-bold text-slate-800 tabular-nums">{countedList.length}</span>
          {" / "}
          {items.length}
        </span>
        {diffCount > 0 && (
          <span className="font-semibold text-rose-600">{diffCount} 項有差異</span>
        )}
      </div>

      {/* list */}
      <div className="space-y-2">
        {remaining.map((it) => (
          <button
            key={it.id}
            onClick={() => {
              setActive(it);
              setInput("");
            }}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-card active:scale-[0.99]"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14px] font-semibold text-slate-800">{it.name}</div>
              <div className="text-[11px] text-slate-400 tabular-nums">
                {it.sku} · 帳面 {it.onHand}
              </div>
            </div>
            <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-[12px] font-medium text-brand-600">
              盤點
            </span>
          </button>
        ))}
        {remaining.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 py-10 text-center">
            <ClipboardCheck className="mb-2 h-7 w-7 text-emerald-500" />
            <p className="text-[14px] font-semibold text-slate-700">此範圍已盤點完成</p>
          </div>
        )}
      </div>

      {/* counted results */}
      {countedList.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="px-1 text-[12px] font-semibold text-slate-400">盤點結果</p>
          {countedList.map((it) => {
            const diff = counted[it.id] - it.onHand;
            return (
              <div
                key={it.id}
                className="rounded-xl border border-slate-200 bg-white p-3 shadow-card"
              >
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-[13px] font-semibold text-slate-800">{it.name}</span>
                  <span
                    className={cn(
                      "ml-auto text-[12px] font-bold tabular-nums",
                      diff === 0 ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    帳 {it.onHand} / 實 {counted[it.id]}
                    {diff !== 0 && ` (差 ${diff > 0 ? "+" : ""}${diff})`}
                  </span>
                </div>
                {diff !== 0 && (
                  <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[12px] text-amber-700">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{reason(diff, it)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* count input sheet */}
      <AnimatePresence>
        {active && (
          <div
            className="fixed inset-0 z-50 flex items-end bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-3xl border-t border-slate-200 bg-white p-5 pb-8"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[15px] font-bold text-slate-900">{active.name}</div>
                  <div className="text-[12px] text-slate-400 tabular-nums">
                    {active.sku} · 帳面 {active.onHand}
                  </div>
                </div>
                <button onClick={() => setActive(null)} className="text-slate-300">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <label className="text-[13px] font-medium text-slate-500">實盤數量</label>
              <input
                autoFocus
                type="number"
                inputMode="numeric"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="輸入數量"
                className="mt-1.5 h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-2xl font-bold tabular-nums outline-none focus:ring-2 focus:ring-brand-300"
              />
              {input !== "" && Number(input) !== active.onHand && (
                <div className="mt-2 text-[13px] font-medium text-rose-600 tabular-nums">
                  差異 {Number(input) - active.onHand > 0 ? "+" : ""}
                  {Number(input) - active.onHand}
                </div>
              )}
              <button
                onClick={submit}
                disabled={input === ""}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 text-[15px] font-semibold text-white shadow-pop active:scale-[0.98] disabled:opacity-40"
              >
                <Check className="h-5 w-5" /> 確認並下一筆
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
