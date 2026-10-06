import type { Metadata } from 'next';
import HomePage from './home-client';

export const metadata: Metadata = {
  title: 'LUXKEY｜雲端 AI 小編、自動剪輯與企業 AI 導入',
  description: '讓 AI 上工，讓生意加速。LUXKEY 提供雲端 AI 小編、自動剪輯師、企業流程自動化、AI 商業模式與代理合作。低成本起步，快速看見首版。',
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
