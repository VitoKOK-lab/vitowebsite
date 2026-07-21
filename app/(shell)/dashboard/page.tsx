import { getSession } from "@/lib/auth/session";
import { SectionTitle } from "@/lib/ui/card";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { role } = getSession();
  return (
    <div className="space-y-4">
      <SectionTitle>{role === "staff" ? "今日任務" : "儀表板"}</SectionTitle>
      <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
        建置中…
      </div>
    </div>
  );
}
