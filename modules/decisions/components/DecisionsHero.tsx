"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Inbox } from "lucide-react";
import { CountUp } from "@/lib/ui/count-up";

export function DecisionsHero({
  done,
  pending,
  roleLabel,
}: {
  done: number;
  pending: number;
  roleLabel: string;
}) {
  const greet = "早安";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white shadow-pop"
    >
      <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-white/5" />
      <div className="relative">
        <p className="text-[13px] font-medium text-brand-100">
          {greet},{roleLabel} 👋
        </p>
        <p className="mt-0.5 text-[15px] font-semibold">
          AI 同事今天幫你顧好公司了
        </p>

        <div className="mt-4 flex items-stretch gap-3">
          <div className="flex-1 rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-[12px] text-brand-100">
              <CheckCircle2 className="h-3.5 w-3.5" /> AI 今天完成
            </div>
            <div className="mt-1 text-3xl font-bold tracking-tight">
              <CountUp value={done} />
              <span className="ml-1 text-base font-medium text-brand-100">件</span>
            </div>
          </div>
          <div className="flex-1 rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-[12px] text-brand-100">
              <Inbox className="h-3.5 w-3.5" /> 待你決策
            </div>
            <div className="mt-1 text-3xl font-bold tracking-tight">
              <CountUp value={pending} />
              <span className="ml-1 text-base font-medium text-brand-100">件</span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[12px] text-brand-100/90">
          {pending > 0
            ? `花 5 分鐘處理完,今天的公司決策就結束了`
            : `太棒了,今天沒有待決策事項`}
        </p>
      </div>
    </motion.div>
  );
}
