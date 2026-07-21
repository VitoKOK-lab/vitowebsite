"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** demo 用視覺開關(本地狀態,不持久化) */
export function ToggleRow({
  label,
  desc,
  defaultOn,
  locked,
}: {
  label: string;
  desc?: string;
  defaultOn: boolean;
  locked?: boolean;
}) {
  const [on, setOn] = React.useState(defaultOn);
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-medium text-slate-800">{label}</div>
        {desc && <div className="text-[12px] text-slate-400">{desc}</div>}
      </div>
      <button
        disabled={locked}
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          on ? "bg-brand-600" : "bg-slate-200",
          locked && "opacity-50"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            on ? "translate-x-[22px]" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}
