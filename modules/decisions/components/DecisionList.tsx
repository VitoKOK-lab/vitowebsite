"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, CheckCircle2, PartyPopper } from "lucide-react";
import { DecisionCard, type ActPayload } from "./DecisionCard";
import type { DecisionView } from "../service";

export function DecisionList({ decisions }: { decisions: DecisionView[] }) {
  const router = useRouter();
  const pending = decisions.filter((d) => d.status === "pending");
  const [gone, setGone] = React.useState<Set<string>>(new Set());
  const [toast, setToast] = React.useState<{ text: string; learned: boolean } | null>(
    null
  );
  const toastTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const visible = pending.filter((d) => !gone.has(d.id));

  async function handleAct(id: string, payload: ActPayload) {
    const res = await fetch(`/api/decisions/${id}/act`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .catch(() => ({ ok: false }));

    setGone((prev) => new Set(prev).add(id));

    if (payload.action === "adjust" && res.learnedText) {
      showToast(`已學習:${res.learnedText}`, true);
    } else if (payload.action === "adopt") {
      showToast("已採納,任務已建立", false);
    } else if (payload.action === "reject" && res.learnedText) {
      showToast(res.learnedText, true);
    }

    setTimeout(() => router.refresh(), 700);
  }

  function showToast(text: string, learned: boolean) {
    setToast({ text, learned });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  return (
    <div className="relative">
      <AnimatePresence mode="popLayout">
        {visible.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-14 text-center"
          >
            <PartyPopper className="mb-3 h-8 w-8 text-emerald-500" />
            <p className="text-[15px] font-semibold text-slate-700">
              全部決策完成!
            </p>
            <p className="mt-1 text-[13px] text-slate-400">
              AI 會持續監控,有新狀況會即時通知您
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2 lg:items-start">
            {visible.map((d) => (
              <motion.div
                key={d.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  x: 60,
                  scale: 0.92,
                  transition: { duration: 0.28 },
                }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              >
                <DecisionCard decision={d} onAct={handleAct} />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 已學習 toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed inset-x-0 bottom-24 z-40 mx-auto flex max-w-md items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-pop"
            style={{ width: "calc(100% - 2rem)" }}
          >
            {toast.learned ? (
              <Sparkles className="h-5 w-5 shrink-0 text-brand-300" />
            ) : (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            )}
            <span className="text-[13px] font-medium leading-snug">
              {toast.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
