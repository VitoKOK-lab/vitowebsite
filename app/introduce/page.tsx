import type { Metadata } from 'next';
import IntroducePage from './introduce-client';
const title = 'super 5｜ai market automatic system';
const description = 'super 5 經銷服務選單：數字人、實拍短影音、AI 影片、圖文小編、網站系統與 KOC／KOL。各項服務分頁展示作品、交付內容與參考價格。';
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: '/introduce/' },
  openGraph: { title, description, siteName: 'super 5', url: '/introduce/', images: [{ url: '/super5-share.png', width: 1200, height: 630, alt: title }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/super5-share.png'] },
  icons: { icon: '/super5-icon.svg', apple: '/super5-icon.svg' },
};
export default function Page() { return <IntroducePage />; }
