import { getSession } from "@/lib/auth/session";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { listOrders } from "@/modules/orders/service";
import { OrderCard } from "@/modules/orders/components/OrderCard";
import { SectionTitle } from "@/lib/ui/card";
import { PackageSearch } from "lucide-react";

export const dynamic = "force-dynamic";

export default function OrdersPage() {
  const { role, industry } = getSession();
  const cfg = getIndustryConfig(industry);
  const orders = listOrders(industry, role);
  const active = orders.filter((o) => !o.done);
  const doneList = orders.filter((o) => o.done);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[13px] font-medium text-slate-400">{cfg.displayName}</p>
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <PackageSearch className="h-5 w-5 text-brand-500" />
          {cfg.terms.orderNoun}
        </h1>
      </div>

      {orders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">
          目前沒有{cfg.terms.order}
        </div>
      )}

      {active.length > 0 && (
        <div className="space-y-3">
          <SectionTitle>進行中 · {active.length}</SectionTitle>
          {active.map((o) => (
            <OrderCard key={o.id} order={o} cfg={cfg} role={role} />
          ))}
        </div>
      )}

      {doneList.length > 0 && (
        <div className="space-y-3 pt-1">
          <SectionTitle>已完成 · {doneList.length}</SectionTitle>
          {doneList.map((o) => (
            <OrderCard key={o.id} order={o} cfg={cfg} role={role} />
          ))}
        </div>
      )}
    </div>
  );
}
