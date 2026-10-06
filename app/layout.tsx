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
  title: "LUXKEY｜中小企業的五倍行銷部",
  description:
    "中小企業的五倍行銷部。一個人的成本，五個人的產能。企劃、文案、設計、影片、數位人、社群、廣告、網站與流程自動化，一個窗口整合，從曝光到客戶與訂單。",
  openGraph: { images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "LUXKEY 中小企業的五倍行銷部" }], type: "website", locale: "zh_TW", siteName: "LUXKEY", title: "LUXKEY｜中小企業的五倍行銷部", description: "中小企業的五倍行銷部。一個人的成本，五個人的產能。企劃、文案、設計、影片、數位人、社群、廣告、網站與流程自動化，一個窗口整合，從曝光到客戶與訂單。" },
  twitter: { images: ["/og-image.png"], card: "summary_large_image", title: "LUXKEY｜中小企業的五倍行銷部" },
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
