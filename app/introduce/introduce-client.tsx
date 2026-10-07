import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {DealerFooter, DealerHeader} from './dealer-components';
import {dealerServices} from './service-data';
import {portfolioBrands, portfolioCases, portfolioProof} from '../portfolio-data';
import './super5.css';
import './dealer.css';

const proof = [
  {src: '/dealer/simulated/digital-human-2.webp', title: '數字人介紹產品', type: '固定角色開口介紹'},
  {src: '/dealer/simulated/real-video-2.webp', title: '到場拍短影音', type: '店主與商品入鏡'},
  {src: '/dealer/simulated/social-posts-2.webp', title: 'FB／IG 圖文小編', type: '主題、文案與主圖'},
];

export default function IntroducePage() {
  return <div className="dealer-page" id="top">
    <a className="ds-skip" href="#main">跳至內容</a>
    <DealerHeader/>
    <main id="main">
      <section className="ds-home-hero">
        <div className="ds-wrap ds-home-hero-inner">
          <div className="ds-home-copy">
            <span className="ds-kicker">中小企業的五倍行銷部</span>
            <h1>別再找五個人。<br/><em>直接買成果。</em></h1>
            <p>拍片、AI 影片、數字人、圖文、網站、KOC／KOL。<br/>六種服務，價格攤開；選你現在最需要的。</p>
            <div className="ds-hero-actions"><a href="#services" className="ds-primary">看六種服務與價格 <ArrowRight size={20}/></a><span>一個窗口，交付到手。</span></div>
          </div>
          <div className="ds-home-mosaic" aria-label="六種服務的視覺預覽">
            <img src="/dealer/digital-human.webp" alt="數字人影片" fetchPriority="high"/>
            <img src="/dealer/real-video.webp" alt="真實拍攝"/>
            <img src="/dealer/ai-video.webp" alt="AI 製片"/>
            <img src="/dealer/web-system.webp" alt="網站與系統"/>
          </div>
        </div>
      </section>
      <section className="ds-wrap ds-home-services" id="services">
        <div className="ds-section-intro"><span className="ds-kicker">服務選單 / 直接看價格</span><h2>我們的服務</h2><p>點進去看成品、內容、收費。每項服務都有自己的頁面，交付數量寫清楚，讓老闆快速決定。</p></div>
        <div className="ds-service-grid">{dealerServices.map((service,index)=><Link href={`/introduce/${service.slug}/`} className={`ds-service-card ${service.accent ? 'ds-orange' : ''}`} key={service.slug}>
          <div className="ds-service-card-image"><img src={service.image} alt={service.imageAlt} loading={index<2?'eager':'lazy'}/><span>0{index+1}</span></div>
          <div className="ds-service-card-copy"><span>{service.eyebrow}</span><h3>{service.nav}</h3><p>{service.headline}</p><div className="ds-service-card-bottom"><strong>{service.priceLine}</strong><ArrowRight size={22}/></div></div>
        </Link>)}</div>
        <p className="ds-price-disclaimer">價格為新臺幣未稅參考價；人選、拍攝地點、授權、系統串接和需求擴充依正式報價。主題大圖為 AI 生成示意。</p>
      </section>
      <section className="ds-bundle"><div className="ds-wrap ds-bundle-inner"><div><span className="ds-kicker">想交給一個團隊持續做？</span><h2>包月行銷服務</h2><p>每月 8 則圖文＋4 支短影音＋內容月曆。從題目到成品，一個窗口接住。</p></div><div><strong>NT$35,000–50,000 <small>／月</small></strong><Link href="/introduce/social-posts/" className="ds-primary">先看圖文與內容服務 <ArrowRight size={18}/></Link></div></div></section>
      <section className="ds-wrap ds-proof" id="examples"><div className="ds-section-intro"><span className="ds-kicker">先看 3 個 Demo</span><h2>不看說明，<em>也知道在賣什麼。</em></h2><p>先看畫面；每個服務頁還有至少三個不同主題的直式 Demo。</p></div><div className="ds-proof-grid">{proof.map(item=><figure key={item.title}><img src={item.src} alt={`${item.title}：${item.type}`} loading="lazy"/><figcaption><strong>{item.title}</strong><span>{item.type}</span></figcaption></figure>)}</div><p className="ds-demo-note">示範畫面由 AI 製作，未使用客戶素材。</p></section>
      <section className="ds-portfolio" id="cases"><div className="ds-wrap">
        <div className="ds-portfolio-heading"><div><span className="ds-kicker">合作客戶與實績</span><h2>做過哪些客戶？<br/>交出什麼成果？</h2></div><p>不只看示意圖。合作名稱、案例與交付數量，直接依提供的作品集整理。</p></div>
        <div className="ds-portfolio-stats" aria-label="作品集可核對的合作實績">{portfolioProof.map(item=><div key={item.label}><strong>{item.value}</strong><b>{item.label}</b><span>{item.detail}</span></div>)}</div>
        <div className="ds-portfolio-brands"><span>合作客戶／品牌・作品集收錄</span>{portfolioBrands.map(brand=><strong key={brand}>{brand}</strong>)}</div>
        <div className="ds-portfolio-grid">{portfolioCases.map((item,index)=><article className={`ds-portfolio-card ds-portfolio-${item.tone}`} key={item.brand}><div className="ds-portfolio-art" aria-hidden="true"><small>0{index+1}</small><b>{item.mark}</b><span>{item.kind}</span></div><div className="ds-portfolio-copy"><small>{item.kind}</small><h3>{item.brand}</h3><p>{item.detail}</p><span>{item.files}</span></div></article>)}</div>
        <p className="ds-portfolio-note">以上為作品集可核對的合作名稱、案型及交付數量；未列未經核實的營收或流量數字。客戶照片、影片與識別圖像取得授權後才會公開展示。</p>
      </div></section>
      <section className="ds-final-cta"><div className="ds-wrap"><span className="ds-kicker">選一件最急的，先做出來。</span><h2>看完方案，再決定買哪一項。</h2><a href="#services" className="ds-primary">返回服務選單 <ArrowRight size={20}/></a></div></section>
    </main>
    <DealerFooter/>
  </div>;
}
