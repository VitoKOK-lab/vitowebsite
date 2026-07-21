import { getSession } from "@/lib/auth/session";
import { ROLES } from "@/lib/types";
import { getIndustryConfig } from "@/lib/industry/adapter";
import {
  ownerMetrics,
  leaderboard,
  alerts,
  tasksFor,
} from "@/modules/dashboard/service";
import { growthStats } from "@/modules/decisions/service";
import { OwnerDashboard } from "@/modules/dashboard/components/OwnerDashboard";
import { StaffTasks } from "@/modules/dashboard/components/StaffTasks";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { role, industry } = getSession();
  const cfg = getIndustryConfig(industry);
  const roleLabel = ROLES.find((r) => r.key === role)?.label ?? "老闆";

  // 員工 / 客戶 → 今日任務清單
  if (role === "staff" || role === "customer") {
    return <StaffTasks tasks={tasksFor(industry)} name={roleLabel} />;
  }

  // 老闆 / 主管 → 營運總覽
  const metrics = ownerMetrics(industry);
  const leaders = leaderboard(industry);
  const alertRows = alerts(industry);
  const growth = growthStats(industry);

  return (
    <OwnerDashboard
      metrics={metrics}
      leaders={leaders}
      alertRows={alertRows}
      growth={growth}
      industryName={cfg.displayName}
      roleLabel={roleLabel}
    />
  );
}
