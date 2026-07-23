"use client";

import * as React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { rgb, rgba, INK } from "./chart-theme";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

function useMounted() {
  const [m, setM] = React.useState(false);
  React.useEffect(() => setM(true), []);
  return m;
}

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function Skeleton({ height }: { height: number }) {
  return (
    <div
      className="w-full animate-pulse rounded-xl bg-slate-100"
      style={{ height }}
    />
  );
}

// ---- 折線:單一序列(量 / 時間)----
export function LineChart({
  labels,
  data,
  accent,
  height = 160,
  currency = false,
  suffix = "",
}: {
  labels: string[];
  data: number[];
  accent: string; // RGB triplet
  height?: number;
  currency?: boolean;
  suffix?: string;
}) {
  const mounted = useMounted();
  if (!mounted) return <Skeleton height={height} />;

  const fmt = (v: number) =>
    currency
      ? "$" + new Intl.NumberFormat("zh-TW").format(v)
      : new Intl.NumberFormat("zh-TW").format(v) + suffix;

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: reduceMotion() ? false : { duration: 600 },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (c) => fmt(c.parsed.y ?? 0) },
        backgroundColor: "rgb(15 23 42)",
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: rgb(INK.tick), font: { size: 10 } },
      },
      y: {
        grid: { color: rgb(INK.grid) },
        border: { display: false },
        ticks: {
          color: rgb(INK.tick),
          font: { size: 10 },
          maxTicksLimit: 4,
          callback: (v) => fmt(Number(v)),
        },
      },
    },
    elements: { point: { radius: 0, hoverRadius: 5 } },
  };

  return (
    <div style={{ height }}>
      <Line
        options={options}
        data={{
          labels,
          datasets: [
            {
              data,
              borderColor: rgb(accent),
              backgroundColor: (ctx) => {
                const { chart } = ctx;
                const { ctx: c, chartArea } = chart;
                if (!chartArea) return rgba(accent, 0.12);
                const g = c.createLinearGradient(
                  0,
                  chartArea.top,
                  0,
                  chartArea.bottom
                );
                g.addColorStop(0, rgba(accent, 0.22));
                g.addColorStop(1, rgba(accent, 0));
                return g;
              },
              borderWidth: 2,
              tension: 0.38,
              fill: true,
            },
          ],
        }}
      />
    </div>
  );
}

// ---- 長條:單一序列(依類別的量,水平)----
export function BarChart({
  labels,
  data,
  accent,
  height = 200,
  suffix = "",
}: {
  labels: string[];
  data: number[];
  accent: string;
  height?: number;
  suffix?: string;
}) {
  const mounted = useMounted();
  if (!mounted) return <Skeleton height={height} />;

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    animation: reduceMotion() ? false : { duration: 600 },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (c) => `${c.parsed.x ?? 0}${suffix}` },
        backgroundColor: "rgb(15 23 42)",
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { color: rgb(INK.grid) },
        border: { display: false },
        ticks: { color: rgb(INK.tick), font: { size: 10 }, precision: 0 },
      },
      y: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "rgb(71 85 105)", font: { size: 11 } },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Bar
        options={options}
        data={{
          labels,
          datasets: [
            {
              data,
              backgroundColor: rgba(accent, 0.85),
              hoverBackgroundColor: rgb(accent),
              borderRadius: 6,
              borderSkipped: false,
              barThickness: 14,
            },
          ],
        }}
      />
    </div>
  );
}

// ---- 甜甜圈:狀態分布(多色 + 圖例)----
export function DoughnutChart({
  labels,
  data,
  colors, // RGB triplets(狀態色)
  height = 180,
}: {
  labels: string[];
  data: number[];
  colors: string[];
  height?: number;
}) {
  const mounted = useMounted();
  if (!mounted) return <Skeleton height={height} />;

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    animation: reduceMotion() ? false : { duration: 600 },
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "rgb(71 85 105)",
          font: { size: 11 },
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgb(15 23 42)",
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Doughnut
        options={options}
        data={{
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors.map((c) => rgb(c)),
              borderColor: "#fff",
              borderWidth: 2,
              hoverOffset: 4,
            },
          ],
        }}
      />
    </div>
  );
}
