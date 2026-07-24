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
  const workOrders: IndustryData["workOrders"] = Array.from({ length: 30 }).map(
    (_, i) => {
      const stage = stages[i % stages.length];
      const cust = customers[i % customers.length];
      const emp = employees[1 + (i % 3)];
      const delayed = i === 5 || i === 17 || i === 24;
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
        delayReason: delayed
          ? ["物流商配送延誤", "熱銷品缺貨待補", "地址資訊待客戶確認"][i % 3]
          : undefined,
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
    {
      id: "e-r3", title: "主力平台首頁演算法改版", source: "電商平台公告",
      fact: "平台改版首頁推薦邏輯,賣家自然曝光普遍波動。",
      impact: "本店自然流量單日下滑 22%,轉單受影響。",
      suggestion: "已生成應對決策卡,建議短期加投站內廣告卡位。",
      importance: "high", createdAt: iso(0, 7),
    },
    {
      id: "e-r4", title: "盜刷詐團鎖定 3C 超商取貨", source: "金流風控快訊",
      fact: "近期多店通報同一手法的盜刷詐團,鎖定高單價 3C 超商取貨。",
      impact: "本店偵測到 14 筆疑似訂單,需即時攔截。",
      suggestion: "已生成風控決策卡,建議攔截人工審核。",
      importance: "high", createdAt: iso(0, 8),
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
    {
      id: "e-d8", category: "詐騙", urgent: true, title: "偵測一批可疑高額訂單,建議攔截人工審核",
      situation: "風控偵測到今晨 14 筆訂單使用同一 IP 段、不同帳號、指定超商取貨且金額異常偏高,疑似盜刷/詐團。",
      suggestion: "暫停這 14 筆出貨、轉人工審核並要求補驗;命中詐騙特徵者取消並通報金流商。",
      reasoning: "特徵與上季一起盜刷案高度相似;先攔截可避免出貨損失與後續拒付。",
      impact: [
        { label: "可疑訂單", value: "14 筆", tone: "rose" },
        { label: "潛在損失", value: "約 12 萬", tone: "rose" },
        { label: "建議", value: "攔截審核", tone: "amber" },
      ],
      learningTag: "fraud",
    },
    {
      id: "e-d9", category: "競品", urgent: true, title: "平台改版自然流量單日掉 22%,建議即時應對",
      situation: "主力平台昨日改版首頁演算法,本店自然曝光單日下滑 22%,連帶轉單量下降。",
      suggestion: "短期加投站內廣告卡位 + 更新熱銷品關鍵字與標題,兩天內觀察是否回穩。",
      reasoning: "改版初期卡位成本較低;過往類似改版 1–2 週後流量部分回流,主動應對可縮短低谷。",
      impact: [
        { label: "自然流量", value: "-22%", tone: "rose" },
        { label: "建議加投", value: "站內廣告", tone: "brand" },
        { label: "觀察期", value: "2 天", tone: "slate" },
      ],
      learningTag: "platform",
      adjustOptions: [
        { label: "先觀望不加投", learned: "您偏好先觀察平台波動再決定投放" },
        { label: "積極加投卡位", learned: "您偏好流量下滑時積極加投搶排名" },
      ],
    },
    {
      id: "e-d10", category: "補貨", urgent: true, title: "爆品斷貨連鎖影響 3 組搭售,建議緊急調整",
      situation: "磁吸行動電源斷貨,連帶 3 組以它為主的加購組合無法出貨,影響今日 20+ 筆訂單。",
      suggestion: "急單空運補貨 + 暫時將搭售主品換成替代款,並主動通知受影響買家預計到貨。",
      reasoning: "斷貨不只損失單品、還拖累組合銷售;快速替換與溝通可保住訂單與評價。",
      impact: [
        { label: "受影響訂單", value: "20+ 筆", tone: "rose" },
        { label: "連帶組合", value: "3 組", tone: "amber" },
        { label: "建議", value: "空運+替換", tone: "brand" },
      ],
      learningTag: "reorder",
    },
    {
      id: "e-d11", category: "退貨", urgent: true, title: "某藍牙耳機退貨率飆至 12%,建議下架檢查",
      situation: "AeroPods Air 近 7 日退貨率由 3% 飆升至 12%,退貨原因集中在『單耳無聲』。",
      suggestion: "暫時下架該 SKU、抽驗庫存批號,並聯繫供應商釐清是否為批次不良。",
      reasoning: "退貨集中單一原因、指向批次瑕疵;及早下架可避免負評擴散與更多退貨成本。",
      impact: [
        { label: "退貨率", value: "12%", tone: "rose" },
        { label: "主因", value: "單耳無聲", tone: "amber" },
        { label: "建議", value: "下架抽驗", tone: "brand" },
      ],
      learningTag: "quality",
    },
    {
      id: "e-d12", category: "合作", title: "3C 開箱 KOL 主動洽談,建議評估合作",
      situation: "一位 42 萬粉的 3C 開箱 YouTuber 主動洽談合作,提案為磁吸行動電源開箱 + 導購連結。",
      suggestion: "以『底薪 + 導購分潤』模式合作(先小額測試),並備妥足量庫存迎接導購流量。",
      reasoning: "分潤模式風險低、可量化 ROI;過往微網紅導購轉換優於純曝光。",
      impact: [
        { label: "KOL 粉絲", value: "42 萬", tone: "brand" },
        { label: "合作模式", value: "分潤", tone: "emerald" },
        { label: "需備貨", value: "足量", tone: "amber" },
      ],
      learningTag: "partnership",
    },
    {
      id: "e-d13", category: "促銷", title: "雙 11 前 60 天,建議啟動備貨與檔期規劃",
      situation: "距雙 11 約 60 天,依去年同期,爆品類需提前備貨、廣告預算需提前卡位。",
      suggestion: "依 AI 銷量預測產出備貨清單(TOP20),並預留檔期廣告預算與贈品組合。",
      reasoning: "提前備貨可避免旺季斷貨與空運高成本;過往提前規劃檔期 GMV 顯著較高。",
      impact: [
        { label: "距檔期", value: "60 天", tone: "slate" },
        { label: "備貨清單", value: "TOP20", tone: "brand" },
        { label: "預期 GMV", value: "顯著提升", tone: "emerald" },
      ],
      learningTag: "promo",
    },
    {
      id: "e-d14", category: "金流", title: "某支付通道費率調漲 0.3%,建議引導改用他道",
      situation: "A 金流通道 9 月起手續費由 2.5% 調升至 2.8%,該通道佔本店收款約 45%。",
      suggestion: "結帳頁優先推薦低費率通道(給小額回饋誘因),預估可將高費率佔比降至 25%。",
      reasoning: "以誘因引導支付方式可壓低整體金流成本,回饋成本低於費率差。",
      impact: [
        { label: "費率調漲", value: "+0.3%", tone: "amber" },
        { label: "高費率佔比", value: "45%→25%", tone: "emerald" },
        { label: "淨省", value: "約 0.15%", tone: "emerald" },
      ],
      learningTag: "payment",
    },
    {
      id: "e-d15", category: "稽核", urgent: true, title: "遭檢舉仿冒,建議即時提供授權證明",
      situation: "平台通知本店某充電線商品被同業檢舉『疑似仿冒』,若 48 小時未回應恐遭下架與扣分。",
      suggestion: "立即上傳品牌授權書與進貨憑證申覆,並暫時隱藏該商品避免爭議擴大。",
      reasoning: "本店持有正式授權,及時申覆可解除下架風險;逾期不理將自動扣分影響全店權重。",
      impact: [
        { label: "回應期限", value: "48 小時", tone: "rose" },
        { label: "逾期後果", value: "下架扣分", tone: "rose" },
        { label: "本店", value: "有授權", tone: "emerald" },
      ],
      learningTag: "compliance",
    },
    {
      id: "e-d16", category: "現金流", title: "平台結款週期拉長,建議調整備貨節奏",
      situation: "平台將結款週期由 7 天延長至 14 天,旺季備貨壓力下現金週轉趨緊。",
      suggestion: "對高週轉爆品維持備貨,對慢動銷品改小批多次進貨,平滑現金流。",
      reasoning: "結款延後等同占用營運資金;依動銷分級備貨可兼顧不缺貨與現金安全。",
      impact: [
        { label: "結款週期", value: "7→14 天", tone: "amber" },
        { label: "策略", value: "分級備貨", tone: "brand" },
        { label: "現金安全", value: "提升", tone: "emerald" },
      ],
      learningTag: "cashflow",
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
