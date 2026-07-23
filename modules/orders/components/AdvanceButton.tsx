"use client";

import * as React from "react";
import { ArrowRight, Camera, CheckCircle2, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth/SessionProvider";
import { ROLES, type IndustryKey } from "@/lib/types";
import { advanceStage } from "@/modules/orders/service";

export function AdvanceButton({
  orderId,
  industry,
  nextLabel,
  isLast,
}: {
  orderId: string;
  industry: IndustryKey;
  nextLabel: string | null;
  isLast: boolean;
}) {
  const { role, bump } = useSession();
  const [busy, setBusy] = React.useState(false);
  const [photo, setPhoto] = React.useState(false);

  function advance() {
    setBusy(true);
    const by = ROLES.find((r) => r.key === role)?.label ?? "現場人員";
    advanceStage(industry, orderId, by, photo);
    setTimeout(() => {
      bump();
      setBusy(false);
      setPhoto(false);
    }, 300);
  }

  if (nextLabel === null) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 py-3.5 text-[14px] font-semibold text-emerald-700">
        <PartyPopper className="h-4 w-4" /> 已完成所有站點
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => setPhoto((v) => !v)}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-[13px] font-medium transition-colors",
          photo
            ? "border-brand-200 bg-brand-50 text-brand-700"
            : "border-slate-200 bg-white text-slate-500"
        )}
      >
        <Camera className="h-4 w-4" />
        {photo ? "已附上現場照片 ✓" : "附上現場照片(選填)"}
      </button>
      <button
        onClick={advance}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-[15px] font-semibold text-white shadow-pop transition-transform active:scale-[0.98] disabled:opacity-60"
      >
        {isLast ? (
          <>
            <CheckCircle2 className="h-5 w-5" /> 完成並出貨
          </>
        ) : (
          <>
            推進到「{nextLabel}」 <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
    </div>
  );
}
