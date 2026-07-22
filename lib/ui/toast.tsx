"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";

export type ToastTone = "learned" | "success";

interface ToastState {
  text: string;
  tone: ToastTone;
}

/** 底部彈出提示的共用狀態(含自動消失) */
export function useToast(duration = 3000) {
  const [toast, setToast] = React.useState<ToastState | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = React.useCallback(
    (text: string, tone: ToastTone = "success") => {
      setToast({ text, tone });
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setToast(null), duration);
    },
    [duration]
  );

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  return { toast, show };
}

/** 底部彈出提示 pill */
export function Toast({ toast }: { toast: ToastState | null }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 bottom-24 z-40 mx-auto flex max-w-md items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-pop"
          style={{ width: "calc(100% - 2rem)" }}
        >
          {toast.tone === "learned" ? (
            <Sparkles className="h-5 w-5 shrink-0 text-brand-300" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          )}
          <span className="text-[13px] font-medium leading-snug">{toast.text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
