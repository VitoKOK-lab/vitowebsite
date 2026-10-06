import type { Metadata } from 'next';
import HomePage from './home-client';

export const metadata: Metadata = {
  title: 'LUXKEY｜每月一位小編的預算，一整隊 AI 商業顧問',
  description: '每月一位行銷小編的預算，請一整隊 AI 商業顧問。從行銷企劃、雲端小編、自動剪輯，到企業 AI 導入與商業策略，按月合作、持續交付，也提供按專案打造、用完可退場的軟體。',
  alternates: { canonical: 'https://luxkey.com.tw/' },
};
const organization = {
  '@context': 'https://schema.org', '@type': 'Organization', name: 'LUXKEY', legalName: '金曜石國際股份有限公司',
  url: 'https://luxkey.com.tw/', email: 'luxkey.tw@gmail.com',
  description: '企業 AI 導入、雲端 AI 小編、自動剪輯、AI 商業模式與代理合作。',
  address: { '@type': 'PostalAddress', streetAddress: '信義路四段458號6樓', addressLocality: '臺北市信義區', addressCountry: 'TW' },
};
export default function Page() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, '\\u003c') }} /><HomePage /></>;
}
