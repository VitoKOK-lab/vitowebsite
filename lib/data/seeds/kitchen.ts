import type { IndustryData, Sku } from "../models";
import { iso, pad, materialize, type AiDecisionSeed } from "./helpers";

export function buildKitchen(): IndustryData {
  const employees: IndustryData["employees"] = [
    { id: "k-e1", name: "周淑惠", role: "manager", dept: "廚務管理", closed: 88, winRate: 0, onTime: 95 },
    { id: "k-e2", name: "許志豪", role: "staff", dept: "採購驗收", closed: 130, winRate: 0, onTime: 92 },
    { id: "k-e3", name: "楊美玲", role: "staff", dept: "備料組", closed: 156, winRate: 0, onTime: 96 },
    { id: "k-e4", name: "郭建宏", role: "staff", dept: "配送", closed: 110, winRate: 0, onTime: 90 },
  ];

  const customers: IndustryData["customers"] = [
    { id: "k-c1", name: "信義門市", phone: "02-2720-1111" },
    { id: "k-c2", name: "板橋門市", phone: "02-2960-2222" },
    { id: "k-c3", name: "內湖門市", phone: "02-2790-3333" },
    { id: "k-c4", name: "新莊門市", phone: "02-2990-4444" },
  ];

  const ingredients = [
    ["雞胸肉", "肉類", 95, "日", 3, "永昌肉品"],
    ["豬五花", "肉類", 160, "日", 4, "永昌肉品"],
    ["高麗菜", "蔬菜", 28, "日", 5, "誠信蔬果"],
    ["紅蘿蔔", "蔬菜", 22, "日", 12, "誠信蔬果"],
    ["洋蔥", "蔬菜", 25, "日", 20, "誠信蔬果"],
    ["雞蛋", "蛋品", 4, "日", 10, "禾豐蛋行"],
    ["白飯(米)", "主食", 42, "月", 60, "泰美米業"],
    ["醬油", "調味", 68, "月", 180, "老順興"],
    ["沙拉油", "調味", 55, "月", 120, "油世家"],
    ["鮭魚排", "海鮮", 320, "日", 2, "海鮮直送"],
    ["蝦仁", "海鮮", 280, "日", 3, "海鮮直送"],
    ["豆腐", "豆製", 18, "日", 2, "傳統豆坊"],
    ["青花菜", "蔬菜", 45, "日", 4, "誠信蔬果"],
    ["馬鈴薯", "蔬菜", 20, "日", 25, "誠信蔬果"],
    ["起司片", "乳製", 6, "日", 30, "乳香世家"],
  ];

  const skus: Sku[] = Array.from({ length: 30 }).map((_, i) => {
    const base = ingredients[i % ingredients.length];
    const perishable = base[3] === "日";
    const onHand = [2, 8, 40, 120, 5, 60, 200, 15][i % 8] + (i % 4) * 3;
    const safety = perishable ? 10 + (i % 3) * 5 : 30;
    const expiryDays = perishable ? [1, 2, 3, 5, 7][i % 5] : 45 + (i % 60);
    return {
      id: `k-sku-${i}`,
      sku: `IG-${pad(4001 + i, 4)}`,
      name: i < 15 ? (base[0] as string) : `${base[0]}(${["A", "B"][i % 2]}級)`,
      category: base[1] as string,
      cost: base[2] as number,
      price: (base[2] as number) * 1.3,
      onHand,
      safetyStock: safety,
      avgDailyUse: perishable ? 5 + (i % 8) : 2 + (i % 3),
      leadTimeDays: (base[4] as number) > 30 ? 3 : 1,
      supplierName: base[5] as string,
      expiryDate: iso(expiryDays, 23),
      trend: onHand < safety ? "hot" : "normal",
    };
  });

  const stages = ["purchase", "receiving", "prep", "delivery"];
  const workOrders: IndustryData["workOrders"] = Array.from({ length: 16 }).map(
    (_, i) => {
      const stage = stages[i % stages.length];
      const cust = customers[i % customers.length];
      const emp = employees[1 + (i % 3)];
      const delayed = i === 6;
      const done = stage === "delivery" && i % 2 === 0;
      const qty = 30 + (i % 5) * 20;
      return {
        id: `k-wo-${i}`,
        orderNo: `PO-2607-${pad(500 + i)}`,
        customerId: cust.id,
        customerName: cust.name,
        itemsSummary: `${cust.name} 午餐備料(${qty} 份)`,
        qty,
        currentStage: stage,
        dueDate: iso(delayed ? 0 : (i % 2) + 1, 6),
        amount: qty * 85,
        cost: qty * 62,
        ownerId: emp.id,
        ownerName: emp.name,
        delayed,
        done,
        events: [{ stageKey: "purchase", by: emp.name, at: iso(-1, 5) }],
      };
    }
  );

  const quotes: IndustryData["quotes"] = [
    {
      id: "k-q1", quoteNo: "QT-2607-030", customerName: "新開連鎖門市",
      items: [{ name: "午餐便當備餐", spec: "每日 300 份", qty: 300 }],
      cost: 18_600, margin: 27, suggestedPrice: 25_500, status: "sent",
      sentAt: iso(0), ownerId: "k-e1", ownerName: "周淑惠",
    },
  ];

  const conversations: IndustryData["conversations"] = [
    {
      id: "k-cs1", customerId: "k-c1", customerName: "信義門市", channel: "line", status: "ai", topic: "備料交期",
      messages: [
        { from: "customer", text: "明天的備料單什麼時候會到?", at: iso(0, 15) },
        { from: "ai", text: "信義門市您好!PO-2607-500 明日午餐備料(50 份)目前在「備料」站,預計明早 6:30 前配送到店 🍱", at: iso(0, 15) },
      ],
    },
  ];

  const expSku = skus.find((s) => s.expiryDate && s.category === "海鮮") ?? skus[9];
  const lowSku = skus.find((s) => s.trend === "hot")!;

  const radar: IndustryData["radar"] = [
    {
      id: "k-r1", title: "本週蔬菜批發價因颱風上漲 18%", source: "農產運銷公司",
      fact: "颱風影響產區,高麗菜、青花菜批發價週漲 18%。",
      impact: "蔬菜類食材成本上升,便當成本每份增加約 2.5 元。",
      suggestion: "建議本週菜色改用馬鈴薯、紅蘿蔔等耐儲根莖類替換,已生成備料調整建議。",
      importance: "high", createdAt: iso(0, 7),
    },
    {
      id: "k-r2", title: "食品衛生新規:即食品效期標示加嚴", source: "衛福部",
      fact: "9 月起中央廚房即食品須標示更細效期批號。",
      impact: "需強化效期追蹤與批號管理流程。",
      suggestion: "本系統效期警示已符合新規,可作為稽核佐證。",
      importance: "mid", createdAt: iso(-2, 8),
    },
  ];

  const decisions: AiDecisionSeed[] = [
    {
      id: "k-d1", category: "效期警示", title: `${expSku.name} 明日到期,建議今日優先使用`,
      situation: `${expSku.name}(${expSku.sku})庫存 ${expSku.onHand} kg,效期至明日,再不使用將報廢。`,
      suggestion: "今日午餐菜單優先排入該食材,並通知信義、板橋門市可加推相關餐點。",
      reasoning: "海鮮類報廢成本高;優先消化可避免整批損失並維持食安。",
      impact: [
        { label: "即期庫存", value: `${expSku.onHand} kg`, tone: "rose" },
        { label: "距到期", value: "1 天", tone: "amber" },
        { label: "可避免報廢", value: `約 ${Math.round(expSku.cost * expSku.onHand / 100) / 10}k`, tone: "emerald" },
      ],
      learningTag: "expiry",
      adjustOptions: [
        { label: "改做員工餐消化", learned: "您偏好即期品優先內部消化而非推銷" },
        { label: "折價供應門市", learned: "您偏好以折價方式快速去化即期品" },
      ],
    },
    {
      id: "k-d2", category: "備料不足", title: `${lowSku.name} 低於安全庫存,建議今日追加採購`,
      situation: `${lowSku.name} 現有 ${lowSku.onHand} 單位,安全庫存 ${lowSku.safetyStock},明日備料單需求超出現有量。`,
      suggestion: `向「${lowSku.supplierName}」追加採購,補足至安全庫存 + 一日用量。`,
      reasoning: "明日 4 家門市備料需求集中,不補將導致缺料停線。",
      impact: [
        { label: "現有", value: `${lowSku.onHand}`, tone: "rose" },
        { label: "安全庫存", value: `${lowSku.safetyStock}`, tone: "slate" },
        { label: "影響門市", value: "4 家", tone: "amber" },
      ],
      learningTag: "reorder",
      adjustOptions: [
        { label: "只補到安全庫存", learned: "您偏好精簡採購、降低即期報廢風險" },
        { label: "多補一日緩衝", learned: "您偏好多留一日備料緩衝" },
      ],
    },
    {
      id: "k-d5", category: "備料不足", title: "雞胸肉低於安全庫存,建議今日追加採購 60 kg",
      situation: "雞胸肉現有 8 kg,安全庫存 15 kg,近 8 週平均日用量 8 kg,前置期 1 天,明日備料需求集中。",
      suggestion: "向「永昌肉品」追加採購 60 kg,補足至安全庫存 + 一日用量。",
      reasoning: "以日均 8 kg × 前置期 + 安全庫存,扣現有 8 kg → 建議補 60 kg,確保明日不缺料。",
      impact: [
        { label: "現有", value: "8 kg", tone: "rose" },
        { label: "安全庫存", value: "15 kg", tone: "slate" },
        { label: "建議採購", value: "60 kg", tone: "brand" },
      ],
      learningTag: "reorder",
      adjustOptions: [
        { label: "只補到安全庫存", learned: "您偏好精簡採購、降低即期報廢風險" },
        { label: "多補一日緩衝", learned: "您偏好多留一日備料緩衝" },
      ],
    },
    {
      id: "k-d3", category: "成本", title: "蔬菜漲價 18%,建議本週替換耐儲菜色",
      situation: "颱風致高麗菜、青花菜批發價週漲 18%,便當成本每份 +2.5 元。",
      suggestion: "本週三道菜改用馬鈴薯、紅蘿蔔替換,維持成本並確保供應穩定。",
      reasoning: "根莖類價穩、耐儲,替換後每份成本回穩,口味影響低。",
      impact: [
        { label: "菜價漲幅", value: "+18%", tone: "rose" },
        { label: "每份增本", value: "+2.5 元", tone: "amber" },
        { label: "替換後", value: "回穩", tone: "emerald" },
      ],
      learningTag: "cost_swap",
    },
    {
      id: "k-d4", category: "耗損", title: "備料組耗損率升至 8%,建議檢討切配流程",
      situation: "本週備料耗損率由 6% 升至 8%,集中在葉菜類前處理。",
      suggestion: "調整切配順序、先處理易損葉菜,並複核採購驗收分級標準。",
      reasoning: "耗損上升多來自進料品質與處理順序;流程調整成本低、見效快。",
      impact: [
        { label: "耗損率", value: "8%", tone: "rose" },
        { label: "目標", value: "6%", tone: "slate" },
        { label: "月省成本", value: "約 4 萬", tone: "emerald" },
      ],
      learningTag: "quality",
    },
    {
      id: "k-d6", category: "排班", title: "週末備料人力不足,建議今日確認調班",
      situation: "本週六 4 家門市備料需求較平日高 40%,備料組僅排 2 人,估計人力缺口約 6 工時。",
      suggestion: "商請楊美玲、郭建宏週六支援上午班,或將部分前處理提前至週五完成。",
      reasoning: "提前備料 + 彈性支援可補足缺口,避免週六出餐延遲影響門市營業。",
      impact: [
        { label: "需求增幅", value: "+40%", tone: "amber" },
        { label: "人力缺口", value: "6 工時", tone: "rose" },
        { label: "門市", value: "4 家", tone: "brand" },
      ],
      learningTag: "schedule",
    },
    {
      id: "k-d7", category: "品質", title: "內湖門市退貨率升高,建議檢討配送溫控",
      situation: "內湖門市近一週餐點退貨率由 1% 升至 4%,反映集中在午後配送的冷藏品變質。",
      suggestion: "檢查該路線保溫箱溫度紀錄,午後配送改用加冰保溫並縮短停留時間。",
      reasoning: "退貨集中單一門市 + 時段,判斷為配送溫控問題;調整成本低、見效快。",
      impact: [
        { label: "退貨率", value: "4%", tone: "rose" },
        { label: "涉及門市", value: "內湖", tone: "amber" },
        { label: "問題時段", value: "午後", tone: "slate" },
      ],
      learningTag: "quality",
    },
  ];

  const tasks: IndustryData["tasks"] = [
    { id: "k-t1", title: "驗收 早班進貨", detail: "肉類、蔬菜驗收分級", ownerId: "k-e2", kind: "stage", done: false, refId: "k-wo-1" },
    { id: "k-t2", title: "備料 信義門市午餐", detail: "50 份備料", ownerId: "k-e3", kind: "stage", done: false, refId: "k-wo-2" },
    { id: "k-t3", title: "盤點 海鮮冷藏", detail: "即期品優先盤點", ownerId: "k-e3", kind: "stocktake", done: false },
    { id: "k-t4", title: "配送 板橋門市", detail: "早班配送", ownerId: "k-e4", kind: "stage", done: true, refId: "k-wo-3" },
  ];

  return {
    employees, customers, workOrders, skus, quotes, conversations,
    candidates: [], radar,
    decisions: decisions.map((d, i) => materialize(d, "kitchen", i)),
    learningLog: [], tasks, revenueToday: 142_800,
  };
}
