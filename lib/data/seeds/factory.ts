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

  const workOrders: IndustryData["workOrders"] = Array.from({ length: 32 }).map(
    (_, i) => {
      const stage = stages[i % stages.length];
      const cust = customers[i % customers.length];
      const emp = employees[1 + (i % 4)];
      const delayed = i === 3 || i === 11 || i === 22 || i === 28;
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
    {
      id: "f-r3", title: "主力電芯供應商爆產能危機", source: "產業供應鏈快訊",
      fact: "多家車廠通報同一電芯供應商交期延誤,產業進入搶料期。",
      impact: "本廠電池模組供應受直接衝擊,恐影響 6 張在製工單。",
      suggestion: "已生成供應鏈決策卡,建議立即啟用備援供應商。",
      importance: "high", createdAt: iso(0, 7),
    },
    {
      id: "f-r4", title: "日圓兌台幣週貶 3%", source: "外匯快訊",
      fact: "日圓走弱,日系軸承、感測器進口成本下降。",
      impact: "進口零件成本短期下降,存在鎖匯機會。",
      suggestion: "已生成鎖匯決策卡,建議承作 3 個月遠期外匯。",
      importance: "mid", createdAt: iso(0, 8),
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
    {
      id: "f-d6", category: "排程", title: "下週產能吃緊,建議調整工單優先序",
      situation: "下週共 6 張工單交期集中,加工站產能估計超載 18%,其中 2 張為 A 級客戶。",
      suggestion: "將 A 級客戶(捷安、綠動能)工單優先排入,C 級客戶交期順延 2 天並主動告知。",
      reasoning: "以交期權重 × 客戶等級排序,可確保關鍵客戶準時,整體違約風險最低。",
      impact: [
        { label: "超載", value: "18%", tone: "rose" },
        { label: "優先工單", value: "2 張", tone: "brand" },
        { label: "順延", value: "2 天", tone: "amber" },
      ],
      learningTag: "schedule",
    },
    {
      id: "f-d7", category: "應收", title: "捷安車業貨款逾期 15 天,建議發對帳提醒",
      situation: "捷安車業 QT-2607-018 貨款 186 萬已逾付款期 15 天,該客戶為 A 級長期往來。",
      suggestion: "發送溫和對帳提醒(附對帳單 PDF),暫不影響後續接單,7 天後未回再由業務跟進。",
      reasoning: "A 級客戶多為作業疏漏,溫和提醒可維護關係同時控管現金流。",
      impact: [
        { label: "逾期金額", value: "186 萬", tone: "rose" },
        { label: "逾期天數", value: "15 天", tone: "amber" },
        { label: "客戶等級", value: "A 級", tone: "brand" },
      ],
      learningTag: "receivable",
    },
    {
      id: "f-d8", category: "設備", urgent: true, title: "3 號加工中心主軸異音,建議立即停機檢修",
      situation: "3 號 CNC 加工中心主軸振動值今晨升至警戒值 1.8x,伴隨異音,持續運轉恐損毀主軸(更換約 45 萬、停線 5 天)。",
      suggestion: "本班結束後立即停機,安排保養商今晚到場檢測;受影響工單改由 1、2 號機分流。",
      reasoning: "振動趨勢與 2 年前主軸損毀前徵兆吻合;預防性停機成本遠低於突發損毀 + 停線。",
      impact: [
        { label: "振動值", value: "1.8×警戒", tone: "rose" },
        { label: "突發損毀成本", value: "約 45 萬", tone: "rose" },
        { label: "預防停機", value: "1 班", tone: "emerald" },
      ],
      learningTag: "equipment",
      adjustOptions: [
        { label: "撐到週末再修", learned: "您偏好以產能為優先、接受一定設備風險" },
        { label: "立即停機", learned: "您偏好預防性維護、優先保護關鍵設備" },
      ],
    },
    {
      id: "f-d9", category: "供應", urgent: true, title: "主力電芯供應商產能異常,建議啟用備援",
      situation: "宏達電能來函通知因原料短缺,未來 3 週交貨量砍半;本廠電池模組安全庫存僅撐 9 天。",
      suggestion: "立即向備援供應商『台達儲能』下 2 週用量急單(單價高 8%),並凍結非急件工單用料。",
      reasoning: "斷料將導致 6 張在製工單停線;備援雖貴但可維持交期,總損失最低。",
      impact: [
        { label: "現有庫存", value: "撐 9 天", tone: "rose" },
        { label: "備援溢價", value: "+8%", tone: "amber" },
        { label: "可保工單", value: "6 張", tone: "emerald" },
      ],
      learningTag: "supply",
      adjustOptions: [
        { label: "先觀望一週", learned: "您偏好先確認缺口再備援、控制成本" },
        { label: "立即雙軌備援", learned: "您偏好供應鏈斷點一律立即啟用備援" },
      ],
    },
    {
      id: "f-d10", category: "大單", title: "捷安車業急單 200 台,交期壓縮,建議加班+外包",
      situation: "捷安車業臨時追加 200 台都會通勤款,要求 3 週內交貨,現有產能僅能吃下 130 台。",
      suggestion: "接單:130 台自製 + 70 台委外組裝(毛利略降但守住客戶),並安排週六加班。",
      reasoning: "此為 A 級客戶年度最大單;委外雖降毛利 4%,但維繫關係與現金流價值更高。",
      impact: [
        { label: "訂單金額", value: "約 380 萬", tone: "emerald" },
        { label: "產能缺口", value: "70 台", tone: "amber" },
        { label: "毛利影響", value: "-4%", tone: "slate" },
      ],
      learningTag: "bigorder",
      adjustOptions: [
        { label: "只接 130 台", learned: "您偏好守住毛利、不勉強吃下超量訂單" },
        { label: "全接並外包", learned: "您偏好積極接大單、以委外補產能" },
      ],
    },
    {
      id: "f-d11", category: "召回", urgent: true, title: "某批控制器韌體異常,建議主動召回 30 台",
      situation: "品管發現 6 月出貨的一批控制器(30 台)在低溫下可能誤觸限速,雖無事故但有安全疑慮。",
      suggestion: "主動聯繫車主召回更新韌體(每台成本約 800 元),並發布安心聲明降低商譽衝擊。",
      reasoning: "主動召回成本 2.4 萬,遠低於事故發生後的賠償與品牌損失;過往主動處理獲正面評價。",
      impact: [
        { label: "涉及台數", value: "30 台", tone: "rose" },
        { label: "召回成本", value: "約 2.4 萬", tone: "amber" },
        { label: "商譽風險", value: "大幅降低", tone: "emerald" },
      ],
      learningTag: "recall",
    },
    {
      id: "f-d12", category: "資安", urgent: true, title: "員工帳號異常大量查詢客戶名單,建議立即凍結",
      situation: "audit_log 偵測到員工帳號『張偉誠』於昨晚 22:40 起 20 分鐘內查詢 180 筆客戶聯絡資料,遠超日常。",
      suggestion: "立即凍結該帳號查詢權限並要求說明;同時檢視是否有匯出行為,必要時通報。",
      reasoning: "異常查詢量為平日 15 倍,符合資料外洩前兆;先凍結再釐清可將風險降到最低。",
      impact: [
        { label: "異常查詢", value: "180 筆", tone: "rose" },
        { label: "為平日", value: "15 倍", tone: "rose" },
        { label: "建議動作", value: "立即凍結", tone: "amber" },
      ],
      learningTag: "security",
      adjustOptions: [
        { label: "先私下詢問", learned: "您偏好先了解狀況再處置、避免誤傷員工" },
        { label: "立即凍結+通報", learned: "您偏好資安事件一律先凍結、從嚴處理" },
      ],
    },
    {
      id: "f-d13", category: "匯率", title: "日圓走貶,建議鎖匯進口零件成本",
      situation: "日圓兌台幣近一週貶值 3%,本廠日本進口軸承、感測器成本下降;預期短期反彈。",
      suggestion: "趁低點與銀行承作 3 個月遠期外匯,鎖定 Q3 進口零件採購匯率。",
      reasoning: "鎖匯可固定成本、避免反彈侵蝕毛利;過往鎖匯決策平均省下 1.5% 進口成本。",
      impact: [
        { label: "日圓貶", value: "-3%", tone: "emerald" },
        { label: "可鎖成本", value: "Q3 進口", tone: "brand" },
        { label: "預估省", value: "約 1.5%", tone: "emerald" },
      ],
      learningTag: "fx",
    },
    {
      id: "f-d14", category: "缺工", title: "品檢組明日 2 人請假,建議調度支援",
      situation: "品檢組王美惠、另一員工明日同時請假,僅剩 1 人,明日有 4 張工單待品檢恐塞車。",
      suggestion: "調度組裝組張偉誠上午支援品檢(具檢驗證照),並將 1 張非急件品檢順延半天。",
      reasoning: "跨組支援可維持品檢節奏、避免出貨延遲;過往調度未影響組裝進度。",
      impact: [
        { label: "品檢人力", value: "剩 1 人", tone: "rose" },
        { label: "待品檢", value: "4 張", tone: "amber" },
        { label: "調度後", value: "可消化", tone: "emerald" },
      ],
      learningTag: "staffing",
    },
    {
      id: "f-d15", category: "客訴", urgent: true, title: "全速電動車行反映煞車異常,建議工程師到場",
      situation: "全速電動車行今早來電,反映近期交付的 3 台車煞車手感異常,情緒不佳、暗示要退貨。",
      suggestion: "今日派工程師到場檢測(免費),若確為出廠問題立即更換;主管李淑芬同行安撫。",
      reasoning: "煞車屬安全件、客戶情緒升高,快速到場處理可避免退貨與負評擴散。",
      impact: [
        { label: "涉及車輛", value: "3 台", tone: "rose" },
        { label: "客訴情緒", value: "偏高", tone: "rose" },
        { label: "到場處理", value: "今日", tone: "emerald" },
      ],
      learningTag: "complaint",
    },
    {
      id: "f-d16", category: "環安", title: "噴塗廢氣處理設備檢測到期,建議排定申報",
      situation: "噴塗線廢氣處理設備的定檢與排放申報將於 14 天後到期,逾期恐遭環保裁罰。",
      suggestion: "本週預約合格檢測機構到廠檢測,並準備排放數據於期限前完成申報。",
      reasoning: "提前申報可避免裁罰與停工風險;檢測需預約、宜提早安排。",
      impact: [
        { label: "距到期", value: "14 天", tone: "amber" },
        { label: "逾期風險", value: "裁罰/停工", tone: "rose" },
        { label: "建議", value: "本週預約", tone: "brand" },
      ],
      learningTag: "compliance",
    },
    {
      id: "f-d17", category: "現金流", title: "本月應付集中,建議調整付款排程",
      situation: "本月下旬有 3 筆供應商貨款(合計 420 萬)集中到期,與薪資發放同週,現金水位偏緊。",
      suggestion: "與 2 家長期供應商協商延後 7 天付款(關係良好、過往可行),平滑現金流。",
      reasoning: "協商展延無利息成本、不影響信用;可避免動用高成本短期融資。",
      impact: [
        { label: "集中應付", value: "420 萬", tone: "rose" },
        { label: "可協商展延", value: "2 筆", tone: "emerald" },
        { label: "融資成本", value: "省下", tone: "emerald" },
      ],
      learningTag: "cashflow",
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
