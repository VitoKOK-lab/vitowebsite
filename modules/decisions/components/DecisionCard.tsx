"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Check,
  X,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Lightbulb,
  ArrowRight,
  Radar,
  Boxes,
  Factory,
  ShieldCheck,
  Wallet,
  Siren,
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
  排程: "brand",
  應收: "rose",
  物流: "amber",
  廣告: "violet",
  排班: "brand",
  品質: "violet",
  // 緊急/擴充類別
  設備: "rose",
  供應: "rose",
  大單: "emerald",
  召回: "rose",
  資安: "rose",
  匯率: "amber",
  缺工: "amber",
  客訴: "rose",
  現金流: "rose",
  環安: "violet",
  詐騙: "rose",
  競品: "amber",
  退貨: "amber",
  合作: "emerald",
  促銷: "brand",
  金流: "amber",
  食安: "rose",
  冷鏈: "rose",
  稽核: "violet",
  天災: "rose",
};

// 每個決策「來自哪個系統」— 強化「AI 自動從各處抓資料處理」的敘事
const categorySource: Record<
  string,
  { label: string; href?: string; icon: React.ComponentType<{ className?: string }> }
> = {
  調價: { label: "產業雷達", href: "/radar", icon: Radar },
  成本: { label: "產業雷達", href: "/radar", icon: Radar },
  平台費: { label: "產業雷達", href: "/radar", icon: Radar },
  補貨: { label: "庫存預警", href: "/inventory", icon: Boxes },
  備料不足: { label: "庫存預警", href: "/inventory", icon: Boxes },
  滯銷: { label: "庫存預警", href: "/inventory", icon: Boxes },
  效期警示: { label: "效期監控", href: "/inventory", icon: Boxes },
  工單延遲: { label: "生產排程", href: "/orders", icon: Factory },
  排程: { label: "生產排程", href: "/orders", icon: Factory },
  排班: { label: "排班系統", icon: Factory },
  品檢: { label: "品管系統", icon: ShieldCheck },
  品質: { label: "品管系統", icon: ShieldCheck },
  耗損: { label: "品管系統", icon: ShieldCheck },
  應收: { label: "財務系統", icon: Wallet },
  選品: { label: "選品雷達", href: "/picking", icon: Radar },
  廣告: { label: "廣告成效", icon: Radar },
  物流: { label: "物流監控", href: "/orders", icon: Factory },
  設備: { label: "設備監控", icon: ShieldCheck },
  供應: { label: "供應鏈監控", href: "/inventory", icon: Boxes },
  大單: { label: "業務系統", icon: Wallet },
  召回: { label: "品管系統", icon: ShieldCheck },
  資安: { label: "資安稽核", icon: ShieldCheck },
  匯率: { label: "財務系統", icon: Wallet },
  缺工: { label: "排班系統", icon: Factory },
  客訴: { label: "客服系統", icon: ShieldCheck },
  現金流: { label: "財務系統", icon: Wallet },
  環安: { label: "環安系統", icon: ShieldCheck },
  詐騙: { label: "風控系統", icon: ShieldCheck },
  競品: { label: "產業雷達", href: "/radar", icon: Radar },
  退貨: { label: "客服系統", icon: ShieldCheck },
  合作: { label: "業務系統", icon: Wallet },
  促銷: { label: "行銷系統", icon: Radar },
  金流: { label: "財務系統", icon: Wallet },
  食安: { label: "品管系統", icon: ShieldCheck },
  冷鏈: { label: "設備監控", icon: ShieldCheck },
  稽核: { label: "品管系統", icon: ShieldCheck },
  天災: { label: "產業雷達", href: "/radar", icon: Radar },
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

  // 滑動手勢:右滑採納、左滑駁回
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-5, 5]);
  const adoptOpacity = useTransform(x, [40, 130], [0, 1]);
  const rejectOpacity = useTransform(x, [-130, -40], [1, 0]);

  const tone = (categoryTone[decision.category] ?? "slate") as
    | "brand"
    | "amber"
    | "rose"
    | "violet"
    | "emerald"
    | "slate";
  const source = categorySource[decision.category];

  async function act(payload: ActPayload) {
    setBusy(payload.action);
    await onAct(decision.id, payload);
  }

  return (
    <motion.div
      style={{ x, rotate }}
      drag={adjustOpen || busy ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.55}
      dragSnapToOrigin
      onDragEnd={(_e, info) => {
        if (info.offset.x > 130) act({ action: "adopt" });
        else if (info.offset.x < -130) act({ action: "reject" });
      }}
      whileDrag={{ cursor: "grabbing" }}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-white shadow-card",
        decision.urgent
          ? "border-rose-200 ring-1 ring-rose-200"
          : "border-slate-200"
      )}
    >
      {/* 滑動提示層 */}
      <motion.div
        style={{ opacity: adoptOpacity }}
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-start bg-emerald-500/10 pl-6"
      >
        <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[13px] font-bold text-white shadow-sm">
          <Check className="h-4 w-4" /> 採納
        </span>
      </motion.div>
      <motion.div
        style={{ opacity: rejectOpacity }}
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-end bg-rose-500/10 pr-6"
      >
        <span className="flex items-center gap-1 rounded-full bg-rose-500 px-3 py-1 text-[13px] font-bold text-white shadow-sm">
          <X className="h-4 w-4" /> 駁回
        </span>
      </motion.div>

      <div className="relative p-4 sm:p-5">
        {/* header */}
        <div className="flex items-center gap-2">
          {decision.urgent && (
            <span className="flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
              <Siren className="h-3 w-3 animate-pulse" /> 緊急
            </span>
          )}
          <Badge tone={tone}>{decision.category}</Badge>
          {source &&
            (source.href ? (
              <Link
                href={source.href}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-brand-500"
              >
                <source.icon className="h-3 w-3" /> 來自{source.label}
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <source.icon className="h-3 w-3" /> 來自{source.label}
              </span>
            ))}
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
            建議做法
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
      <div className="relative flex items-stretch border-t border-slate-100">
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
