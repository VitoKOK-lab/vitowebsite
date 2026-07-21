import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { completeTask } from "@/modules/dashboard/service";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { industry } = getSession();
  const ok = completeTask(industry, params.id);
  return NextResponse.json({ ok });
}
