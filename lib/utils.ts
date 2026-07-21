import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

/** 相對日期(demo 用固定基準日,避免每次 render 變動) */
export const DEMO_TODAY = new Date("2026-07-21T09:00:00+08:00");

export function daysFromToday(date: string | Date): number {
  const d = typeof date === "string" ? new Date(date) : date;
  const ms = d.getTime() - DEMO_TODAY.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("zh-TW", {
    month: "long",
    day: "numeric",
  }).format(d);
}
