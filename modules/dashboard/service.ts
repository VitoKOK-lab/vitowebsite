import type { IndustryKey } from "@/lib/types";
import type { Task } from "@/lib/data/models";
import { db } from "@/lib/data/store";
import { pendingCount } from "@/modules/decisions/service";

/** 員工今日任務(依 ownerId 過濾;demo 取 staff 全部) */
export function tasksFor(industry: IndustryKey): Task[] {
  return db(industry).tasks;
}

/** 完成任務:標記 done 並讓對應員工結案數 +1(即時反映到老闆排行) */
export function completeTask(industry: IndustryKey, taskId: string): boolean {
  const data = db(industry);
  const t = data.tasks.find((x) => x.id === taskId);
  if (!t || t.done) return false;
  t.done = true;
  const emp = data.employees.find((e) => e.id === t.ownerId);
  if (emp) emp.closed += 1;
  return true;
}

export interface OwnerMetrics {
  revenueToday: number;
  revenueYesterday: number;
  revenueTrend: number; // %
  spark: number[];
  pendingOrders: number;
  delayedOrders: number;
  lowStock: number;
  expirySoon: number;
  pendingDecisions: number;
}

export function ownerMetrics(industry: IndustryKey): OwnerMetrics {
  const data = db(industry);
  const revenueToday = data.revenueToday;
  const revenueYesterday = Math.round(revenueToday * 0.91);
  const pendingOrders = data.workOrders.filter((w) => !w.done).length;
  const delayedOrders = data.workOrders.filter((w) => w.delayed).length;
  const lowStock = data.skus.filter((s) => s.onHand < s.safetyStock).length;
  const expirySoon = data.skus.filter((s) => {
    if (!s.expiryDate) return false;
    const days = (new Date(s.expiryDate).getTime() - new Date("2026-07-21").getTime()) / 86400000;
    return days <= 2;
  }).length;

  // 近 7 日營收(deterministic 擬真曲線)
  const spark = [0.82, 0.88, 0.79, 0.94, 0.86, 0.97, 1].map((r) =>
    Math.round(revenueToday * r)
  );

  return {
    revenueToday,
    revenueYesterday,
    revenueTrend: Math.round(((revenueToday - revenueYesterday) / revenueYesterday) * 100),
    spark,
    pendingOrders,
    delayedOrders,
    lowStock,
    expirySoon,
    pendingDecisions: pendingCount(industry),
  };
}

export interface LeaderRow {
  id: string;
  name: string;
  dept: string;
  closed: number;
  onTime: number;
  winRate: number;
  score: number;
}

export function leaderboard(industry: IndustryKey): LeaderRow[] {
  const emps = db(industry).employees;
  const rows = emps.map((e) => ({
    id: e.id,
    name: e.name,
    dept: e.dept,
    closed: e.closed,
    onTime: e.onTime,
    winRate: e.winRate,
    // 結案數為主要貢獻指標,準時率/成交率為加權(讓排行直覺:做最多的排前面)
    score: e.closed * 3 + e.onTime + e.winRate,
  }));
  return rows.sort((a, b) => b.score - a.score);
}

export interface AlertRow {
  id: string;
  kind: "delay" | "low_stock" | "expiry";
  title: string;
  detail: string;
}

export function alerts(industry: IndustryKey): AlertRow[] {
  const data = db(industry);
  const out: AlertRow[] = [];
  data.workOrders
    .filter((w) => w.delayed)
    .forEach((w) =>
      out.push({
        id: `al-${w.id}`,
        kind: "delay",
        title: `${w.orderNo} 延遲`,
        detail: `${w.customerName} · ${w.itemsSummary}`,
      })
    );
  data.skus
    .filter((s) => s.onHand < s.safetyStock)
    .slice(0, 3)
    .forEach((s) =>
      out.push({
        id: `al-${s.id}`,
        kind: "low_stock",
        title: `${s.name} 低於安全庫存`,
        detail: `現有 ${s.onHand} · 安全 ${s.safetyStock}`,
      })
    );
  data.skus
    .filter((s) => {
      if (!s.expiryDate) return false;
      const days = (new Date(s.expiryDate).getTime() - new Date("2026-07-21").getTime()) / 86400000;
      return days <= 2;
    })
    .slice(0, 2)
    .forEach((s) =>
      out.push({
        id: `al-exp-${s.id}`,
        kind: "expiry",
        title: `${s.name} 即將到期`,
        detail: `庫存 ${s.onHand} · 需優先使用`,
      })
    );
  return out.slice(0, 5);
}
