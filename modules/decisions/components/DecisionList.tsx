"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { DecisionCard, type ActPayload } from "./DecisionCard";
import { Toast, useToast } from "@/lib/ui/toast";
import { useSession } from "@/lib/auth/SessionProvider";
import { ROLES } from "@/lib/types";
import { actOnDecision } from "../service";
import type { DecisionView } from "../service";

export function DecisionList({ decisions }: { decisions: DecisionView[] }) {
  const { industry, role, bump } = useSession();
  const pending = decisions.filter((d) => d.status === "pending");
  const [gone, setGone] = React.useState<Set<string>>(new Set());
  const { toast, show } = useToast(3200);

  const visible = pending.filter((d) => !gone.has(d.id));

  async function handleAct(id: string, payload: ActPayload) {
    const decidedBy = ROLES.find((r) => r.key === role)?.label ?? "老闆";
    const res = actOnDecision(industry, id, payload.action, {
      optionLabel: payload.optionLabel,
      freeText: payload.freeText,
      decidedBy,
    });

    setGone((prev) => new Set(prev).add(id));

    if (payload.action === "adjust" && res.learnedText) {
      show(`已學習:${res.learnedText}`, "learned");
    } else if (payload.action === "adopt") {
      show("已採納,任務已建立", "success");
    } else if (payload.action === "reject" && res.learnedText) {
      show(res.learnedText, "learned");
    }

    setTimeout(() => bump(), 700);
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

      <Toast toast={toast} />
    </div>
  );
}
