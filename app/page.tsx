import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default function Home() {
  const { role } = getSession();
  // 員工/客戶進今日任務或客服,其餘進決策佇列(脊椎)
  if (role === "staff") redirect("/dashboard");
  if (role === "customer") redirect("/cs");
  redirect("/decisions");
}
