import { SectionTitle } from "@/lib/ui/card";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="space-y-4">
      <SectionTitle>報價</SectionTitle>
      <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
        建置中…
      </div>
    </div>
  );
}
