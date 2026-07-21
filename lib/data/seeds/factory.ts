import type { IndustryData, Sku } from "../models";
import { iso, pad, materialize, type AiDecisionSeed } from "./helpers";

export function buildFactory(): IndustryData {
  const employees: IndustryData["employees"] = [
    { id: "f-e1", name: "陳建良", role: "manager", dept: "生產管理", closed: 48, winRate: 0, onTime: 94 },
    { id: "f-e2", name: "林志明", role: "staff", dept: "加工組", closed: 62, winRate: 0, onTime: 91 },
    { id: "f-e3", name: "王美惠", role: "staff", dept: "品檢組", closed: 55, winRate: 0, onTime: 97 },
    { id: "f-e4", name: "張偉誠", role: "staff", dept: "組裝組", closed: 41, winRate: 0, onTime: 88 },
    { id: "f-e5", name: "李淑芬", role: "staff", dept: "業務", closed: 33, winRate: 68, onTime: 90 },
  ];

  const customers: IndustryData["customers"] = [
    { id: "f-c1", name: "捷安車業", phone: "0912-345-678" },
    { id: "f-c2", name: "全速電動車行", phone: "0922-111-222" },
    { id: "f-c3", name: "綠動能經銷", phone: "0933-888-999" },
    { id: "f-c4", name: "台北通勤族車業", phone: "0955-444-333" },
  ];

  const stages = ["material", "machining", "assembly", "qc", "shipping"];
  const models = [
    "都會通勤款 電池模組",
    "輕量車架 加工件",
    "控制器 總成",
    "碟煞卡鉗 組",
    "LED 大燈 模組",
    "後搖臂 加工",
  ];

  const workOrders: IndustryData["workOrders"] = Array.from({ length: 20 }).map(
    (_, i) => {
      const stage = stages[i % stages.length];
      const cust = customers[i % customers.length];
      const emp = employees[1 + (i % 4)];
      const delayed = i === 3 || i === 11;
      const done = i % 7 === 6;
      const qty = 20 + ((i * 13) % 180);
      const unit = 1800 + ((i * 137) % 2600);
      return {
        id: `f-wo-${i}`,
        orderNo: `WO-2607-${pad(i + 1)}`,
        customerId: cust.id,
        customerName: cust.name,
        itemsSummary: models[i % models.length],
        qty,
        currentStage: done ? "shipping" : stage,
        dueDate: iso(delayed ? -2 : (i % 9) + 1),
        amount: qty * unit,
        cost: qty * unit * 0.72,
        ownerId: emp.id,
        ownerName: emp.name,
        delayed,
        done,
        events: [
          { stageKey: "material", by: emp.name, at: iso(-5) },
          ...(stages.indexOf(stage) >= 1
            ? [{ stageKey: "machining", by: emp.name, at: iso(-3), photo: true }]
            : []),
        ],
      };
    }
  );

  const parts = [
    ["電池模組 48V20Ah", "電池", 8200, 130, 15, "宏達電能"],
    ["無刷控制器 800W", "電控", 1850, 60, 20, "動力科技"],
    ["鋁合金車架", "車體", 3200, 45, 8, "輕量金屬"],
    ["液壓碟煞組", "煞車", 1250, 90, 30, "安全制動"],
    ["LED 頭燈總成", "燈具", 680, 140, 40, "亮視照明"],
    ["真空胎 14吋", "輪胎", 520, 200, 60, "耐磨輪業"],
    ["碳纖維前叉", "車體", 4500, 25, 10, "碳纖複材"],
    ["儀表板 液晶", "電控", 950, 75, 25, "動力科技"],
  ];
  const skus: Sku[] = parts.map((p, i) => {
    const onHand = [12, 55, 6, 80, 130, 190, 4, 70][i];
    const safety = p[4] as number;
    return {
      id: `f-sku-${i}`,
      sku: `PT-${pad(1001 + i, 4)}`,
      name: p[0] as string,
      category: p[1] as string,
      cost: p[2] as number,
      price: (p[2] as number) * 1.4,
      onHand,
      safetyStock: safety,
      avgDailyUse: [3, 5, 2, 8, 14, 20, 1.5, 6][i],
      leadTimeDays: (p[3] as number) === 130 ? 14 : 7,
      supplierName: p[5] as string,
      trend: onHand < safety ? "hot" : "normal",
    };
  });

  const quotes: IndustryData["quotes"] = [
    {
      id: "f-q1", quoteNo: "QT-2607-018", customerName: "捷安車業",
      items: [{ name: "都會通勤款 整車", spec: "48V/500W", qty: 50 }],
      cost: 1_450_000, margin: 22, suggestedPrice: 1_860_000, status: "read",
      sentAt: iso(-2), ownerId: "f-e5", ownerName: "李淑芬",
    },
    {
      id: "f-q2", quoteNo: "QT-2607-019", customerName: "綠動能經銷",
      items: [{ name: "控制器 總成", spec: "800W", qty: 120 }],
      cost: 222_000, margin: 28, suggestedPrice: 308_000, status: "sent",
      sentAt: iso(-1), ownerId: "f-e5", ownerName: "李淑芬",
    },
    {
      id: "f-q3", quoteNo: "QT-2607-020", customerName: "全速電動車行",
      items: [{ name: "電池模組", spec: "48V20Ah", qty: 80 }],
      cost: 656_000, margin: 18, suggestedPrice: 800_000, status: "won",
      sentAt: iso(-6), ownerId: "f-e5", ownerName: "李淑芬",
    },
  ];

  const conversations: IndustryData["conversations"] = [
    {
      id: "f-cs1", customerId: "f-c1", customerName: "捷安車業", channel: "line",
      status: "ai", topic: "交期查詢",
      messages: [
        { from: "customer", text: "WO-2607-004 大概什麼時候可以出貨?", at: iso(0, 10) },
        { from: "ai", text: "您好!WO-2607-004 目前在「加工」站,但因碳纖前叉料件延遲,預計交期順延至 7/25。已為您通知業務李淑芬跟進。", at: iso(0, 10) },
      ],
    },
    {
      id: "f-cs2", customerId: "f-c2", customerName: "全速電動車行", channel: "web",
      status: "closed", topic: "報價確認",
      messages: [
        { from: "customer", text: "上次電池模組的報價還算數嗎?", at: iso(-1, 14) },
        { from: "ai", text: "QT-2607-020 電池模組報價 80 萬(80 台)已於 7/15 成交,感謝!如需追加請告訴我。", at: iso(-1, 14) },
      ],
    },
  ];

  const radar: IndustryData["radar"] = [
    {
      id: "f-r1", title: "碳纖維原料價格單月上漲 12%", source: "工業材料週報",
      fact: "上游碳纖維絲束因供給收縮,現貨報價單月上漲 12%,預期第三季維持高檔。",
      impact: "本廠碳纖前叉、輕量車架成本上升,受影響在製工單約 7 張、報價單 3 張。",
      suggestion: "建議 Q3 新報價調升 3%,並優先鎖定既有低價庫存投產。已生成調價決策卡。",
      importance: "high", createdAt: iso(0, 8),
    },
    {
      id: "f-r2", title: "電動二輪新補助 8/1 上路", source: "交通部公告",
      fact: "汰舊換新電動機車補助加碼 3000 元,適用 CNS 認證車款。",
      impact: "都會通勤款符合資格,可望帶動經銷通路 Q3 拉貨。",
      suggestion: "建議提前備料電池模組與控制器,避免補助上路後缺貨。",
      importance: "mid", createdAt: iso(-1, 8),
    },
  ];

  const decisions: AiDecisionSeed[] = [
    {
      id: "f-d1", category: "調價", title: "碳纖維漲價 12%,建議 Q3 報價調升 3%",
      situation: "碳纖維原料單月上漲 12%,影響碳纖前叉、輕量車架成本;目前有 7 張在製工單、3 張未成交報價使用該料件。",
      suggestion: "Q3 起新報價之碳纖相關品項調升 3%,既有已報價維持不變以保商譽。",
      reasoning: "毛利模型顯示不調價將使該類品項毛利由 22% 降至 16%;調升 3% 可回補至 21%,對成交率影響經估算 < 2%。",
      impact: [
        { label: "受影響報價", value: "3 張", tone: "amber" },
        { label: "毛利回補", value: "+5%", tone: "emerald" },
        { label: "預估成交影響", value: "-2%", tone: "slate" },
      ],
      learningTag: "pricing_raise",
      adjustOptions: [
        { label: "改調升 2%", learned: "您偏好較保守的調價幅度(2%)" },
        { label: "改調升 5%", learned: "您偏好較積極的調價幅度(5%)" },
        { label: "只調新客戶", learned: "您偏好僅對新客戶調價、維護老客戶價格" },
      ],
    },
    {
      id: "f-d2", category: "補貨", title: "碳纖維前叉低於安全庫存,建議下單 30 支",
      situation: "碳纖維前叉現有庫存 4 支,安全庫存 10 支,近 8 週平均日用量 1.5 支,前置期 10 天。",
      suggestion: "立即向「碳纖複材」下單 30 支,可覆蓋約 20 天需求並回補安全水位。",
      reasoning: "以移動平均需求 1.5 支/日 × 前置期 10 天 = 15 支,加安全庫存 10 支,扣現有 4 支 → 建議補 30 支(含緩衝)。",
      impact: [
        { label: "現有庫存", value: "4 支", tone: "rose" },
        { label: "建議下單", value: "30 支", tone: "brand" },
        { label: "可避免缺料", value: "20 天", tone: "emerald" },
      ],
      learningTag: "reorder",
      adjustOptions: [
        { label: "改補 20 支", learned: "您偏好保留較少安全庫存(約 13 天)" },
        { label: "改補 50 支", learned: "您偏好保留 15% 以上安全庫存緩衝" },
      ],
    },
    {
      id: "f-d3", category: "工單延遲", title: "WO-2607-004 延遲 2 天,建議調整排程",
      situation: "WO-2607-004(捷安車業,50 台)因碳纖前叉缺料卡在加工站,已逾預計交期 2 天。",
      suggestion: "先以現有庫存投產可完成的 20 台先行出貨,其餘待補料後併單,並主動通知客戶新交期 7/25。",
      reasoning: "分批出貨可先滿足客戶 40% 需求、降低違約風險;客戶歷史對分批接受度高。",
      impact: [
        { label: "先出貨", value: "20 台", tone: "emerald" },
        { label: "延遲天數", value: "2 天", tone: "rose" },
        { label: "客戶滿意風險", value: "降低", tone: "brand" },
      ],
      learningTag: "delay",
      adjustOptions: [
        { label: "全部等齊再出", learned: "您偏好整單出貨、不分批" },
        { label: "改通知交期 7/28", learned: "您偏好保守估交期、預留緩衝" },
      ],
    },
    {
      id: "f-d5", category: "補貨", title: "電池模組 48V20Ah 低於安全庫存,建議下單 40 顆",
      situation: "電池模組現有 12 顆,安全庫存 15 顆,近 8 週平均日用量 3 顆,前置期 14 天。",
      suggestion: "向「宏達電能」下單 40 顆,可覆蓋前置期需求並回補安全水位。",
      reasoning: "以移動平均 3 顆/日 × 前置期 14 天 = 42 顆,加安全庫存 15 顆,扣現有 12 顆 → 建議補 40 顆。",
      impact: [
        { label: "現有庫存", value: "12 顆", tone: "amber" },
        { label: "建議下單", value: "40 顆", tone: "brand" },
        { label: "可避免缺料", value: "18 天", tone: "emerald" },
      ],
      learningTag: "reorder",
      adjustOptions: [
        { label: "改補 30 顆", learned: "您偏好保留較少安全庫存(約 13 天)" },
        { label: "改補 60 顆", learned: "您偏好保留 15% 以上安全庫存緩衝" },
      ],
    },
    {
      id: "f-d4", category: "品檢", title: "組裝組不良率升至 3.2%,建議複檢批次",
      situation: "本週組裝組不良率由 1.5% 升至 3.2%,集中在 LED 頭燈總成的接點鬆脫。",
      suggestion: "抽檢近 3 批 LED 頭燈總成,並暫停該供應商本批入庫待複驗。",
      reasoning: "不良集中於單一料件與供應商,判斷為來料問題;及早攔截可避免整車返工成本。",
      impact: [
        { label: "不良率", value: "3.2%", tone: "rose" },
        { label: "涉及批次", value: "3 批", tone: "amber" },
        { label: "預估省返工", value: "約 8 萬", tone: "emerald" },
      ],
      learningTag: "quality",
    },
  ];

  const tasks: IndustryData["tasks"] = [
    { id: "f-t1", title: "推進 WO-2607-002 至品檢", detail: "加工完成,轉品檢站", ownerId: "f-e2", kind: "stage", done: false, refId: "f-wo-1" },
    { id: "f-t2", title: "WO-2607-006 出貨拍照", detail: "包裝完成,上傳出貨照", ownerId: "f-e2", kind: "stage", done: false, refId: "f-wo-5" },
    { id: "f-t3", title: "盤點 電控類零件", detail: "控制器、儀表板實盤", ownerId: "f-e2", kind: "stocktake", done: false },
    { id: "f-t4", title: "LED 頭燈批次複檢", detail: "抽檢近 3 批接點", ownerId: "f-e3", kind: "stage", done: true, refId: "f-wo-4" },
  ];

  return {
    employees, customers, workOrders, skus, quotes, conversations,
    candidates: [], radar,
    decisions: decisions.map((d, i) => materialize(d, "factory", i)),
    learningLog: [], tasks, revenueToday: 2_480_000,
  };
}
