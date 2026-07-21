import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { actOnDecision, type DecisionAction } from "@/modules/decisions/service";
import { ROLES } from "@/lib/types";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { industry, role } = getSession();
  const body = await req.json().catch(() => ({}));
  const action = body.action as DecisionAction;
  if (!["adopt", "adjust", "reject"].includes(action)) {
    return NextResponse.json({ ok: false, error: "bad action" }, { status: 400 });
  }
  const decidedBy = ROLES.find((r) => r.key === role)?.label ?? "老闆";
  const result = actOnDecision(industry, params.id, action, {
    optionLabel: body.optionLabel,
    freeText: body.freeText,
    decidedBy,
  });
  return NextResponse.json(result);
}
