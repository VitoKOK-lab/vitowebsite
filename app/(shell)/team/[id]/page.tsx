import { allData } from "@/lib/data/store";
import type { IndustryKey } from "@/lib/types";
import { EmployeeDetailClient } from "@/modules/team/components/EmployeeDetailClient";

// 靜態輸出:預先產生每位員工的頁面
export function generateStaticParams() {
  const data = allData();
  const ids: { id: string }[] = [];
  (Object.keys(data) as IndustryKey[]).forEach((k) =>
    data[k].employees.forEach((e) => ids.push({ id: e.id }))
  );
  return ids;
}

export default function TeamMemberPage({ params }: { params: { id: string } }) {
  return <EmployeeDetailClient id={params.id} />;
}
