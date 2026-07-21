import type { AIProvider, CsAnswerContext, LearningNote } from "./provider";

// 情境化罐頭 AI:對自由輸入也優雅回應(demo 不追求真答對,只要體驗好)

const NEG_WORDS = ["爛", "退貨", "不滿", "客訴", "投訴", "生氣", "退錢", "壞", "瑕疵", "沒收到", "很慢"];

function detectNegative(q: string): boolean {
  return NEG_WORDS.some((w) => q.includes(w));
}

export const mockProvider: AIProvider = {
  answerCs(ctx: CsAnswerContext) {
    const q = ctx.question.trim();
    const escalate = detectNegative(q);

    if (escalate) {
      return {
        text: `很抱歉造成您的困擾 🙏 這個問題我已為您標記並轉接專員處理,對方會盡快與您聯繫。也謝謝您讓我們知道。`,
        escalate: true,
      };
    }

    // 交期/到貨查詢
    if (/(到貨|交期|什麼時候|到哪|進度|出貨|寄|送到)/.test(q)) {
      const o = ctx.ownOrders[0];
      if (o) {
        return {
          text: `${ctx.customerName}您好!您的訂單 ${o.orderNo} 目前在「${o.stage}」站,預計 ${o.due} 完成。有其他需要協助的嗎?😊`,
          escalate: false,
        };
      }
      return {
        text: `${ctx.customerName}您好!目前查詢不到您名下的進行中訂單,若有訂單編號可以提供給我,我馬上為您查詢 🙌`,
        escalate: false,
      };
    }

    // 報價/價格
    if (/(報價|價格|多少錢|折扣|優惠)/.test(q)) {
      return {
        text: `關於報價,我可以先為您試算。方便告訴我品項與數量嗎?我會在幾秒內給您成本與建議售價,並可一鍵寄出正式報價單 📄`,
        escalate: false,
      };
    }

    // 其他:優雅回應 + 回聲
    return {
      text: `了解,關於「${q}」我幫您記錄下來了。這是為 ${ctx.customerName} 準備的服務,我可以協助查詢訂單進度、報價與常見問題,請問想從哪個開始呢?`,
      escalate: false,
    };
  },

  applyLearning(baseSuggestion: string, notes: LearningNote[], tag?: string) {
    const relevant = notes.filter((n) => !tag || n.tag === tag);
    if (relevant.length === 0) return baseSuggestion;
    const latest = relevant[relevant.length - 1];
    return `${baseSuggestion}\n\n（已依您先前的偏好調整:${latest.text}）`;
  },
};
