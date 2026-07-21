import * as React from "react";
import { cn } from "@/lib/utils";
import type { OrderStage } from "@/lib/industry/adapter";

interface StageProgressProps {
  stages: OrderStage[];
  currentKey: string;
  delayed?: boolean;
  compact?: boolean;
}

/** 訂單進度條:依產業站點顯示,延遲變紅 */
export function StageProgress({
  stages,
  currentKey,
  delayed = false,
  compact = false,
}: StageProgressProps) {
  const currentIdx = Math.max(
    0,
    stages.findIndex((s) => s.key === currentKey)
  );

  return (
    <div className="flex items-center">
      {stages.map((stage, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const color = delayed && active ? "rose" : done || active ? "brand" : "slate";
        return (
          <React.Fragment key={stage.key}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex items-center justify-center rounded-full text-[10px] font-semibold transition-colors",
                  compact ? "h-5 w-5" : "h-6 w-6",
                  color === "rose" && "bg-rose-500 text-white",
                  color === "brand" &&
                    (active
                      ? "bg-brand-600 text-white ring-4 ring-brand-100"
                      : "bg-brand-500 text-white"),
                  color === "slate" && "bg-slate-200 text-slate-400"
                )}
              >
                {done ? "✓" : i + 1}
              </div>
              {!compact && (
                <span
                  className={cn(
                    "text-[11px]",
                    active
                      ? delayed
                        ? "font-semibold text-rose-600"
                        : "font-semibold text-brand-700"
                      : "text-slate-400"
                  )}
                >
                  {stage.label}
                </span>
              )}
            </div>
            {i < stages.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 rounded-full transition-colors",
                  compact ? "mx-1" : "mx-1.5 -mt-4",
                  i < currentIdx ? "bg-brand-500" : "bg-slate-200"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
