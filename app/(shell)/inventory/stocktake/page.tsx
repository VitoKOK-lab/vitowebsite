import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { listSkus } from "@/modules/inventory/service";
import { Stocktake, type StockItem } from "@/modules/inventory/components/Stocktake";

export const dynamic = "force-dynamic";

export default function StocktakePage() {
  const { industry } = getSession();
  const cfg = getIndustryConfig(industry);
  const items: StockItem[] = listSkus(industry).map((s) => ({
    id: s.id,
    sku: s.sku,
    name: s.name,
    category: s.category,
    onHand: s.onHand,
    perishable: !!s.expiryDate,
  }));

  return (
    <div className="space-y-4">
      <Link
        href="/inventory"
        className="inline-flex items-center gap-1 text-[13px] font-medium text-slate-400 hover:text-slate-600"
      >
        <ArrowLeft className="h-4 w-4" /> 進銷存
      </Link>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">手機盤點</h1>
        <p className="text-[13px] text-slate-400">
          掃碼或搜尋 → 輸入實盤數量,AI 即時比對差異並推測原因
        </p>
      </div>
      <Stocktake items={items} />
    </div>
  );
}
