import { MessagesSquare, Bot, Headphones, CheckCircle2 } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { listConversations, customerConversation } from "@/modules/cs/service";
import { currentCustomerId } from "@/modules/orders/service";
import { db } from "@/lib/data/store";
import { ChatThread } from "@/modules/cs/components/ChatThread";
import { Badge } from "@/lib/ui/badge";

export const dynamic = "force-dynamic";

export default function CsPage() {
  const { role, industry } = getSession();
  const cfg = getIndustryConfig(industry);

  // 客戶 → 對話介面
  if (role === "customer") {
    const conv = customerConversation(industry);
    const cid = currentCustomerId(industry);
    const customerName =
      db(industry).customers.find((c) => c.id === cid)?.name ?? cfg.terms.customer;
    const initial = (conv?.messages ?? []).map((m) => ({
      from: m.from,
      text: m.text,
    }));
    return (
      <div className="space-y-3">
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <MessagesSquare className="h-5 w-5 text-brand-500" /> 線上客服
        </h1>
        <ChatThread initial={initial} customerName={customerName} />
      </div>
    );
  }

  // 內部 → 對話列表
  const convs = listConversations(industry, role);
  const statusMeta = {
    ai: { label: "AI 處理中", tone: "brand" as const, icon: Bot },
    human: { label: "已轉真人", tone: "amber" as const, icon: Headphones },
    closed: { label: "已結案", tone: "emerald" as const, icon: CheckCircle2 },
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[13px] font-medium text-slate-400">{cfg.displayName}</p>
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <MessagesSquare className="h-5 w-5 text-brand-500" /> AI 客服
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(["ai", "human", "closed"] as const).map((s) => {
          const m = statusMeta[s];
          const count = convs.filter((c) => c.status === s).length;
          return (
            <div
              key={s}
              className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-card"
            >
              <m.icon className="mx-auto h-4 w-4 text-slate-400" />
              <div className="mt-1 text-lg font-bold text-slate-800 tabular-nums">{count}</div>
              <div className="text-[10px] text-slate-400">{m.label}</div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        {convs.map((c) => {
          const m = statusMeta[c.status];
          const last = c.messages[c.messages.length - 1];
          return (
            <div
              key={c.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
            >
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-slate-800">
                  {c.customerName}
                </span>
                <Badge tone={m.tone}>{m.label}</Badge>
                <span className="ml-auto text-[11px] text-slate-400">{c.topic}</span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-[13px] text-slate-500">{last?.text}</p>
            </div>
          );
        })}
      </div>

      <p className="rounded-xl bg-slate-50 p-3 text-center text-[12px] text-slate-400">
        💡 切換到「客戶」角色,即可親自體驗 AI 客服對話
      </p>
    </div>
  );
}
