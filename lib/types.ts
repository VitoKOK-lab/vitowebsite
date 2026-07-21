// === 核心型別 ===

export type Role = "owner" | "manager" | "staff" | "customer";

export const ROLES: { key: Role; label: string; desc: string }[] = [
  { key: "owner", label: "老闆", desc: "全局數據 + 決策 + 後台" },
  { key: "manager", label: "主管", desc: "部門數據 + 派工" },
  { key: "staff", label: "員工", desc: "只看今日任務" },
  { key: "customer", label: "客戶", desc: "自己的訂單與客服" },
];

export type IndustryKey = "factory" | "ecom" | "kitchen";

export type ModuleKey =
  | "decisions"
  | "dashboard"
  | "quote"
  | "orders"
  | "inventory"
  | "cs"
  | "picking"
  | "radar"
  | "admin";

export type DecisionStatus = "pending" | "adopted" | "adjusted" | "rejected";

export type ConfClass = "customer_list" | "cost_structure" | "supplier";
