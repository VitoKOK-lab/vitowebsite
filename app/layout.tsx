import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI 同事 — 中小企業 AI 營運系統",
  description:
    "AI 自動處理有數據的工作並附上建議,人類只負責決策。老闆 5 分鐘處理完全公司決策。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
