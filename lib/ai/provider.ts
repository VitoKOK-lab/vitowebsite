import type { IndustryKey } from "@/lib/types";

export interface CsAnswerContext {
  question: string;
  customerName: string;
  industry: IndustryKey;
  // 該客戶自己的訂單摘要(RLS 範圍內)
  ownOrders: { orderNo: string; stage: string; due: string }[];
}

export interface LearningNote {
  tag: string;
  text: string;
}

export interface AIProvider {
  /** AI 客服回覆(範圍限該客戶自己的資料) */
  answerCs(ctx: CsAnswerContext): { text: string; escalate: boolean };
}

// provider 選擇(未來 AI_PROVIDER=claude 時換 claude-provider)
import { mockProvider } from "./mock-provider";

export function getAIProvider(): AIProvider {
  return mockProvider;
}
