import Link from 'next/link';
import {ArrowLeft, ArrowRight, ChevronDown} from 'lucide-react';
import {dealerServices, type DealerCase} from './service-data';

export function DealerBrand() {
  return <span className="s5-brand"><span className="s5-brand-name">super <b>5</b></span><span className="s5-brand-tagline">ai market automatic system</span></span>;
}

export function DealerHeader() {
  return <header className="ds-header">
    <Link href="/introduce/" className="ds-header-logo" aria-label="super 5 經銷服務首頁"><DealerBrand/></Link>
    <nav className="ds-header-nav" aria-label="服務導覽">
      <Link href="/introduce/#services">全部服務</Link>
      <Link href="/introduce/#cases">合作實績</Link>
      <details className="ds-menu">
        <summary>服務選單 <ChevronDown size={16}/></summary>
        <div className="ds-menu-list">{dealerServices.map(service =>
          <Link key={service.slug} href={`/introduce/${service.slug}/`}>{service.nav}<ArrowRight size={15}/></Link>
        )}</div>
      </details>
    </nav>
  </header>;
}

export function DealerFooter() {
  return <footer className="ds-footer ds-wrap"><DealerBrand/><span>© {new Date().getFullYear()} super 5</span><Link href="/introduce/#services">返回全部服務 ↑</Link></footer>;
}

export function DealerCaseMedia({item}: {item: DealerCase}) {
  return <figure className="ds-case ds-case-simulated">
    <div className="ds-case-visual"><img src={item.src} alt={item.title} loading="lazy"/>{item.overlay && <span className="ds-case-overlay">{item.overlay}</span>}</div>
    <figcaption><strong>{item.title}</strong><span>{item.description}</span></figcaption>
  </figure>;
}

export function ReturnToServices() {
  return <Link className="ds-back-link" href="/introduce/#services"><ArrowLeft size={18}/> 返回全部服務</Link>;
}
