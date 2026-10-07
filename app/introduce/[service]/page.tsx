import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowRight, Check} from 'lucide-react';
import {DealerCaseMedia, DealerFooter, DealerHeader, ReturnToServices} from '../dealer-components';
import {dealerServices, getDealerService} from '../service-data';
import '../super5.css';
import '../dealer.css';

export function generateStaticParams() { return dealerServices.map(service => ({service: service.slug})); }
export function generateMetadata({params}: {params: {service: string}}): Metadata {
  const item = getDealerService(params.service);
  if (!item) return {title: '服務介紹｜super 5'};
  return {
    title: `${item.nav}｜super 5`,
    description: `${item.headline} ${item.priceLine}。${item.intro}`,
    alternates: {canonical: `/introduce/${item.slug}/`},
    openGraph: {title: `${item.nav}｜super 5`, description: item.intro, siteName: 'super 5', images: [{url: item.heroImage || item.image, width: item.heroImage ? 1672 : 1600, height: item.heroImage ? 941 : 900}]},
    twitter: {card: 'summary_large_image', title: `${item.nav}｜super 5`, description: item.intro, images: [item.heroImage || item.image]},
    icons: {icon: '/super5-icon.svg', apple: '/super5-icon.svg'},
  };
}

export default function DealerServicePage({params}: {params: {service: string}}) {
  const item = getDealerService(params.service);
  if (!item) notFound();
  return <div className={`dealer-page ds-service-page ds-theme-${item.slug}`} id="top">
    <a className="ds-skip" href="#main">跳至內容</a><DealerHeader/>
    <main id="main">
      <section className="ds-detail-hero"><div className="ds-wrap"><ReturnToServices/><div className="ds-detail-hero-grid"><div className="ds-detail-hero-copy"><span className="ds-kicker">{item.eyebrow}</span><h1>{item.headline}</h1><p>{item.intro}</p><div className="ds-detail-hero-price"><strong>{item.priceLine}</strong><small>{item.priceNote}</small></div><a href="#pricing" className="ds-primary">直接看方案與價格 <ArrowRight size={20}/></a></div><figure><img src={item.heroImage || item.image} alt={item.heroImageAlt || item.imageAlt} fetchPriority="high"/></figure></div></div></section>
      <section className="ds-wrap ds-service-pricing" id="pricing"><div className="ds-section-intro"><span className="ds-kicker">方案與價格</span><h2>買到什麼，<em>先講清楚。</em></h2><p>數量、規格、交付內容都攤開。以下為未稅參考價，正式範圍依提案確認。</p></div><div className={`ds-option-grid ${item.options.length===1?'ds-one-option':''}`}>{item.options.map(option=><article className="ds-option" key={option.name}><div className="ds-option-top"><h3>{option.name}</h3><p>{option.detail}</p></div><div className="ds-option-price"><strong>{option.price}</strong><span>{option.unit}</span></div><ul>{option.includes.map(line=><li key={line}><Check size={18}/>{line}</li>)}</ul></article>)}</div><p className="ds-price-disclaimer">交期自需求、素材與權限齊備後起算；額外拍攝、交通、授權、工具／API、廣告費、主機與超出範圍的修改另估。{item.slug === 'creator-campaign' && 'KOC／KOL 人選及合作檔期以正式報價為準。'}</p></section>
      <section className="ds-reasons"><div className="ds-wrap"><div className="ds-section-intro"><span className="ds-kicker">為什麼買這項</span><h2>不用懂 AI，<em>只要看到成果。</em></h2></div><div className="ds-reasons-grid">{item.reasons.map((reason,index)=><div key={reason.title}><span>0{index+1}</span><h3>{reason.title}</h3><p>{reason.body}</p></div>)}</div></div></section>
      <section className="ds-wrap ds-service-cases" id="examples"><div className="ds-section-intro"><span className="ds-kicker">{item.cases.length} 個 Demo / 看成品</span><h2>這項服務，<em>可以做成這樣。</em></h2><p>{item.demoIntro || '三種工作情境與成品畫面，完整呈現。'}</p></div><div className="ds-case-grid">{item.cases.map(work=><DealerCaseMedia item={work} key={work.src}/>)}</div></section>
      <section className="ds-process"><div className="ds-wrap"><div className="ds-section-intro"><span className="ds-kicker">合作流程</span><h2>三步，拿到成果。</h2></div><ol>{item.steps.map((step,index)=><li key={step}><span>0{index+1}</span><strong>{step}</strong></li>)}</ol></div></section>
      <section className="ds-wrap ds-cross-nav"><div><ReturnToServices/><h2>還想看別的服務？</h2></div><nav aria-label="切換其他服務">{dealerServices.filter(next=>next.slug!==item.slug).map(next=><Link key={next.slug} href={`/introduce/${next.slug}/`}>{next.nav}<ArrowRight size={16}/></Link>)}</nav></section>
    </main><DealerFooter/>
  </div>;
}
