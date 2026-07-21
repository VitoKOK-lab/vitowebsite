"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/nav";

function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
    name
  ];
  return C ? <C className={className} /> : null;
}

/** 桌面/投影用側邊導覽(≥lg 顯示,取代底部導覽) */
export function Sidebar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="sticky top-[49px] hidden h-[calc(100dvh-49px)] w-56 shrink-0 flex-col border-r border-slate-200 px-3 py-4 lg:flex">
      <div className="mb-3 flex items-center gap-2 px-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Icons.Sparkles className="h-4 w-4" />
        </span>
        <span className="text-[15px] font-bold tracking-tight text-slate-800">
          AI 同事
        </span>
      </div>
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              )}
            >
              <Icon name={item.icon} className="h-4.5 w-4.5" />
              <span>{item.label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-2 text-[11px] text-slate-300">
        AI Colleague OS · demo
      </div>
    </aside>
  );
}
