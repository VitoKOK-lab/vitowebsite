import * as React from "react";
import {
  Settings2,
  Tags,
  GitBranch,
  Calculator,
  ToggleLeft,
  ShieldCheck,
  MessageCircle,
  GraduationCap,
} from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { db } from "@/lib/data/store";
import { growthStats } from "@/modules/decisions/service";
import { GrowthReport } from "@/modules/admin/components/GrowthReport";
import { ToggleRow } from "@/modules/admin/components/ToggleRow";
import { Badge } from "@/lib/ui/badge";
import { twd } from "@/lib/utils";
import type { ModuleKey } from "@/lib/types";

export const dynamic = "force-dynamic";

const MODULE_LABELS: Record<ModuleKey, string> = {
  decisions: "AI 決策佇列",
  dashboard: "儀表板",
  quote: "報價引擎",
  orders: "訂單/工單追蹤",
  inventory: "進銷存",
  cs: "AI 客服",
  picking: "AI 選品",
  radar: "產業雷達",
  admin: "後台設定",
};

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="text-brand-500">{icon}</span>
        <h2 className="text-[14px] font-semibold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function AdminPage() {
  const { industry } = getSession();
  const cfg = getIndustryConfig(industry);
  const growth = growthStats(industry);
  const learningLog = db(industry).learningLog;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[13px] font-medium text-slate-400">{cfg.displayName}</p>
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <Settings2 className="h-5 w-5 text-brand-500" /> 後台設定
        </h1>
      </div>

      <GrowthReport
        adoptRate={growth.adoptRate}
        hoursSaved={growth.hoursSaved}
        revenueImpact={growth.revenueImpact}
        learnedCount={growth.learnedCount}
      />

      {/* 學習紀錄 */}
      <Section icon={<GraduationCap className="h-4 w-4" />} title="AI 學習紀錄">
        {learningLog.length === 0 ? (
          <p className="py-2 text-[13px] text-slate-400">
            尚無學習紀錄。到決策佇列「調整」一張卡,AI 就會在這裡記下您的偏好。
          </p>
        ) : (
          <div className="space-y-2">
            {learningLog
              .slice()
              .reverse()
              .map((l) => (
                <div key={l.id} className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-700">
                    <GraduationCap className="h-3.5 w-3.5" /> {l.learnedText}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    情境:{l.situationSnapshot.slice(0, 40)}… · {l.humanDecision}
                  </div>
                </div>
              ))}
          </div>
        )}
      </Section>

      {/* 術語映射 */}
      <Section icon={<Tags className="h-4 w-4" />} title="術語映射">
        <div className="flex flex-wrap gap-2">
          {Object.entries(cfg.terms).map(([k, v]) => (
            <span
              key={k}
              className="rounded-lg bg-slate-50 px-2.5 py-1 text-[12px] text-slate-600"
            >
              <span className="text-slate-400">{k}</span> → {v}
            </span>
          ))}
        </div>
      </Section>

      {/* 流程站點 */}
      <Section icon={<GitBranch className="h-4 w-4" />} title="流程站點">
        <div className="flex flex-wrap items-center gap-1.5">
          {cfg.orderStages.map((s, i) => (
            <React.Fragment key={s.key}>
              <Badge tone="brand">{s.label}</Badge>
              {i < cfg.orderStages.length - 1 && (
                <span className="text-slate-300">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </Section>

      {/* 計價變數 */}
      <Section icon={<Calculator className="h-4 w-4" />} title="計價變數">
        <div className="space-y-1.5">
          {cfg.pricingVariables.map((v) => (
            <div key={v.key} className="flex items-center justify-between text-[13px]">
              <span className="text-slate-600">{v.label}</span>
              <span className="font-medium text-slate-800 tabular-nums">
                {v.unit.includes("%") ? `${v.value}%` : twd(v.value)}
                <span className="ml-1 text-[11px] text-slate-400">{v.unit}</span>
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* 模組開關 */}
      <Section icon={<ToggleLeft className="h-4 w-4" />} title="模組啟用">
        <div className="divide-y divide-slate-100">
          {(Object.keys(MODULE_LABELS) as ModuleKey[]).map((m) => (
            <ToggleRow
              key={m}
              label={MODULE_LABELS[m]}
              defaultOn={cfg.modules[m]}
              desc={m === "picking" ? "電商產業專屬" : undefined}
            />
          ))}
        </div>
      </Section>

      {/* 欄位可見性 */}
      <Section icon={<ShieldCheck className="h-4 w-4" />} title="機密欄位可見性">
        <div className="space-y-2 text-[13px]">
          {[
            { c: "成本結構", roles: "僅老闆" },
            { c: "客戶名單", roles: "老闆、主管" },
            { c: "供應商資料", roles: "老闆、主管" },
          ].map((r) => (
            <div key={r.c} className="flex items-center justify-between">
              <span className="text-slate-600">{r.c}</span>
              <Badge tone="slate">{r.roles}</Badge>
            </div>
          ))}
          <p className="pt-1 text-[11px] text-slate-400">
            員工角色對以上三類機密資料一律遮蔽為 ＊＊＊
          </p>
        </div>
      </Section>

      {/* LINE 推播 */}
      <Section icon={<MessageCircle className="h-4 w-4" />} title="LINE 推播設定">
        <div className="divide-y divide-slate-100">
          <ToggleRow label="每日 08:00 營運摘要" defaultOn desc="昨日營收、待決策、異常" />
          <ToggleRow label="即時異常警示" defaultOn desc="工單延遲、缺貨即時通知" />
          <ToggleRow label="待決策提醒" defaultOn desc="待決策 > 0 時提醒" />
        </div>
      </Section>
    </div>
  );
}
