"use client";

import * as React from "react";
import Link from "next/link";
import { Camera, Clock, User, AlertTriangle, UserCog, CheckCircle2 } from "lucide-react";
import { useSession } from "@/lib/auth/SessionProvider";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { getOrder, stageLabel, submitResolution } from "@/modules/orders/service";
import { canSeeGlobalData } from "@/lib/auth/visibility";
import { StageProgress } from "@/lib/ui/stage-progress";
import { Badge } from "@/lib/ui/badge";
import { BackButton } from "@/lib/ui/back-button";
import { AdvanceButton } from "@/modules/orders/components/AdvanceButton";
import { twd, formatDate } from "@/lib/utils";
import { ROLES, type IndustryKey } from "@/lib/types";

const INDUSTRIES: IndustryKey[] = ["factory", "ecom", "kitchen"];

export function OrderDetailClient({ id }: { id: string }) {
  const { role, version, bump } = useSession();
  void version; // 訂閱 mutation,推進站點後重新讀取

  // 跨產業定位訂單(id 全域唯一);取得其所屬產業
  let industry: IndustryKey | undefined;
  for (const k of INDUSTRIES) {
    if (getOrder(k, id)) {
      industry = k;
      break;
    }
  }
  const order = industry ? getOrder(industry, id) : undefined;

  if (!order || !industry) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center text-sm text-slate-400">
        查無此{"訂單"}
        <div className="mt-3">
          <Link href="/orders" className="text-brand-600">
            返回列表
          </Link>
        </div>
      </div>
    );
  }

  const cfg = getIndustryConfig(industry);
  const stages = cfg.orderStages;
  const idx = stages.findIndex((s) => s.key === order.currentStage);
  const nextStage = order.done ? null : stages[idx + 1] ?? null;
  const isLast = idx === stages.length - 2;
  const canAdvance = !order.done && role !== "customer";
  const showMoney = canSeeGlobalData(role);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <BackButton label={cfg.terms.orderNoun} fallback="/orders" />

      {/* header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-slate-900 tabular-nums">
            {order.orderNo}
          </span>
          {order.delayed && <Badge tone="rose">延遲</Badge>}
          {order.done && <Badge tone="emerald">已完成</Badge>}
        </div>
        <div className="mt-1 text-[14px] font-medium text-slate-700">
          {order.customerName}
        </div>
        <div className="text-[13px] text-slate-400">
          {order.itemsSummary} · {order.qty}{" "}
          {cfg.terms.item === "食材" ? "份" : "件"}
        </div>
        <div className="mt-3 flex items-center gap-4 text-[13px]">
          <span className="flex items-center gap-1 text-slate-500">
            <Clock className="h-3.5 w-3.5" /> 預計 {formatDate(order.dueDate)}
          </span>
          {showMoney && (
            <span className="font-semibold text-slate-800 tabular-nums">
              {twd(order.amount)}
            </span>
          )}
        </div>
        <div className="mt-4">
          <StageProgress
            stages={stages}
            currentKey={order.currentStage}
            delayed={order.delayed}
          />
        </div>
      </div>

      {/* 延遲處理閉環:原因 + 負責人 + 處理回報 */}
      {order.delayed && !order.done && (
        <DelayPanel
          industry={industry}
          orderId={order.id}
          reason={order.delayReason}
          ownerName={order.ownerName}
          resolution={order.resolution}
          role={role}
          onSubmitted={bump}
        />
      )}

      {/* advance */}
      {canAdvance && (
        <AdvanceButton
          orderId={order.id}
          industry={industry}
          nextLabel={nextStage?.label ?? null}
          isLast={isLast}
        />
      )}

      {/* events */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <h2 className="mb-3 px-1 text-[13px] font-semibold text-slate-500">
          進度紀錄
        </h2>
        <div className="space-y-3">
          {[...order.events].reverse().map((e, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-600">
                ✓
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-slate-700">
                  {stageLabel(industry, e.stageKey)}
                  {e.photo && (
                    <span className="ml-1.5 inline-flex items-center gap-0.5 text-[11px] text-brand-500">
                      <Camera className="h-3 w-3" /> 附照
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <User className="h-3 w-3" /> {e.by}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 客戶查詢連結 */}
      {role !== "customer" && (
        <Link
          href={`/track/${order.orderNo}`}
          className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-[13px] font-medium text-slate-500 hover:bg-slate-100"
        >
          🔗 客戶自助查詢頁(只看得到進度與交期)
        </Link>
      )}
    </div>
  );
}

function DelayPanel({
  industry,
  orderId,
  reason,
  ownerName,
  resolution,
  role,
  onSubmitted,
}: {
  industry: IndustryKey;
  orderId: string;
  reason?: string;
  ownerName: string;
  resolution?: { by: string; text: string; at: string };
  role: string;
  onSubmitted: () => void;
}) {
  const [text, setText] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const canHandle = role === "staff" || role === "manager" || role === "owner";
  const roleLabel = ROLES.find((r) => r.key === role)?.label ?? "";

  function submit() {
    if (!text.trim()) return;
    setBusy(true);
    submitResolution(industry, orderId, `${ownerName}(${roleLabel})`, text);
    setTimeout(() => {
      onSubmitted();
      setBusy(false);
    }, 300);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/60">
      <div className="flex items-center gap-2 border-b border-rose-100 px-4 py-2.5">
        <AlertTriangle className="h-4 w-4 text-rose-500" />
        <span className="text-[13px] font-semibold text-rose-700">延遲待處理</span>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start gap-2 text-[13px]">
          <span className="w-16 shrink-0 text-slate-400">延遲原因</span>
          <span className="font-medium text-slate-800">{reason ?? "待釐清"}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px]">
          <span className="w-16 shrink-0 text-slate-400">負責人</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-medium text-slate-700 ring-1 ring-slate-200">
            <UserCog className="h-3.5 w-3.5 text-slate-400" /> {ownerName}
          </span>
        </div>

        {/* 已回報 → 老闆/員工都看得到 */}
        {resolution ? (
          <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> 處理回報 · {resolution.by}
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-700">
              {resolution.text}
            </p>
          </div>
        ) : canHandle ? (
          /* 負責人尚未回報 → 提供輸入 */
          <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-1.5 text-[12px] font-semibold text-slate-600">
              請儘快處理並回報處理方式(老闆將同步看到)
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="例如:已改由備援供應商補料,預計明日到齊,交期順延 1 天並已通知客戶"
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-brand-300"
            />
            <button
              onClick={submit}
              disabled={busy || !text.trim()}
              className="mt-2 h-9 w-full rounded-lg bg-rose-600 text-[13px] font-semibold text-white active:scale-[0.98] disabled:opacity-40"
            >
              送出處理回報
            </button>
          </div>
        ) : (
          <div className="mt-2 rounded-xl bg-white p-3 text-[12px] text-slate-400">
            等待 {ownerName} 回報處理方式…
          </div>
        )}
      </div>
    </div>
  );
}
