import { allData } from "@/lib/data/store";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { StageProgress } from "@/lib/ui/stage-progress";
import { formatDate } from "@/lib/utils";
import { PackageSearch, ShieldCheck } from "lucide-react";
import type { IndustryKey } from "@/lib/types";

export const dynamic = "force-dynamic";

function findByNo(orderNo: string) {
  const data = allData();
  for (const key of Object.keys(data) as IndustryKey[]) {
    const o = data[key].workOrders.find(
      (w) => w.orderNo.toLowerCase() === orderNo.toLowerCase()
    );
    if (o) return { order: o, industry: key };
  }
  return null;
}

export default function TrackPage({
  params,
}: {
  params: { orderNo: string };
}) {
  const orderNo = decodeURIComponent(params.orderNo);
  const found = findByNo(orderNo);

  return (
    <div className="mx-auto min-h-dvh max-w-md bg-slate-50 px-4 py-8">
      <div className="mb-5 text-center">
        <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-pop">
          <PackageSearch className="h-5 w-5" />
        </div>
        <h1 className="text-lg font-bold text-slate-900">訂單進度查詢</h1>
        <p className="text-[13px] text-slate-400">輸入您的訂單編號即可查看即時進度</p>
      </div>

      {!found ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card">
          <p className="text-[15px] font-semibold text-slate-700">{orderNo}</p>
          <p className="mt-2 text-[13px] text-slate-400">查無此訂單編號,請確認後再試</p>
        </div>
      ) : (
        <TrackCard order={found.order} industry={found.industry} />
      )}

      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        本頁僅顯示進度與交期,不含任何內部資訊
      </div>
    </div>
  );
}

function TrackCard({
  order,
  industry,
}: {
  order: ReturnType<typeof allData>[IndustryKey]["workOrders"][number];
  industry: IndustryKey;
}) {
  const cfg = getIndustryConfig(industry);
  const currentLabel =
    cfg.orderStages.find((s) => s.key === order.currentStage)?.label ?? "";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="text-center">
        <p className="text-[13px] text-slate-400">訂單編號</p>
        <p className="text-xl font-bold text-slate-900 tabular-nums">{order.orderNo}</p>
      </div>

      <div className="my-5 rounded-2xl bg-slate-50 p-4 text-center">
        <p className="text-[12px] text-slate-400">目前狀態</p>
        <p
          className={
            order.done
              ? "text-lg font-bold text-emerald-600"
              : order.delayed
              ? "text-lg font-bold text-rose-600"
              : "text-lg font-bold text-brand-600"
          }
        >
          {order.done ? "已完成 / 已出貨" : currentLabel}
        </p>
        {!order.done && (
          <p className="mt-1 text-[13px] text-slate-500">
            預計交貨日 {formatDate(order.dueDate)}
          </p>
        )}
      </div>

      <StageProgress
        stages={cfg.orderStages}
        currentKey={order.currentStage}
        delayed={order.delayed}
      />
    </div>
  );
}
