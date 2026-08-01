"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Package,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Toast, useToast } from "@/lib/ui/toast";
import { useSession } from "@/lib/auth/SessionProvider";
import { completeTask } from "../service";
import { delayedOrders } from "@/modules/orders/service";
import type { Task } from "@/lib/data/models";

export function StaffTasks({
  tasks,
  name,
}: {
  tasks: Task[];
  name: string;
}) {
  const { role, industry, version, bump } = useSession();
  void version; // 訂閱 mutation:回報處理後重新讀取待處理清單

  // 延遲且尚未回報處理方式的訂單 → 提示負責人儘快處理(客戶不顯示)
  const needHandling =
    role === "customer"
      ? []
      : delayedOrders(industry).filter((o) => !o.resolution);
  const [done, setDone] = React.useState<Set<string>>(
    new Set(tasks.filter((t) => t.done).map((t) => t.id))
  );
  const { toast, show } = useToast(2600);

  const pending = tasks.filter((t) => !done.has(t.id));
  const completed = tasks.filter((t) => done.has(t.id));

  function complete(id: string) {
    setDone((prev) => new Set(prev).add(id));
    show("已完成 · 貢獻 +1 🎉", "success");
    completeTask(industry, id);
    setTimeout(() => bump(), 500);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <p className="text-[13px] font-medium text-slate-400">7 月 21 日</p>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          {name},今日有 {pending.length} 項任務
        </h1>
      </div>

      {/* 延遲待處理:負責人限定,請儘快回報處理方式 */}
      {needHandling.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/60">
          <div className="flex items-center gap-2 border-b border-rose-100 px-4 py-2.5">
            <AlertTriangle className="h-4 w-4 text-rose-500" />
            <span className="text-[13px] font-semibold text-rose-700">
              延遲待處理 · {needHandling.length}
            </span>
            <span className="ml-auto text-[11px] text-rose-500/80">請儘快回報處理方式</span>
          </div>
          <div className="space-y-2 p-3">
            {needHandling.map((o) => (
              <Link
                key={o.id}
                href={`/demo/orders/${o.id}`}
                className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-rose-100 transition-colors hover:bg-rose-50/50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <Package className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-slate-800 tabular-nums">
                    {o.orderNo} · {o.customerName}
                  </div>
                  <div className="truncate text-[12px] text-rose-600">
                    {o.delayReason ?? "延遲待釐清"}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-rose-300" />
              </Link>
            ))}
          </div>
        </div>
      )}

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

      <Toast toast={toast} />
    </div>
  );
}
