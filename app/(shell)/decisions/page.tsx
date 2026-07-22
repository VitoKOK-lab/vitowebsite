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
  const daily = buildDailyPush(industry, { pending, done });

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2">
          <DecisionsHero done={done} pending={pending} roleLabel={roleLabel} />
        </div>
        <LinePreview daily={daily} />
      </div>
      <div className="pt-1">
        <SectionTitle className="mb-2">
          待決策佇列{pending > 0 && ` · ${pending}`}
        </SectionTitle>
        <DecisionList decisions={decisions} />
      </div>
    </div>
  );
}
