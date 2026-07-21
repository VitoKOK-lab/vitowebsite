"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Package, ClipboardList, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/data/models";

export function StaffTasks({
  tasks,
  name,
}: {
  tasks: Task[];
  name: string;
}) {
  const router = useRouter();
  const [done, setDone] = React.useState<Set<string>>(
    new Set(tasks.filter((t) => t.done).map((t) => t.id))
  );
  const [toast, setToast] = React.useState<string | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const pending = tasks.filter((t) => !done.has(t.id));
  const completed = tasks.filter((t) => done.has(t.id));

  async function complete(id: string) {
    setDone((prev) => new Set(prev).add(id));
    setToast("已完成 · 貢獻 +1 🎉");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
    await fetch(`/api/tasks/${id}/complete`, { method: "POST" }).catch(() => {});
    setTimeout(() => router.refresh(), 500);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <p className="text-[13px] font-medium text-slate-400">7 月 21 日</p>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          {name},今日有 {pending.length} 項任務
        </h1>
      </div>

      {/* 進度 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-medium text-slate-600">今日進度</span>
          <span className="font-bold text-brand-600 tabular-nums">
            {completed.length}/{tasks.length}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-brand-500"
            initial={{ width: 0 }}
            animate={{ width: `${(completed.length / tasks.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* 待辦 */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {pending.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 py-12 text-center"
            >
              <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-500" />
              <p className="text-[15px] font-semibold text-slate-700">今日任務全部完成!</p>
              <p className="mt-1 text-[13px] text-slate-400">辛苦了 👏</p>
            </motion.div>
          ) : (
            pending.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40, scale: 0.95, transition: { duration: 0.25 } }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-card"
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    t.kind === "stocktake"
                      ? "bg-violet-50 text-violet-600"
                      : "bg-brand-50 text-brand-600"
                  )}
                >
                  {t.kind === "stocktake" ? (
                    <ClipboardList className="h-4 w-4" />
                  ) : (
                    <Package className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-slate-800">{t.title}</div>
                  <div className="truncate text-[12px] text-slate-400">{t.detail}</div>
                </div>
                <button
                  onClick={() => complete(t.id)}
                  className="flex h-9 items-center gap-1 rounded-xl bg-emerald-600 px-3 text-[13px] font-semibold text-white shadow-sm transition-transform active:scale-95"
                >
                  <Check className="h-4 w-4" /> 完成
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* 已完成 */}
      {completed.length > 0 && (
        <div>
          <p className="mb-2 px-1 text-[12px] font-semibold text-slate-400">
            已完成 · {completed.length}
          </p>
          <div className="space-y-2">
            {completed.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Check className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-medium text-slate-400 line-through">
                    {t.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed inset-x-0 bottom-24 z-40 mx-auto flex max-w-md items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-pop"
            style={{ width: "calc(100% - 2rem)" }}
          >
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <span className="text-[13px] font-medium">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
