import type { IndustryKey, ModuleKey, Role } from "@/lib/types";

export interface OrderStage {
  key: string;
  label: string;
  /** tailwind color token, e.g. "brand" | "amber" | "emerald" */
  tone: string;
}

export interface PricingVariable {
  key: string;
  label: string;
  unit: string;
  value: number;
}

export type WidgetKey =
  | "revenue"
  | "pending_orders"
  | "alerts"
  | "leaderboard"
  | "ai_growth"
  | "low_stock"
  | "expiry";

export interface IndustryConfig {
  key: IndustryKey;
  displayName: string;
  tagline: string;
  emoji: string;
  /** 術語映射:同一概念在不同產業的叫法 */
  terms: {
    order: string; // 工單 / 訂單 / 備料單
    item: string; // 零件 / 商品 / 食材
    customer: string; // 客戶 / 買家 / 門市
    orderNoun: string; // 工單追蹤 / 出貨追蹤 / 備料追蹤
  };
  /** 訂單進度站點 */
  orderStages: OrderStage[];
  /** 計價變數集 */
  pricingVariables: PricingVariable[];
  /** 每角色的儀表板 widget 組合 */
  widgets: Record<Role, WidgetKey[]>;
  /** 模組開關 */
  modules: Record<ModuleKey, boolean>;
  /** 庫存模式:是否啟用效期 */
  inventoryMode: "parts" | "sku" | "ingredient";
  /** 決策佇列裡本產業的專屬警示標題範例(給空狀態提示用) */
  alertExamples: string[];
}

const allModulesOn = (
  overrides: Partial<Record<ModuleKey, boolean>> = {}
): Record<ModuleKey, boolean> => ({
  decisions: true,
  dashboard: true,
  quote: true,
  orders: true,
  inventory: true,
  cs: true,
  picking: false,
  radar: true,
  admin: true,
  ...overrides,
});

export const FACTORY: IndustryConfig = {
  key: "factory",
  displayName: "光陽電動機車廠",
  tagline: "電動機車製造",
  emoji: "🛵",
  terms: { order: "工單", item: "零件", customer: "客戶", orderNoun: "工單追蹤" },
  orderStages: [
    { key: "material", label: "待料", tone: "slate" },
    { key: "machining", label: "加工", tone: "brand" },
    { key: "assembly", label: "組裝", tone: "brand" },
    { key: "qc", label: "品檢", tone: "amber" },
    { key: "shipping", label: "出貨", tone: "emerald" },
  ],
  pricingVariables: [
    { key: "material", label: "材料單價", unit: "元/kg", value: 320 },
    { key: "labor", label: "工時費率", unit: "元/hr", value: 480 },
    { key: "surface", label: "表面處理", unit: "元/件", value: 150 },
  ],
  widgets: {
    owner: ["revenue", "pending_orders", "alerts", "leaderboard", "ai_growth"],
    manager: ["pending_orders", "alerts", "leaderboard"],
    staff: [],
    customer: [],
  },
  modules: allModulesOn({ picking: false }),
  inventoryMode: "parts",
  alertExamples: ["工單延遲", "料件短缺", "材料漲價"],
};

export const ECOM: IndustryConfig = {
  key: "ecom",
  displayName: "選物 3C 電商",
  tagline: "3C 選品電商",
  emoji: "📦",
  terms: { order: "訂單", item: "商品", customer: "買家", orderNoun: "出貨追蹤" },
  orderStages: [
    { key: "received", label: "接單", tone: "slate" },
    { key: "picking", label: "揀貨", tone: "brand" },
    { key: "packing", label: "包裝", tone: "brand" },
    { key: "shipped", label: "出貨", tone: "amber" },
    { key: "signed", label: "簽收", tone: "emerald" },
  ],
  pricingVariables: [
    { key: "cost", label: "進貨成本", unit: "元/件", value: 680 },
    { key: "platform", label: "平台抽成", unit: "%", value: 8 },
    { key: "logistics", label: "物流成本", unit: "元/件", value: 60 },
  ],
  widgets: {
    owner: ["revenue", "pending_orders", "alerts", "leaderboard", "ai_growth"],
    manager: ["pending_orders", "alerts", "leaderboard"],
    staff: [],
    customer: [],
  },
  modules: allModulesOn({ picking: true }),
  inventoryMode: "sku",
  alertExamples: ["爆品缺貨", "滯銷庫存", "選品機會"],
};

export const KITCHEN: IndustryConfig = {
  key: "kitchen",
  displayName: "常隆中央廚房",
  tagline: "餐廳食材中央廚房",
  emoji: "🍱",
  terms: { order: "備料單", item: "食材", customer: "門市", orderNoun: "備料追蹤" },
  orderStages: [
    { key: "purchase", label: "採購", tone: "slate" },
    { key: "receiving", label: "驗收", tone: "brand" },
    { key: "prep", label: "備料", tone: "amber" },
    { key: "delivery", label: "出餐", tone: "emerald" },
  ],
  pricingVariables: [
    { key: "ingredient", label: "食材成本", unit: "元/kg", value: 95 },
    { key: "labor", label: "人力成本", unit: "元/份", value: 22 },
    { key: "loss", label: "耗損率", unit: "%", value: 6 },
  ],
  widgets: {
    owner: ["revenue", "pending_orders", "expiry", "leaderboard", "ai_growth"],
    manager: ["pending_orders", "expiry", "leaderboard"],
    staff: [],
    customer: [],
  },
  modules: allModulesOn({ picking: false }),
  inventoryMode: "ingredient",
  alertExamples: ["食材效期", "備料不足", "耗損偏高"],
};

export const INDUSTRIES: Record<IndustryKey, IndustryConfig> = {
  factory: FACTORY,
  ecom: ECOM,
  kitchen: KITCHEN,
};

export const INDUSTRY_LIST: IndustryConfig[] = [FACTORY, ECOM, KITCHEN];

export function getIndustryConfig(key: IndustryKey): IndustryConfig {
  return INDUSTRIES[key] ?? FACTORY;
}
