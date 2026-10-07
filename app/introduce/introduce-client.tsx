'use client';
import {useState} from 'react';
import {ArrowDown, ArrowUpRight, Check, ChevronDown} from 'lucide-react';
import {offers, outcomeImages} from '../service-shop';
import './super5.css';
import './dealer.css';

function Brand(){return <span className="s5-brand"><span className="s5-brand-name">super <b>5</b></span><span className="s5-brand-tagline">ai market automatic system</span></span>}
const clips=[{id:'ai-product-ad',title:'產品情境廣告',copy:'把產品賣點，做成吸引目光的畫面。'},{id:'ai-lifestyle-ad',title:'社群短影音',copy:'把素材剪成適合社群觀看的短片。'},{id:'ai-brand-presenter',title:'AI 品牌角色',copy:'用固定角色，持續介紹品牌與產品。'}];
const faqs=[['月費 35,000 與 50,000 元差在哪？','35,000 元是基本月包：8 則圖文、4 支短影音、內容月曆與一次策略會議。擴充數量、影音規格與協作工作量後，依提案報價，最高至本方案區間 50,000 元。'],['還有哪些費用？','方案皆為新臺幣未稅。廣告預算、到場拍攝、每日客服、主機、工具／API 訂閱及額外開發，依需求另估；不包含在月包內。'],['AI 做的內容，會有人檢查嗎？','會。AI 協助產出，專人檢查品牌、資訊與品質，再交由你確認。交期從素材、權限與需求齊備後起算；修改次數依方案約定。']];
export default function IntroducePage(){
 const [selected,setSelected]=useState(0);const offer=offers[selected];
 function select(i:number){setSelected(i);requestAnimationFrame(()=>document.getElementById('offer-detail')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}))}
 return <div className="dealer-page" id="top">
 <a className="ds-skip" href="#main">跳至內容</a>
 <header className="ds-header"><a href="#top" aria-label="super 5 回到頁首"><Brand/></a><nav aria-label="主選單"><a href="#services">方案與價格</a><a href="#work">看作品</a><a href="#process">怎麼開始</a></nav></header>
 <main id="main">
 <section className="ds-hero ds-wrap"><div><span className="ds-eyebrow">中小企業的五倍行銷部</span><h1>一個人的成本，<br/><em>五個人的產能。</em></h1><p>企劃、文案、設計、影音、排程。<br/>一個窗口，幫你把行銷做好。</p><div className="ds-hero-price"><strong>NT$35,000–50,000</strong><span>／月・未稅</span></div><a className="ds-button" href="#services">看方案與交付內容 <ArrowDown size={18}/></a><small>「五倍」代表多種專長整合，交付依方案約定。</small></div><figure><img src="/heroes/service-marketing-relaxed-900.webp" alt="一個人輕鬆掌握文案、設計、影音、排程與報表" width="900" height="600" fetchPriority="high"/><figcaption>一個人，輕鬆掌握五件事。<span>AI 情境示意</span></figcaption></figure></section>
 <section id="services" className="ds-section ds-wrap"><div className="ds-heading"><div><span className="ds-eyebrow">01 / 選服務</span><h2>你想完成什麼？</h2></div><p>選一個方案，看價格、內容與交期。</p></div>
 <div className="ds-cards" role="group" aria-label="選擇服務方案">{offers.map((o,i)=>{const visual=outcomeImages[o.key as keyof typeof outcomeImages];return <button key={o.key} className="ds-card" aria-pressed={i===selected} aria-controls="offer-detail" onClick={()=>select(i)}><img src={`/heroes/${visual.image}-900.webp`} alt={visual.alt} width="900" height="600" loading="lazy"/><div><small>{['每月穩定做行銷','素材變成短影音','重複工作自動做','做一套專用系統'][i]}</small><h3>{o.title}</h3><strong><span>NT$</span>{o.price}<small>{o.unit}</small></strong><span className="ds-card-action">看交付內容 <ChevronDown size={17}/></span></div></button>})}</div>
 <p className="ds-note">新臺幣未稅參考價；範圍與排程依正式報價確認。圖片為 AI 示意。</p>
 <div className="ds-detail" id="offer-detail" aria-live="polite" aria-atomic="true" key={offer.key}><div><span className="ds-eyebrow">{selected===0?'35,000 元基本月包':'這個方案包含'}</span><h3>{offer.title}</h3><p>{offer.summary}</p><ul>{offer.items.map(item=><li key={item}><Check size={17}/>{item}</li>)}</ul></div><div className="ds-delivery"><span className="ds-eyebrow">多久交付？</span><h4>{offer.time}</h4><p>你要準備：{offer.input}</p><details><summary>修改、付款與不包含項目 <ChevronDown size={16}/></summary><p>{offer.revision}</p><p>{offer.payment}</p><p>{offer.extra}</p><p>交期不含等候回覆與需求變更時間。擴充數量與規格另於提案確認。</p></details></div></div>
 <div className="ds-comparison" id="comparison"><h3>跟請一位小編，差在哪？</h3><div><span>聘請小編</span><p>買一位夥伴的時間，適合駐點與即時協作。</p></div><div><span>super 5</span><p>買約定的成果，一個窗口整合企劃、設計與剪輯。</p></div></div>
 <details className="ds-software" id="software"><summary><span>專案型軟體 <strong>看企業系統示意</strong></span><ChevronDown size={20}/></summary><div><h3>200萬的大型軟體，你也能快速擁有</h3><p>拋棄式的訂製軟體？專案結束就送人，快速上線、快速去賺錢。</p><img src="/heroes/enterprise-command-1774.webp" alt="企業系統概念：跨據點營運、庫存、專案與 AI 提醒" width="1774" height="887" loading="lazy"/><p className="ds-note">企業系統概念示意，使用模擬資料。200 萬為完整系統預算假設，15 萬起為聚焦單一流程的首版，非同規格價格比較；功能、串接、資安與維護依專案範圍報價。</p></div></details>
 </section>
 <section className="ds-work ds-section" id="work"><div className="ds-wrap"><div className="ds-heading"><div><span className="ds-eyebrow">02 / 看作品</span><h2>直接看，能做出什麼。</h2></div><p>點擊播放實際展示作品。</p></div><div className="ds-videos">{clips.map(v=><article key={v.id}><video controls playsInline preload="none" poster={`/showcase/${v.id}.jpg`} aria-label={v.title}><source src={`/showcase/${v.id}.mp4`} type="video/mp4"/>你的瀏覽器不支援影片。</video><h3>{v.title}</h3><p>{v.copy}</p></article>)}</div><details className="ds-course"><summary>還能把專業做成課程：看教學影片 <ChevronDown size={18}/></summary><video controls playsInline preload="none" poster="/showcase/ai-course.jpg" aria-label="AI 知識課程展示"><source src="/showcase/ai-course.mp4" type="video/mp4"/></video></details><p className="ds-note">作品含 AI 生成內容；片中情境與數字不代表客戶實績或成效保證。</p></div></section>
 <section id="process" className="ds-section ds-wrap"><div className="ds-heading"><div><span className="ds-eyebrow">03 / 開始合作</span><h2>三步，把事情交付。</h2></div></div><ol className="ds-steps">{[['選方案','確認目標、數量、交期與報價。'],['給素材','提供品牌資料，先確認方向再製作。'],['收成果','依約審稿、修改、驗收與交付。']].map(([title,text],i)=><li key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol><div className="ds-faq">{faqs.map(([q,a])=><details key={q}><summary>{q}<ChevronDown size={18}/></summary><p>{a}</p></details>)}</div><div className="ds-ending"><p>先選一件事，讓成果開始發生。</p><a className="ds-button" href="#services">回到方案與價格 <ArrowUpRight size={18}/></a></div></section>
 </main><footer className="ds-footer ds-wrap"><Brand/><span>© {new Date().getFullYear()} super 5</span><a href="#top">回到頂端 ↑</a></footer>
 </div>
}
