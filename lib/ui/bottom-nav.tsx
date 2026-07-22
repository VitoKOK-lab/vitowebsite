"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/nav";
import { LucideIcon } from "./lucide-icon";

export function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const primary = items.slice(0, 4);
  const overflow = items.slice(4);
  const [moreOpen, setMoreOpen] = React.useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur-md safe-bottom">
        <div className="mx-auto flex max-w-2xl items-stretch">
          {primary.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors tap-highlight-none",
                isActive(item.href)
                  ? "text-brand-600"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LucideIcon name={item.icon} className="h-5 w-5" />
              <span className="truncate max-w-[4.5rem]">{item.label}</span>
            </Link>
          ))}
          {overflow.length > 0 && (
            <button
              onClick={() => setMoreOpen(true)}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium tap-highlight-none",
                overflow.some((o) => isActive(o.href))
                  ? "text-brand-600"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGrid className="h-5 w-5" />
              <span>更多</span>
            </button>
          )}
        </div>
      </nav>

      {moreOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-slate-900/20 backdrop-blur-sm"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="w-full animate-fade-in-up rounded-t-3xl border-t border-slate-200 bg-white p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
            <div className="grid grid-cols-4 gap-3">
              {overflow.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-medium transition-colors",
                    isActive(item.href)
                      ? "border-brand-200 bg-brand-50 text-brand-700"
                      : "border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <LucideIcon name={item.icon} className="h-5 w-5" />
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
