export const dynamic = "force-dynamic";

export default function TrackPage({
  params,
}: {
  params: { orderNo: string };
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card">
        <p className="text-sm text-slate-400">訂單查詢</p>
        <p className="mt-1 text-lg font-semibold text-slate-800">
          {decodeURIComponent(params.orderNo)}
        </p>
        <p className="mt-4 text-sm text-slate-400">建置中…</p>
      </div>
    </div>
  );
}
