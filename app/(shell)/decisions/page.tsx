import { getSession } from "@/lib/auth/session";
import { ROLES } from "@/lib/types";
import {
  listDecisions,
  pendingCount,
  doneCount,
} from "@/modules/decisions/service";
import { buildDailyPush } from "@/lib/line/mock";
import { DecisionsHero } from "@/modules/decisions/components/DecisionsHero";
import { DecisionList } from "@/modules/decisions/components/DecisionList";
import { LinePreview } from "@/lib/ui/line-preview";
import { SectionTitle } from "@/lib/ui/card";

export const dynamic = "force-dynamic";

export default function DecisionsPage() {
  const { role, industry } = getSession();
  const roleLabel = ROLES.find((r) => r.key === role)?.label ?? "老闆";
  const decisions = listDecisions(industry);
  const pending = pendingCount(industry);
  const done = doneCount(industry);
  const daily = buildDailyPush(industry);

  return (
    <div className="space-y-4">
      <DecisionsHero done={done} pending={pending} roleLabel={roleLabel} />
      <LinePreview daily={daily} />
      <div className="pt-1">
        <SectionTitle className="mb-2">
          待決策佇列{pending > 0 && ` · ${pending}`}
        </SectionTitle>
        <DecisionList decisions={decisions} />
      </div>
    </div>
  );
}
