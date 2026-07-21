import type { IndustryKey, Role } from "@/lib/types";
import type { CsConversation } from "@/lib/data/models";
import { db } from "@/lib/data/store";
import { getAIProvider } from "@/lib/ai/provider";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { currentCustomerId } from "@/modules/orders/service";
import { stageLabel } from "@/modules/orders/service";
import { formatDate } from "@/lib/utils";

export function listConversations(
  industry: IndustryKey,
  role: Role
): CsConversation[] {
  const all = db(industry).conversations;
  if (role === "customer") {
    const cid = currentCustomerId(industry);
    return all.filter((c) => c.customerId === cid);
  }
  return all;
}

export function customerConversation(industry: IndustryKey): CsConversation | undefined {
  const cid = currentCustomerId(industry);
  return db(industry).conversations.find((c) => c.customerId === cid);
}

/** 客戶提問 → AI 回覆(範圍限自己的訂單) */
export function answerCustomer(
  industry: IndustryKey,
  customerId: string,
  question: string
): { text: string; escalate: boolean } {
  const provider = getAIProvider();
  const cfg = getIndustryConfig(industry);
  const data = db(industry);
  const customer = data.customers.find((c) => c.id === customerId);
  const ownOrders = data.workOrders
    .filter((o) => o.customerId === customerId)
    .map((o) => ({
      orderNo: o.orderNo,
      stage: stageLabel(industry, o.currentStage),
      due: formatDate(o.dueDate),
    }));

  return provider.answerCs({
    question,
    customerName: customer?.name ?? cfg.terms.customer,
    industry,
    ownOrders,
  });
}
