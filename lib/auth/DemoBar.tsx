"use client";

import * as React from "react";
import { ChevronDown, RotateCcw, UserRound, Building2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLES, type IndustryKey, type Role } from "@/lib/types";
import { INDUSTRY_LIST } from "@/lib/industry/adapter";
import { useSession } from "@/lib/auth/SessionProvider";
import { resetStore } from "@/lib/data/store";

export function DemoBar() {
  const { role, industry, setRole, setIndustry, bump } = useSession();
  const [open, setOpen] = React.useState<null | "role" | "industry">(null);
  const [resetting, setResetting] = React.useState(false);

  const currentRole = ROLES.find((r) => r.key === role)!;
  const currentIndustry = INDUSTRY_LIST.find((i) => i.key === industry)!;

  function pickRole(r: Role) {
    setRole(r);
    setOpen(null);
  }
  function pickIndustry(i: IndustryKey) {
    setIndustry(i);
    setOpen(null);
  }
  function reset() {
    setResetting(true);
    resetStore();
    bump();
    setTimeout(() => setResetting(false), 600);
  }

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center gap-2 px-3 py-2">
        <span className="mr-auto flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <span className="hidden sm:inline">AI 同事</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            demo
          </span>
        </span>

        {/* 產業切換 */}
        <div className="relative">
          <button
            onClick={() => setOpen(open === "industry" ? null : "industry")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm active:scale-95"
          >
            <span>{currentIndustry.emoji}</span>
            <span className="max-w-[7rem] truncate">
              {currentIndustry.tagline}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
          {open === "industry" && (
            <Dropdown title="切換產業" onClose={() => setOpen(null)}>
              {INDUSTRY_LIST.map((i) => (
                <DropItem
                  key={i.key}
                  active={i.key === industry}
                  onClick={() => pickIndustry(i.key)}
                >
                  <span className="text-base">{i.emoji}</span>
                  <div className="text-left">
                    <div className="font-medium text-slate-800">
                      {i.displayName}
                    </div>
                    <div className="text-[11px] text-slate-400">{i.tagline}</div>
                  </div>
                </DropItem>
              ))}
            </Dropdown>
          )}
        </div>

        {/* 角色切換 */}
        <div className="relative">
          <button
            onClick={() => setOpen(open === "role" ? null : "role")}
            className="flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-1.5 text-xs font-semibold text-brand-700 shadow-sm active:scale-95"
          >
            <UserRound className="h-3.5 w-3.5" />
            <span>{currentRole.label}</span>
            <ChevronDown className="h-3.5 w-3.5 text-brand-400" />
          </button>
          {open === "role" && (
            <Dropdown title="切換角色身分" onClose={() => setOpen(null)}>
              {ROLES.map((r) => (
                <DropItem
                  key={r.key}
                  active={r.key === role}
                  onClick={() => pickRole(r.key)}
                >
                  <div className="text-left">
                    <div className="font-medium text-slate-800">{r.label}</div>
                    <div className="text-[11px] text-slate-400">{r.desc}</div>
                  </div>
                </DropItem>
              ))}
            </Dropdown>
          )}
        </div>

        {/* 重置 demo 資料 */}
        <button
          onClick={reset}
          title="重置 demo 資料"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm active:scale-95 hover:text-slate-600"
        >
          <RotateCcw
            className={cn("h-3.5 w-3.5", resetting && "animate-spin")}
          />
        </button>
      </div>
    </div>
  );
}

function Dropdown({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 z-50 mt-2 w-60 origin-top-right animate-fade-in-up rounded-xl border border-slate-200 bg-white p-1.5 shadow-card-hover">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            <Building2 className="h-3 w-3" />
            {title}
          </span>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}

function DropItem({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors",
        active ? "bg-brand-50 ring-1 ring-brand-200" : "hover:bg-slate-50"
      )}
    >
      {children}
      {active && <span className="ml-auto text-brand-500">●</span>}
    </button>
  );
}
