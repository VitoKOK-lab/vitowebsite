import type { ConfClass, ModuleKey, Role } from "@/lib/types";
import type { IndustryConfig } from "@/lib/industry/adapter";

// === 輕量權限:畫面過濾 + 欄位遮蔽(取代生產級 RLS 引擎) ===

/** 哪些角色能看到某個機密資料類別(未列入=可見) */
const CLASS_ACCESS: Record<ConfClass, Role[]> = {
  customer_list: ["owner", "manager"],
  cost_structure: ["owner"],
  supplier: ["owner", "manager"],
};

/** 各角色能進入的模組(owner 全開;其餘限縮) */
const ROLE_MODULES: Record<Role, ModuleKey[] | "all"> = {
  owner: "all",
  manager: ["dashboard", "decisions", "orders", "inventory", "quote", "cs"],
  staff: ["dashboard", "orders", "inventory"],
  customer: ["orders", "cs"],
};

export function canSeeModule(
  role: Role,
  moduleKey: ModuleKey,
  industry: IndustryConfig
): boolean {
  if (!industry.modules[moduleKey]) return false;
  const allowed = ROLE_MODULES[role];
  if (allowed === "all") return true;
  return allowed.includes(moduleKey);
}

export function visibleModules(
  role: Role,
  industry: IndustryConfig
): ModuleKey[] {
  const all: ModuleKey[] = [
    "dashboard",
    "decisions",
    "orders",
    "inventory",
    "quote",
    "cs",
    "picking",
    "radar",
    "admin",
  ];
  return all.filter((m) => canSeeModule(role, m, industry));
}

/** 該角色是否能看到某機密類別的真實值 */
export function canSeeClass(role: Role, cls: ConfClass): boolean {
  return CLASS_ACCESS[cls].includes(role);
}

/** owner/manager 可見全局數據;staff/customer 不可 */
export function canSeeGlobalData(role: Role): boolean {
  return role === "owner" || role === "manager";
}
