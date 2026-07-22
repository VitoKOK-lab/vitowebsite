import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export { DEMO_TODAY } from "./demo-clock";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 台幣格式化 */
export function twd(n: number): string {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(n);
}

/** 千分位數字 */
export function num(n: number): string {
  return new Intl.NumberFormat("zh-TW").format(n);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("zh-TW", {
    month: "long",
    day: "numeric",
  }).format(d);
}
