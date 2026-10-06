import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/lib/auth/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://luxkey.com.tw"),
  title: "LUXKEY｜企業 AI 導入與商業應用",
  description:
    "雲端 AI 小編、自動剪輯師、企業流程自動化與 AI 商業模式。低成本起步，快速看見首版。",
  openGraph: { images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "LUXKEY 一位小編的預算，一整隊 AI 商業顧問" }], type: "website", locale: "zh_TW", siteName: "LUXKEY", title: "LUXKEY｜一位小編的預算，一整隊 AI 商業顧問", description: "每月一位行銷小編的預算，讓 AI 商業團隊替你工作。企劃、小編、剪輯、營運與策略，按月合作、持續交付。" },
  twitter: { images: ["/og-image.png"], card: "summary_large_image", title: "LUXKEY｜一位小編的預算，一整隊 AI 商業顧問" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14161A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" className={inter.variable}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
