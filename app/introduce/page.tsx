import type { Metadata } from 'next';
import IntroducePage from './introduce-client';
const title = 'super 5｜ai market automatic system';
const description = 'super 5，中小企業的五倍行銷部。完整服務、方案收費、AI 作品與合作流程介紹。';
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: '/introduce/' },
  openGraph: { title, description, siteName: 'super 5', url: '/introduce/', images: [{ url: '/super5-share.png', width: 1200, height: 630, alt: title }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/super5-share.png'] },
  icons: { icon: '/super5-icon.svg', apple: '/super5-icon.svg' },
};
export default function Page() { return <IntroducePage />; }
