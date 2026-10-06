import type { Metadata } from 'next';
import HomePage from './home-client';

export const metadata: Metadata = {
  title: 'LUXKEY｜中小企業的五倍行銷部',
  description: '中小企業的五倍行銷部。一個人的成本，五個人的產能。企劃、文案、設計、影片、數位人、社群、廣告、網站與流程自動化，一個窗口整合，從曝光到客戶與訂單。',
  alternates: { canonical: 'https://luxkey.com.tw/' },
};
const organization = {
  '@context': 'https://schema.org', '@type': 'Organization', name: 'LUXKEY', legalName: '金曜石國際股份有限公司',
  url: 'https://luxkey.com.tw/', email: 'luxkey.tw@gmail.com',
  description: '中小企業的五倍行銷部。一個人的成本，五個人的產能。企劃、文案、設計、影片、數位人、社群、廣告、網站與流程自動化，一個窗口整合，從曝光到客戶與訂單。',
  address: { '@type': 'PostalAddress', streetAddress: '信義路四段458號6樓', addressLocality: '臺北市信義區', addressCountry: 'TW' },
};
export default function Page() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, '\\u003c') }} /><HomePage /></>;
}
