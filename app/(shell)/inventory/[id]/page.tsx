import { allData } from "@/lib/data/store";
import type { IndustryKey } from "@/lib/types";
import { SkuDetailClient } from "@/modules/inventory/components/SkuDetailClient";

// 靜態輸出:預先產生每個品項的頁面
export function generateStaticParams() {
  const data = allData();
  const ids: { id: string }[] = [];
  (Object.keys(data) as IndustryKey[]).forEach((k) =>
    data[k].skus.forEach((s) => ids.push({ id: s.id }))
  );
  return ids;
}

export default function SkuDetailPage({ params }: { params: { id: string } }) {
  return <SkuDetailClient id={params.id} />;
}
