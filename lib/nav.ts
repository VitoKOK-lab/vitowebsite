import type { ModuleKey, Role } from "@/lib/types";
import type { IndustryConfig } from "@/lib/industry/adapter";

export interface NavItem {
  key: ModuleKey;
  label: string;
  href: string;
  icon: string; // lucide icon name
}

/** 依產業/角色產生導覽項目標籤(術語映射) */
export function navItemFor(
  key: ModuleKey,
  industry: IndustryConfig,
  role: Role
): NavItem {
  const map: Record<ModuleKey, NavItem> = {
    decisions: { key, href: "/decisions", icon: "Sparkles", label: "決策佇列" },
    dashboard: {
      key,
      href: "/dashboard",
      icon: "LayoutDashboard",
      label: role === "staff" ? "今日任務" : "儀表板",
    },
    orders: {
      key,
      href: "/orders",
      icon: "PackageSearch",
      label: industry.terms.orderNoun,
    },
    inventory: { key, href: "/inventory", icon: "Boxes", label: "進銷存" },
    quote: { key, href: "/quote", icon: "FileText", label: "報價" },
    cs: { key, href: "/cs", icon: "MessagesSquare", label: "AI 客服" },
    picking: { key, href: "/picking", icon: "Lightbulb", label: "AI 選品" },
    radar: { key, href: "/radar", icon: "Radar", label: "產業雷達" },
    admin: { key, href: "/admin", icon: "Settings2", label: "後台" },
  };
  return map[key];
}
