"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/SessionProvider";

export default function Home() {
  const router = useRouter();
  const { role } = useSession();

  React.useEffect(() => {
    const target =
      role === "staff" ? "/dashboard" : role === "customer" ? "/cs" : "/decisions";
    router.replace(target);
  }, [role, router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">
      載入中…
    </div>
  );
}
