import type { IndustryData, Sku } from "../models";
import { iso, pad, materialize, type AiDecisionSeed } from "./helpers";

export function buildEcom(): IndustryData {
  const employees: IndustryData["employees"] = [
    { id: "e-e1", name: "黃俊傑", role: "manager", dept: "營運", closed: 120, winRate: 0, onTime: 96 },
    { id: "e-e2", name: "吳曉婷", role: "staff", dept: "倉儲揀貨", closed: 210, winRate: 0, onTime: 98 },
    { id: "e-e3", name: "蔡文彬", role: "staff", dept: "包裝出貨", closed: 188, winRate: 0, onTime: 95 },
    { id: "e-e4", name: "鄭雅文", role: "staff", dept: "客服", closed: 142, winRate: 0, onTime: 93 },
    { id: "e-e5", name: "劉家豪", role: "staff", dept: "選品", closed: 26, winRate: 71, onTime: 0 },
  ];

  const customers: IndustryData["customers"] = [
    { id: "e-c1", name: "林小姐", phone: "0911-222-333" },
    { id: "e-c2", name: "陳先生", phone: "0922-333-444" },
    { id: "e-c3", name: "張小姐", phone: "0933-555-666" },
    { id: "e-c4", name: "王先生", phone: "0955-777-888" },
  ];

  const cats = ["行動電源", "藍牙耳機", "手機殼", "充電線", "智慧手錶", "桌面配件", "喇叭", "支架"];
  const brands = ["ProCharge", "AeroPods", "GuardCase", "FastLink", "PulseWatch", "DeskZen", "SoundWave", "FlexHold"];
  const skus: Sku[] = Array.from({ length: 50 }).map((_, i) => {
    const cat = cats[i % cats.length];
    const cost = 120 + ((i * 53) % 1400);
    const onHand = [0, 3, 8, 240, 15, 320, 55, 180][i % 8] + (i % 5) * 4;
    const safety = 20 + (i % 4) * 15;
    const trend: Sku["trend"] = onHand === 0 || onHand < safety ? "hot" : onHand > 260 ? "slow" : "normal";
    return {
      id: `e-sku-${i}`,
      sku: `SKU-${pad(2001 + i, 4)}`,
      name: `${brands[i % brands.length]} ${cat} ${["Pro", "Air", "Mini", "Max", "SE"][i % 5]}`,
      category: cat,
      cost,
      price: Math.round(cost * (1.6 + (i % 5) * 0.1)),
      onHand,
      safetyStock: safety,
      avgDailyUse: 2 + (i % 12),
      leadTimeDays: 5 + (i % 3) * 2,
      supplierName: ["深圳華越", "東莞精工", "台灣代理商", "越南廠"][i % 4],
      trend,
    };
  });

  const stages = ["received", "picking", "packing", "shipped", "signed"];
  const workOrders: IndustryData["workOrders"] = Array.from({ length: 18 }).map(
    (_, i) => {
      const stage = stages[i % stages.length];
      const cust = customers[i % customers.length];
      const emp = employees[1 + (i % 3)];
      const delayed = i === 5;
      const done = stage === "signed";
      const qty = 1 + (i % 4);
      const sku = skus[i % skus.length];
      return {
        id: `e-wo-${i}`,
        orderNo: `SO-2607-${pad(3100 + i, 4)}`,
        customerId: cust.id,
        customerName: cust.name,
        itemsSummary: `${sku.name} ×${qty}`,
        qty,
        currentStage: stage,
        dueDate: iso(delayed ? -1 : (i % 3) + 1),
        amount: sku.price * qty,
        cost: sku.cost * qty,
        ownerId: emp.id,
        ownerName: emp.name,
        delayed,
        done,
        events: [{ stageKey: "received", by: emp.name, at: iso(-1) }],
      };
    }
  );

  const quotes: IndustryData["quotes"] = [
    {
      id: "e-q1", quoteNo: "QT-2607-051", customerName: "揪團媽媽社",
      items: [{ name: "ProCharge 行動電源 Pro", spec: "20000mAh", qty: 200 }],
      cost: 96_000, margin: 32, suggestedPrice: 141_000, status: "read",
      sentAt: iso(-1), ownerId: "e-e1", ownerName: "黃俊傑",
    },
    {
      id: "e-q2", quoteNo: "QT-2607-052", customerName: "企業採購王先生",
      items: [{ name: "AeroPods 藍牙耳機 Air", spec: "降噪版", qty: 80 }],
      cost: 72_000, margin: 25, suggestedPrice: 96_000, status: "sent",
      sentAt: iso(0), ownerId: "e-e1", ownerName: "黃俊傑",
    },
  ];

  const conversations: IndustryData["conversations"] = [
    {
      id: "e-cs1", customerId: "e-c1", customerName: "林小姐", channel: "web", status: "ai", topic: "到貨查詢",
      messages: [
        { from: "customer", text: "我的訂單 SO-2607-3105 到哪了?", at: iso(0, 11) },
        { from: "ai", text: "林小姐您好!SO-2607-3105 目前在「包裝」站,今日下午出貨,預計明天(7/22)送達,宅配單號稍後以簡訊通知您 😊", at: iso(0, 11) },
      ],
    },
    {
      id: "e-cs2", customerId: "e-c2", customerName: "陳先生", channel: "line", status: "human", topic: "退貨爭議",
      messages: [
        { from: "customer", text: "耳機收到有雜音,我要退貨而且很不滿意!", at: iso(0, 13) },
        { from: "ai", text: "很抱歉造成您的困擾,這類品質問題我已為您轉接專員鄭雅文處理,她會在 30 分鐘內與您聯繫。", at: iso(0, 13) },
      ],
    },
  ];

  const candidates: IndustryData["candidates"] = [
    {
      id: "e-pc1", productName: "磁吸無線行動電源 5000mAh", source: "TikTok 熱度 + 蝦皮搜尋趨勢",
      trendScore: 92, estCost: 180, estMargin: 44, suggestedTestQty: 100,
      risk: "同類競品已多,需搶時間差", analysis: "近 2 週搜尋量週增 38%,對應 iPhone 磁吸生態;毛利估 44%,建議小量測款卡位。",
      status: "candidate",
    },
    {
      id: "e-pc2", productName: "桌面矽膠理線收納盤", source: "Instagram + Google Trends",
      trendScore: 78, estCost: 45, estMargin: 58, suggestedTestQty: 150,
      risk: "客單價低,需搭配主商品拉客單", analysis: "居家辦公長尾需求穩定上升,毛利高、退貨率低,適合當加購品提升客單。",
      status: "candidate",
    },
    {
      id: "e-pc3", productName: "兒童智慧定位手錶", source: "媽媽社群討論度",
      trendScore: 64, estCost: 620, estMargin: 30, suggestedTestQty: 50,
      risk: "需通訊認證、售後較重", analysis: "開學季題材,但售後與認證成本高,建議小量測水溫。",
      status: "testing",
    },
  ];

  const radar: IndustryData["radar"] = [
    {
      id: "e-r1", title: "蝦皮調高賣家平台費 0.5%", source: "電商平台公告",
      fact: "自 8/1 起成交手續費由 5.5% 調升至 6%。",
      impact: "全站毛利平均下降約 0.5 個百分點,低毛利品項受影響最大。",
      suggestion: "建議低毛利 SKU(毛利 < 20%)檢討售價或下架,已列出 6 項清單。",
      importance: "high", createdAt: iso(0, 8),
    },
    {
      id: "e-r2", title: "磁吸配件搜尋量週增 38%", source: "關鍵字趨勢",
      fact: "MagSafe 相容配件搜尋量兩週內成長 38%。",
      impact: "選品機會:磁吸行動電源、磁吸支架需求上升。",
      suggestion: "已生成選品候選卡『磁吸無線行動電源』,建議測款 100 件。",
      importance: "mid", createdAt: iso(-1, 8),
    },
  ];

  const hotSku = skus.find((s) => s.trend === "hot")!;
  const slowSku = skus.find((s) => s.trend === "slow")!;
  const reorderQty = Math.ceil(hotSku.avgDailyUse * hotSku.leadTimeDays + hotSku.safetyStock);

  const decisions: AiDecisionSeed[] = [
    {
      id: "e-d1", category: "補貨", title: `爆品「${hotSku.name}」已缺貨,建議急單補 ${reorderQty} 件`,
      situation: `${hotSku.name}(${hotSku.sku})目前庫存 ${hotSku.onHand} 件,近 7 日日均銷 ${hotSku.avgDailyUse} 件,前置期 ${hotSku.leadTimeDays} 天,已進入缺貨狀態並持續有訂單湧入。`,
      suggestion: `以空運急單向「${hotSku.supplierName}」補 ${reorderQty} 件,並暫時上調售價 5% 控制出貨節奏。`,
      reasoning: "斷貨期間每日損失約 3 筆訂單、影響搜尋排名;急單成本增加但可保住爆品動能與排名。",
      impact: [
        { label: "目前庫存", value: `${hotSku.onHand} 件`, tone: "rose" },
        { label: "建議補貨", value: `${reorderQty} 件`, tone: "brand" },
        { label: "日損訂單", value: "≈3 筆", tone: "amber" },
      ],
      learningTag: "reorder",
      adjustOptions: [
        { label: "改海運(便宜但慢)", learned: "您偏好控制補貨成本、可接受短期缺貨" },
        { label: "補貨但不調價", learned: "您偏好維持售價、以量取勝" },
      ],
    },
    {
      id: "e-d2", category: "滯銷", title: `滯銷品「${slowSku.name}」壓庫存,建議促銷出清`,
      situation: `${slowSku.name} 庫存 ${slowSku.onHand} 件,近 30 日僅售出個位數,週轉天數已超過 90 天。`,
      suggestion: "以 8 折限時促銷 + 首頁曝光出清,回收現金流並釋放倉位。",
      reasoning: "持續壓倉的資金成本與倉儲成本高於折讓損失;出清可回收現金投入爆品。",
      impact: [
        { label: "滯銷庫存", value: `${slowSku.onHand} 件`, tone: "amber" },
        { label: "建議折扣", value: "8 折", tone: "brand" },
        { label: "釋放資金", value: `約 ${Math.round(slowSku.cost * slowSku.onHand / 1000)}k`, tone: "emerald" },
      ],
      learningTag: "clearance",
      adjustOptions: [
        { label: "改 85 折", learned: "您偏好較小的出清折讓幅度" },
        { label: "改綁贈品出清", learned: "您偏好以贈品而非降價方式去化庫存" },
      ],
    },
    {
      id: "e-d3", category: "選品", title: "磁吸行動電源趨勢正熱,建議測款 100 件",
      situation: "磁吸配件搜尋量兩週增 38%,競品尚未大量鋪貨,存在時間差機會。",
      suggestion: "以測款 100 件切入,估毛利 44%,兩週後依動銷率決定是否追單。",
      reasoning: "小量測款可控風險;若動銷達標再追單,符合過往選品成功模式。",
      impact: [
        { label: "趨勢分數", value: "92", tone: "brand" },
        { label: "預估毛利", value: "44%", tone: "emerald" },
        { label: "建議測款", value: "100 件", tone: "brand" },
      ],
      learningTag: "picking",
      adjustOptions: [
        { label: "改測款 50 件", learned: "您偏好更保守的測款量控風險" },
        { label: "直接追單 300 件", learned: "您偏好對高分趨勢品積極押注" },
      ],
    },
    {
      id: "e-d5", category: "補貨", title: "藍牙耳機 Air 庫存偏低,建議補貨 80 件",
      situation: "AeroPods 藍牙耳機 Air 目前庫存 15 件,近 7 日日均銷 9 件,前置期 7 天,即將跌破安全庫存。",
      suggestion: "向「深圳華越」補 80 件,可覆蓋約 9 天銷量並回補安全水位。",
      reasoning: "以日均 9 件 × 前置期 7 天 = 63 件,加安全庫存緩衝,扣現有 → 建議補 80 件。",
      impact: [
        { label: "目前庫存", value: "15 件", tone: "amber" },
        { label: "建議補貨", value: "80 件", tone: "brand" },
        { label: "可撐天數", value: "9 天", tone: "emerald" },
      ],
      learningTag: "reorder",
      adjustOptions: [
        { label: "改補 50 件", learned: "您偏好控制補貨成本、可接受短期缺貨" },
        { label: "改補 120 件", learned: "您偏好保留 15% 以上安全庫存緩衝" },
      ],
    },
    {
      id: "e-d4", category: "平台費", title: "平台費調升 0.5%,建議檢討 6 項低毛利品",
      situation: "平台成交費 8/1 起升至 6%,6 項 SKU 毛利將低於 15%。",
      suggestion: "對這 6 項調升售價 3% 或改為加購綁售,毛利低於門檻者評估下架。",
      reasoning: "維持全站毛利健康度,避免低毛利品稀釋整體獲利。",
      impact: [
        { label: "受影響品項", value: "6 項", tone: "amber" },
        { label: "毛利門檻", value: "15%", tone: "slate" },
        { label: "建議調價", value: "+3%", tone: "brand" },
      ],
      learningTag: "pricing_raise",
    },
    {
      id: "e-d6", category: "物流", title: "某物流商延誤率升至 7%,建議部分轉單",
      situation: "近 2 週 A 物流商配送延誤率由 3% 升至 7%,集中在中南部;A 物流佔出貨量 60%。",
      suggestion: "將中南部訂單改由 B 物流商配送(延誤率 2%),北部維持 A 物流以控成本。",
      reasoning: "分區指派可將整體延誤率壓回 3% 以下,運費僅增加約 1.5%,客訴風險大幅下降。",
      impact: [
        { label: "延誤率", value: "7%", tone: "rose" },
        { label: "轉單區域", value: "中南部", tone: "brand" },
        { label: "運費影響", value: "+1.5%", tone: "amber" },
      ],
      learningTag: "logistics",
    },
    {
      id: "e-d7", category: "廣告", title: "耳機廣告組 ROAS 低於門檻,建議關閉止血",
      situation: "AeroPods 廣告組近 7 日 ROAS 為 1.4(門檻 2.0),已投入 3.2 萬、轉換衰退。",
      suggestion: "暫停此廣告組,將預算移轉至 ROAS 3.8 的行動電源廣告組。",
      reasoning: "低於門檻的廣告持續投放將侵蝕毛利;預算轉移至高效組別可提升整體 ROAS。",
      impact: [
        { label: "目前 ROAS", value: "1.4", tone: "rose" },
        { label: "門檻", value: "2.0", tone: "slate" },
        { label: "移轉後 ROAS", value: "3.8", tone: "emerald" },
      ],
      learningTag: "ads",
    },
  ];

  const tasks: IndustryData["tasks"] = [
    { id: "e-t1", title: "揀貨 SO-2607-3103", detail: "3 件商品待揀", ownerId: "e-e2", kind: "stage", done: false, refId: "e-wo-2" },
    { id: "e-t2", title: "包裝 SO-2607-3105", detail: "包裝後轉出貨", ownerId: "e-e2", kind: "stage", done: false, refId: "e-wo-4" },
    { id: "e-t3", title: "盤點 行動電源類", detail: "熱銷品優先實盤", ownerId: "e-e2", kind: "stocktake", done: false },
    { id: "e-t4", title: "回覆客服 3 則", detail: "到貨與退換貨詢問", ownerId: "e-e4", kind: "stage", done: true },
  ];

  return {
    employees, customers, workOrders, skus, quotes, conversations,
    candidates, radar,
    decisions: decisions.map((d, i) => materialize(d, "ecom", i)),
    learningLog: [], tasks, revenueToday: 386_400,
  };
}
