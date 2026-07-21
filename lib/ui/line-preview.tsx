"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import type { LineDaily } from "@/lib/line/mock";

export function LinePreview({ daily }: { daily: LineDaily }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left shadow-card active:scale-[0.99]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#06C755]/10">
          <MessageCircle className="h-4 w-4 text-[#06C755]" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-slate-700">
            LINE 每日摘要
          </div>
          <div className="truncate text-[11px] text-slate-400">
            每天 08:00 自動推播 · 點我預覽
          </div>
        </div>
        <span className="rounded-full bg-[#06C755] px-2 py-0.5 text-[10px] font-bold text-white">
          08:00
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xs overflow-hidden rounded-3xl bg-[#8CABD8] p-3 shadow-xl"
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-[12px] font-semibold text-white/90">
                  LINE
                </span>
                <button onClick={() => setOpen(false)}>
                  <X className="h-4 w-4 text-white/80" />
                </button>
              </div>
              {/* chat bubble */}
              <div className="flex gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#06C755] text-sm">
                  🤖
                </span>
                <div className="rounded-2xl rounded-tl-sm bg-white p-3 shadow-sm">
                  <div className="text-[13px] font-bold text-slate-800">
                    {daily.title}
                  </div>
                  <div className="mt-1.5 space-y-1">
                    {daily.lines.map((l, i) => (
                      <div
                        key={i}
                        className="text-[12px] leading-relaxed text-slate-600"
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-right text-[10px] text-slate-300">
                    {daily.time}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
