import { allData } from "@/lib/data/store";
import type { IndustryKey } from "@/lib/types";
import { OrderDetailClient } from "@/modules/orders/components/OrderDetailClient";

// 靜態輸出:預先產生每張工單的頁面
export function generateStaticParams() {
  const data = allData();
  const ids: { id: string }[] = [];
  (Object.keys(data) as IndustryKey[]).forEach((k) =>
    data[k].workOrders.forEach((o) => ids.push({ id: o.id }))
  );
  return ids;
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return <OrderDetailClient id={params.id} />;
}
