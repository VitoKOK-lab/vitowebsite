"use client";

import * as React from "react";
import type { IndustryKey, Role } from "@/lib/types";

interface SessionCtx {
  role: Role;
  industry: IndustryKey;
  /** 每次 mutation 後 +1,觸發讀取端重新 render */
  version: number;
  setRole: (r: Role) => void;
  setIndustry: (i: IndustryKey) => void;
  bump: () => void;
}

const Ctx = React.createContext<SessionCtx | null>(null);

const ROLE_KEY = "demo_role";
const INDUSTRY_KEY = "demo_industry";
const VALID_ROLES: Role[] = ["owner", "manager", "staff", "customer"];
const VALID_INDUSTRIES: IndustryKey[] = ["factory", "ecom", "kitchen"];

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = React.useState<Role>("owner");
  const [industry, setIndustryState] = React.useState<IndustryKey>("factory");
  const [version, setVersion] = React.useState(0);

  // 掛載後從 localStorage 還原(避免 SSR/CSR 不一致)
  React.useEffect(() => {
    const r = localStorage.getItem(ROLE_KEY) as Role | null;
    const i = localStorage.getItem(INDUSTRY_KEY) as IndustryKey | null;
    if (r && VALID_ROLES.includes(r)) setRoleState(r);
    if (i && VALID_INDUSTRIES.includes(i)) setIndustryState(i);
  }, []);

  // 依產業切換主題色(CSS 變數掛在 <html> 的 data-industry)
  React.useEffect(() => {
    document.documentElement.setAttribute("data-industry", industry);
  }, [industry]);

  const setRole = React.useCallback((r: Role) => {
    setRoleState(r);
    localStorage.setItem(ROLE_KEY, r);
  }, []);
  const setIndustry = React.useCallback((i: IndustryKey) => {
    setIndustryState(i);
    localStorage.setItem(INDUSTRY_KEY, i);
  }, []);
  const bump = React.useCallback(() => setVersion((v) => v + 1), []);

  const value = React.useMemo(
    () => ({ role, industry, version, setRole, setIndustry, bump }),
    [role, industry, version, setRole, setIndustry, bump]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession(): SessionCtx {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useSession must be used within SessionProvider");
  return c;
}
