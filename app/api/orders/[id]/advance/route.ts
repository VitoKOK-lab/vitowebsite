import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { advanceStage } from "@/modules/orders/service";
import { ROLES } from "@/lib/types";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { industry, role } = getSession();
  const body = await req.json().catch(() => ({}));
  const by = ROLES.find((r) => r.key === role)?.label ?? "現場人員";
  const result = advanceStage(industry, params.id, by, !!body.withPhoto);
  return NextResponse.json(result);
}
