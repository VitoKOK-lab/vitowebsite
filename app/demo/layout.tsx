import type { Metadata } from "next";
import { SessionProvider } from "@/lib/auth/SessionProvider";

export const metadata: Metadata = {
  title: "AI 同事 — 中小企業 AI 營運系統 Demo",
  description:
    "AI 自動處理有數據的工作並附上建議,人類只負責決策。老闆 5 分鐘處理完全公司決策。",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
