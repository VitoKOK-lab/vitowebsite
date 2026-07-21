import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { answerCustomer } from "@/modules/cs/service";
import { currentCustomerId } from "@/modules/orders/service";

export async function POST(req: Request) {
  const { industry } = getSession();
  const body = await req.json().catch(() => ({}));
  const question = String(body.question ?? "").slice(0, 500);
  if (!question.trim()) {
    return NextResponse.json({ text: "請輸入訊息", escalate: false });
  }
  const cid = currentCustomerId(industry);
  const res = answerCustomer(industry, cid, question);
  return NextResponse.json(res);
}
