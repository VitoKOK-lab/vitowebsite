/** Public-site estimates and a transparent, browser-local service matcher. */
export const servicePlans = {
  content: {
    label: '雲端 AI 小編', headline: '讓品牌每天有內容，團隊不用每天趕稿。',
    description: '把品牌語氣、產品資料與檔期交給 AI，從選題、文案、配圖到排程，一條流程接起來。',
    deliverables: ['品牌語氣與內容方向', '社群貼文、配圖與短影音腳本', '內容日曆與審核排程流程'],
    first: '先做一週內容，確認品牌語氣',
    input: '品牌介紹、產品資料、現有社群帳號',
  },
  video: {
    label: '自動剪輯師', headline: '一份素材，剪出不同平台的生意。',
    description: '從長片找重點，整理腳本、字幕、配音與版型，把拍好的素材變成可以持續使用的內容。',
    deliverables: ['短影音剪輯與字幕', '直式、橫式與多版本輸出', '可重複使用的品牌影片模板'],
    first: '先完成一支短片，確認節奏與風格',
    input: '原始影片、參考風格、預計投放平台',
  },
  operations: {
    label: 'AI 營運助理', headline: '少追進度，少做報表，多一點時間做決定。',
    description: '把訂單、庫存與日常報表整理在一起，讓 AI 先找異常、排優先順序，重要的決定再交給你。',
    deliverables: ['一條優先工作流程自動化', '老闆看得懂的營運看板', '操作教學與人工確認機制'],
    first: '先接通一條最耗時的流程',
    input: '現行流程、去識別化資料範例、使用中的工具',
  },
  sales: {
    label: 'AI 業務與客服', headline: '每個詢問都有回應，每個機會有人跟進。',
    description: '整理產品知識、常見問答與客戶需求，協助回覆、報價與跟進，遇到例外再交給真人。',
    deliverables: ['產品與客服知識庫', '詢問分類、回覆草稿與跟進提醒', '真人接手與回覆審核流程'],
    first: '先處理最常見的十個客戶問題',
    input: '產品清單、常見問答、現有銷售流程',
  },
  business: {
    label: 'AI 商業模式', headline: '把你的專業，做成能持續銷售的產品。',
    description: '從客戶願意付錢的問題出發，把專業、內容或服務，做成能驗證市場的網站、工具與數位產品。',
    deliverables: ['客群、產品定位與收費假設', '可操作的產品首版或銷售頁', '市場驗證與下一步實驗清單'],
    first: '先做出能向客戶展示的首版',
    input: '目標客群、你的專業、想解決的問題',
  },
  partner: {
    label: 'AI 代理合作', headline: '你有客戶，我們一起把 AI 服務交付出去。',
    description: '適合顧問、行銷公司與產業服務商。從共同提案、技術交付到品牌協作，談清楚再開始。',
    deliverables: ['可銷售的服務與交付範圍', '共同提案與示範素材', '交付、維護與合作分工'],
    first: '先用一個客戶需求驗證合作方式',
    input: '服務客群、現有通路、預計合作方式',
  },
} as const;
export type ServiceKey = keyof typeof servicePlans;
export const industries = ['品牌／電商', '餐飲／零售', '製造／貿易', '顧問／專業服務', '其他產業'] as const;

export function estimateCapacity(hoursPerWeek: number, hourlyCost: number, reductionPercent: number) {
  const hours = Math.max(0, Number.isFinite(hoursPerWeek) ? hoursPerWeek : 0);
  const cost = Math.max(0, Number.isFinite(hourlyCost) ? hourlyCost : 0);
  const reduction = Math.min(100, Math.max(0, Number.isFinite(reductionPercent) ? reductionPercent : 0));
  const savedHours = hours * 4 * reduction / 100;
  return { savedHours, capacityValue: Math.round(savedHours * cost), remainingHours: hours * 4 - savedHours };
}
export function buildBrief(industry: string, service: ServiceKey, details: string) {
  const plan = servicePlans[service];
  return ['LUXKEY AI 合作需求', `產業：${industry}`, `想先做：${plan.label}`, `目前的需求：${details.trim() || '希望先聊聊適合的做法'}`, `建議第一步：${plan.first}`, `可先準備：${plan.input}`].join('\n');
}
