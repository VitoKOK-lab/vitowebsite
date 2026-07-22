import * as React from "react";
import * as Icons from "lucide-react";

/** 依名稱動態取 lucide 圖示(nav 用) */
export function LucideIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const C = (Icons as unknown as Record<
    string,
    React.ComponentType<{ className?: string }>
  >)[name];
  return C ? <C className={className} /> : null;
}
