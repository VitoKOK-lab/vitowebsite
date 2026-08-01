"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/** 回到上一頁(使用者原本所在位置);無歷史時退回 fallback */
export function BackButton({
  label = "返回",
  fallback = "/demo/dashboard",
}: {
  label?: string;
  fallback?: string;
}) {
  const router = useRouter();

  function back() {
    // 有瀏覽歷史就回上一頁,否則回 fallback
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  }

  return (
    <button
      onClick={back}
      className="inline-flex items-center gap-1 text-[13px] font-medium text-slate-400 transition-colors hover:text-slate-600"
    >
      <ArrowLeft className="h-4 w-4" /> {label}
    </button>
  );
}
