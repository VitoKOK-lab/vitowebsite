import type { DecisionStatus, IndustryKey, ModuleKey } from "@/lib/types";

export interface Employee {
  id: string;
  name: string;
  role: "manager" | "staff";
  dept: string;
  closed: number; // 結案數
  winRate: number; // 成交率 %
  onTime: number; // 準時率 %
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
}

export interface ImpactItem {
  label: string;
  value: string;
  tone?: "brand" | "amber" | "emerald" | "rose" | "slate";
}

/** 決策卡可選的「調整」選項(讓對方玩也不穿幫) */
export interface AdjustOption {
  label: string;
  learned: string; // 選了之後顯示的「已學習」句
}

export interface AiDecision {
  id: string;
  industry: IndustryKey;
  module: ModuleKey;
  category: string; // 補貨 / 調價 / 工單延遲 ...
  title: string;
  situation: string;
  suggestion: string;
  reasoning: string;
  impact: ImpactItem[];
  status: DecisionStatus;
  createdAt: string;
  /** 給「調整」用的預設選項 */
  adjustOptions?: AdjustOption[];
  /** 決定後填入 */
  humanDecision?: string;
  decidedBy?: string;
  decidedAt?: string;
  /** 相似情境的分組鍵,用於「學習後相似卡反映偏好」 */
  learningTag?: string;
  refType?: string;
  refId?: string;
}

export interface AiLearningLog {
  id: string;
  decisionId: string;
  industry: IndustryKey;
  situationSnapshot: string;
  aiSuggestion: string;
  humanDecision: string;
  delta: string;
  note: string;
  learnedText: string;
  createdAt: string;
}

export interface StageEvent {
  stageKey: string;
  by: string;
  note?: string;
  photo?: boolean;
  at: string;
}

export interface WorkOrder {
  id: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  itemsSummary: string;
  qty: number;
  currentStage: string;
  dueDate: string;
  amount: number;
  cost: number;
  ownerId: string;
  ownerName: string;
  delayed: boolean;
  done: boolean;
  events: StageEvent[];
}

export interface Sku {
  id: string;
  sku: string;
  name: string;
  category: string;
  cost: number;
  price: number;
  onHand: number;
  safetyStock: number;
  avgDailyUse: number;
  leadTimeDays: number;
  supplierName: string;
  expiryDate?: string; // kitchen only
  trend?: "hot" | "slow" | "normal";
}

export interface QuoteItem {
  name: string;
  spec: string;
  qty: number;
}
export interface Quote {
  id: string;
  quoteNo: string;
  customerName: string;
  items: QuoteItem[];
  cost: number;
  margin: number; // %
  suggestedPrice: number;
  status: "draft" | "sent" | "read" | "won" | "lost";
  sentAt?: string;
  ownerId: string;
  ownerName: string;
}

export interface CsMessage {
  from: "customer" | "ai" | "human";
  text: string;
  at: string;
}
export interface CsConversation {
  id: string;
  customerId: string;
  customerName: string;
  channel: "web" | "line";
  status: "ai" | "human" | "closed";
  messages: CsMessage[];
  topic: string;
}

export interface PickingCandidate {
  id: string;
  productName: string;
  source: string;
  trendScore: number;
  estCost: number;
  estMargin: number;
  suggestedTestQty: number;
  risk: string;
  analysis: string;
  status: "candidate" | "testing" | "adopted" | "passed";
}

export interface RadarItem {
  id: string;
  title: string;
  source: string;
  fact: string;
  impact: string;
  suggestion: string;
  importance: "high" | "mid" | "low";
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  detail: string;
  ownerId: string;
  kind: "stage" | "stocktake" | "picking" | "quote";
  done: boolean;
  refId?: string;
}

export interface IndustryData {
  employees: Employee[];
  customers: Customer[];
  decisions: AiDecision[];
  learningLog: AiLearningLog[];
  workOrders: WorkOrder[];
  skus: Sku[];
  quotes: Quote[];
  conversations: CsConversation[];
  candidates: PickingCandidate[];
  radar: RadarItem[];
  tasks: Task[];
  revenueToday: number;
}
