import type { Metadata } from 'next';
import IntroducePage from './introduce-client';

export const metadata: Metadata = {
  title: 'LUXKEY｜五倍行銷部・服務介紹',
  description: '中小企業的五倍行銷部。完整服務、方案收費、AI 作品與合作流程介紹。',
  alternates: { canonical: '/introduce/' },
};

export default function Page() {
  return <IntroducePage />;
}
