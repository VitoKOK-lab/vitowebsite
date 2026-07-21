import * as React from "react";
import { cn } from "@/lib/utils";

const palette = [
  "bg-brand-100 text-brand-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
  return h;
}

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const initials = name.slice(0, name.length > 2 ? 1 : 2);
  const color = palette[hash(name) % palette.length];
  const sizeCls =
    size === "sm" ? "h-7 w-7 text-xs" : size === "lg" ? "h-11 w-11 text-base" : "h-9 w-9 text-sm";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold",
        color,
        sizeCls,
        className
      )}
    >
      {initials}
    </span>
  );
}
