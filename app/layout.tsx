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
  openGraph: { images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "LUXKEY 讓 AI 上工，讓生意加速" }], type: "website", locale: "zh_TW", siteName: "LUXKEY", title: "LUXKEY｜讓 AI 上工，讓生意加速。", description: "從雲端小編、自動剪輯，到企業流程與新商業模式。把 AI 做進生意裡。" },
  twitter: { images: ["/og-image.png"], card: "summary_large_image", title: "LUXKEY｜讓 AI 上工，讓生意加速。" },
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
