"use client";

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ArrowDown, Check, CheckCheck, ChevronDown, ChevronRight, CirclePlay, Clapperboard, Copy, FileText, LayoutDashboard, Mail, Menu, MessageCircle, Play, Plus, Send, ShieldCheck, Sparkles, Workflow, X, WandSparkles, Lightbulb, Handshake, CalendarDays, Bot, Clock3, Layers3 } from 'lucide-react';
import { buildBrief, estimateCapacity, industries, servicePlans, type ServiceKey } from '@/lib/marketing';
import './portfolio.css';

const videos = [
  { id: 'ai-product-ad', title: '讓產品，走進真實情境。', label: 'AI 情境廣告', duration: '00:28', source: 'MC-001', description: '人物情境、產品訴求、字幕與動態資訊，整合成一支直式廣告。', tags: ['情境腳本', 'AI 人物', '動態字幕'], portrait: true },
  { id: 'ai-lifestyle-ad', title: '賣的不是規格，是生活。', label: 'AI 生活感短片', duration: '00:24', source: 'MC-002', description: '把產品功能翻成消費者聽得懂的生活故事，適合社群與短影音版位。', tags: ['生活敘事', '產品溝通', '社群短片'], portrait: true },
  { id: 'ai-brand-presenter', title: '你的品牌，也能有自己的 IP。', label: 'AI 品牌角色', duration: '00:36', source: 'LAB-IP-001', description: '以固定角色、口吻與視覺模板，建立可持續更新的品牌內容系列。', tags: ['品牌角色', '解說配音', '系列內容'], portrait: true },
  { id: 'ai-course', title: '把專業，變成可以播放的課。', label: 'AI 知識內容', duration: '01:42', source: 'lesson-05-16x9', description: '將知識拆成清楚的段落，搭配旁白、字幕與畫面，製作課程與教學內容。', tags: ['課程製作', '圖文解說', '知識產品'], portrait: false },
] as const;
type Video = typeof videos[number];
const services: { key: ServiceKey; icon: typeof MessageCircle; outcome: string; title: string; copy: string; tags: string[] }[] = [
  { key: 'content', icon: MessageCircle, outcome: '讓內容持續上線', title: '雲端 AI 小編', copy: '企劃、文案、配圖、排程接起來。你掌握品牌方向，AI 處理日常產出。', tags: ['社群經營', '內容日曆', '品牌語氣'] },
  { key: 'video', icon: Clapperboard, outcome: '讓一份素材多次發揮', title: '自動剪輯師', copy: '長片找重點、短片加字幕、調整比例。一份素材，變成多平台內容。', tags: ['短影音', '自動字幕', 'AI 配音'] },
  { key: 'operations', icon: Workflow, outcome: '讓例行工作自己往前', title: 'AI 營運助理', copy: '整理訂單、追進度、做報表。每天最重要的事，打開畫面就看得到。', tags: ['流程自動化', '管理看板', '資料整理'] },
  { key: 'sales', icon: Bot, outcome: '讓商機有人接住', title: 'AI 業務與客服', copy: '常見問題先回覆、詢問先分類、跟進先提醒。把真人留給關鍵成交。', tags: ['客服知識庫', '智慧報價', '商機跟進'] },
  { key: 'business', icon: Lightbulb, outcome: '讓專業變成新收入', title: 'AI 商業模式', copy: '把你會的事做成網站、工具、課程或訂閱服務，先做首版，再測市場。', tags: ['數位產品', '網站／App', '市場驗證'] },
  { key: 'partner', icon: Handshake, outcome: '讓你的客戶也用上 AI', title: 'AI 代理合作', copy: '你熟悉客戶，我們負責技術與製作。從共同提案到交付，一起擴大服務。', tags: ['通路合作', '共同提案', '技術交付'] },
];
const demos = [
  { key: 'content', label: '雲端 AI 小編', icon: MessageCircle, title: '下週的內容，先幫你準備好了。', subtitle: '一個新品主題，延伸成整週的社群內容。', input: '下週推出夏季冷萃，想讓附近的上班族來試喝。', output: '把「上班很累」變成品牌能接住的日常。', steps: ['整理產品與客群', '安排一週主題', '產出文案與腳本', '等你確認再排程'], rows: [['MON', '新品亮相', '週一的清醒，交給這一杯。'], ['WED', '情境短片', '下午三點，把狀態找回來。'], ['FRI', '到店邀請', '這週辛苦了，來喝一杯。']], result: '3 則社群企劃 + 1 支短影音腳本', action: '把這套小編帶進公司' },
  { key: 'video', label: '自動剪輯師', icon: Clapperboard, title: '拍一次，讓內容多用幾次。', subtitle: '把原始素材拆成不同目的與平台的版本。', input: '我有一支產品介紹長片，想做成 IG、Reels 和 YouTube 內容。', output: '先找出最吸引人的一句，再安排畫面。', steps: ['辨識重點段落', '整理開場鉤子', '字幕與版型套用', '預覽後再輸出'], rows: [['9:16', '社群短版', '先用一個痛點，抓住注意力。'], ['1:1', '動態貼文', '放大產品亮點，保留清楚字幕。'], ['16:9', '完整介紹', '把故事說完整，帶到行動邀請。']], result: '一份素材 → 多比例、不同訴求的版本', action: '聊聊我的影片需求' },
  { key: 'operations', label: 'AI 營運助理', icon: LayoutDashboard, title: '先整理好，再交給你做決定。', subtitle: '把散落的資訊整理成今天的優先順序。', input: '訂單在 Excel、進度在 LINE，每天都要問同事才知道做到哪。', output: '今天先看這三件事，其餘進度已整理。', steps: ['整合既有資料', '比對進度與規則', '整理異常摘要', '重要動作由你確認'], rows: [['01', '交期提醒', '兩筆訂單需要確認出貨安排。'], ['02', '補貨建議', '主力品項接近設定的安全庫存。'], ['03', '日報整理', '把今日進度彙整成一頁摘要。']], result: '一份重點摘要 + 可追蹤的待辦清單', action: '找出我能省下的工作' },
] as const;
const faqs = [
  ['我不懂 AI，也沒有工程師，可以開始嗎？', '可以。先告訴我們你現在怎麼做事、哪裡最花時間。我們會把需求整理成清楚的交付項目，從一條流程或一份內容開始，並提供操作教學。'],
  ['真的能降低成本？費用怎麼算？', '先做小範圍，把重複工作交給 AI，再依實際使用擴充。報價會拆開製作、串接、工具訂閱與維護費；網站試算的是可釋出工時的價值，不代表保證省下的現金，也未扣除導入費用。'],
  ['多久能看到成果？', '我們以可展示的首版開始：例如一支短片、一週內容或一條自動流程。確認素材、串接需求與修改範圍後，會把首版、驗收與正式上線時間寫進提案。'],
  ['AI 小編會直接幫我發文嗎？', '可以依需求設計為先審核再排程，也能在你授權的範圍內自動發布。可串接的平台、帳號權限與工具費用會在提案中確認；內容方向與發布控制權始終由你掌握。'],
  ['會用到公司的機密資料嗎？', '評估時可先使用去識別化範例。正式導入前，會確認資料能否交給外部服務、可使用的工具與人員權限，再決定部署與串接方式。'],
  ['我是行銷公司或顧問，可以代理合作嗎？', '可以。可討論共同提案、品牌協作與技術交付。先挑一個明確的客戶需求，把服務範圍、交期、驗收與後續維護的分工談清楚。'],
];
const money = (n: number) => new Intl.NumberFormat('zh-TW').format(n);
function Wordmark() { return <span className="lk-wordmark">LUXKEY<span>.</span></span>; }
function SectionHeading({ number, label, children, description }: { number: string; label: string; children: ReactNode; description?: string }) {
  return <div className="lk-section-heading"><div className="lk-eyebrow"><span>{number} /</span> {label}</div><div className="lk-heading-row"><h2>{children}</h2>{description && <p>{description}</p>}</div></div>;
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videoError, setVideoError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [industry, setIndustry] = useState<string>(industries[0]);
  const [service, setService] = useState<ServiceKey>('content');
  const [details, setDetails] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>();
  const [hours, setHours] = useState(20);
  const [cost, setCost] = useState(300);
  const [percent, setPercent] = useState(50);
  const [contactOpen, setContactOpen] = useState(false);
  const demo = demos[activeDemo];
  const plan = servicePlans[service];
  const estimate = estimateCapacity(hours, cost, percent);
  const brief = buildBrief(industry, service, details);

  useEffect(() => {
    if (!selectedVideo) return;
    const node = dialog.current;
    if (node && !node.open) node.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = oldOverflow; };
  }, [selectedVideo]);
  useEffect(() => {
    function onKey(event: KeyboardEvent) { if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); } }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);
  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);
  useEffect(() => { setCopied(false); setCopyError(false); }, [industry, service, details]);
  function openVideo(video: Video) { setVideoError(false); setSelectedVideo(video); }
  function closeVideo() { videoRef.current?.pause(); dialog.current?.close(); setSelectedVideo(null); }
  function chooseService(key: ServiceKey) { setService(key); document.getElementById('start')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
  async function copyBrief() {
    try { await navigator.clipboard.writeText(brief); setCopied(true); setCopyError(false); if (copyTimer.current) clearTimeout(copyTimer.current); copyTimer.current = setTimeout(() => setCopied(false), 4000); }
    catch { setCopyError(true); setCopied(false); }
  }

  return (
    <div className="luxkey-site" id="top">
      <a className="lk-skip" href="#main">跳至主要內容</a>
      <header className="lk-header">
        <a href="#top" className="lk-logo-link" aria-label="LUXKEY 首頁"><Wordmark /></a>
        <nav className={menuOpen ? 'lk-nav is-open' : 'lk-nav'} id="main-navigation" aria-label="主選單">
          {[['AI 能做什麼', '#services'], ['看交付作品', '#work'], ['算算能省多少', '#calculator'], ['合作方式', '#process']].map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a href="#start" className="lk-nav-mobile-cta" onClick={() => setMenuOpen(false)}>聊聊你的需求 <ArrowUpRight size={16} /></a>
        </nav>
        <a className="lk-header-cta" href="#start">讓 AI 開始上工 <ArrowUpRight size={16} /></a>
        <button className="lk-menu-toggle" ref={menuButton} aria-label={menuOpen ? '關閉選單' : '開啟選單'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>
      <main id="main">
        <section className="lk-hero lk-container" aria-labelledby="hero-title">
          <div className="lk-hero-copy">
            <div className="lk-eyebrow"><span className="lk-dot" /> YOUR NEXT BUSINESS ADVANTAGE</div>
            <h1 id="hero-title">讓 AI 上工。<br /><em>讓生意加速。</em></h1>
            <p className="lk-hero-lead">少一點人力成本，多一點生意可能。</p>
            <p className="lk-hero-body">從雲端小編、自動剪輯，到企業流程與新商業模式。<br className="lk-desktop-break" />LUXKEY 把 AI 做成你用得上的服務，低成本起步，快速看見首版。</p>
            <div className="lk-hero-actions"><a className="lk-button lk-button-primary" href="#start">找出適合我的 AI <ArrowUpRight size={19} /></a><a className="lk-text-link" href="#work"><CirclePlay size={21} /> 先看做得出什麼</a></div>
            <div className="lk-hero-promises"><span><Check size={14} /> 從小需求開始</span><span><Check size={14} /> 先看首版再擴大</span><span><Check size={14} /> 不懂技術也能用</span></div>
          </div>
          <div className="lk-hero-studio" aria-label="AI 製作工作室作品展示">
            <div className="lk-studio-grid" />
            <div className="lk-studio-top"><span><span className="lk-dot" /> LUXKEY / AI STUDIO</span><span>從想法，到交付 <ArrowUpRight size={13} /></span></div>
            <div className="lk-orbit lk-orbit-one" /><div className="lk-orbit lk-orbit-two" />
            <span className="lk-studio-giant" aria-hidden="true">MAKE<br />IT WORK.</span>
            <button className="lk-hero-video lk-hero-video-back" onClick={() => openVideo(videos[0])} aria-label="播放 AI 情境廣告作品"><img src="/showcase/ai-product-ad.jpg" alt="AI 情境廣告：男子展示產品資訊" width="720" height="1280" fetchPriority="high" /><span className="lk-video-topline">AI 情境廣告 <Play size={12} fill="currentColor" /></span><span className="lk-video-bottomline">把產品，說成故事。<ArrowUpRight size={15} /></span></button>
            <button className="lk-hero-video lk-hero-video-front" onClick={() => openVideo(videos[2])} aria-label="播放 AI 品牌角色作品"><img src="/showcase/ai-brand-presenter.jpg" alt="AI 品牌角色示範影片" width="720" height="1280" fetchPriority="high" /><span className="lk-video-topline">品牌專屬 AI 角色 <Play size={12} fill="currentColor" /></span><span className="lk-play-circle"><Play size={19} fill="currentColor" /></span></button>
            <div className="lk-delivery-stamp"><span><CheckCheck size={18} /> 一個想法，多種交付</span><div><span>社群圖文</span><span>短影音</span><span>自動化</span></div></div>
            <div className="lk-studio-bottom"><span>STRATEGY × CONTENT × AUTOMATION</span><span>真實交付影片 · 點擊播放</span></div>
          </div>
          <div className="lk-hero-baseline"><span>你的下一位得力夥伴，不一定要加一張辦公桌。</span><a href="#services" aria-label="向下看 AI 服務"><ArrowDown size={19} /></a><span>TAIWAN · BUILT FOR YOUR BUSINESS</span></div>
        </section>

        <section className="lk-value-strip" aria-label="合作優勢"><div className="lk-container lk-value-grid">
          <div><span>01</span><p><strong>小預算，也能開始。</strong><small>先解決最值得的一件事。</small></p></div><div><span>02</span><p><strong>首版快，調整更快。</strong><small>把大專案拆成看得到的交付。</small></p></div><div><span>03</span><p><strong>交給你，真的能用。</strong><small>從內容製作到流程，連操作一起交付。</small></p></div>
        </div></section>

        <section className="lk-section lk-container" id="services">
          <SectionHeading number="01" label="YOUR AI TEAM" description="不用先研究一百個工具。從你最想少做的工作，或最想多做的生意開始。">你缺的那個人，<br /><span className="lk-muted-heading">AI 可以先補上。</span></SectionHeading>
          <div className="lk-services-grid">{services.map((item, index) => { const Icon = item.icon; return <button key={item.key} className="lk-service-card" onClick={() => chooseService(item.key)}><div className="lk-service-top"><Icon size={27} strokeWidth={1.4} /><span>0{index + 1}</span></div><small>{item.outcome}</small><h3>{item.title}</h3><p>{item.copy}</p><div className="lk-service-bottom"><span>{item.tags.join(' · ')}</span><ArrowUpRight size={22} /></div></button>; })}</div>
          <p className="lk-section-footnote"><ShieldCheck size={16} /> 每個方案都包含人工確認與交付教學；串接平台、工具費用與使用範圍在提案中說清楚。</p>
        </section>

        <section className="lk-demo-section" id="experience"><div className="lk-container lk-section">
          <SectionHeading number="02" label="SEE HOW IT WORKS" description="不用懂 AI 原理。選一個工作，看看從交辦到交付，中間可以少掉多少瑣事。">你交代一句，<br /><span className="lk-muted-heading">工作就有了下一步。</span></SectionHeading>
          <div className="lk-demo-tabs" role="group" aria-label="選擇工作流程示範">{demos.map((item, index) => { const Icon = item.icon; return <button key={item.key} aria-pressed={activeDemo === index} onClick={() => setActiveDemo(index)}><Icon size={18} />{item.label}<ArrowUpRight size={16} /></button>; })}</div>
          <div className="lk-demo-window">
            <div className="lk-window-bar"><span className="lk-window-dots" aria-hidden="true"><i /><i /><i /></span><span>LUXKEY WORKSPACE</span><span className="lk-demo-badge">互動流程示範</span></div>
            <div className="lk-demo-content" key={demo.key}>
              <div className="lk-demo-brief"><span className="lk-micro-label">01 / 你交代的事</span><div className="lk-chat-avatar">YOU</div><p className="lk-chat-message">{demo.input}</p><span className="lk-micro-label lk-workflow-label">02 / AI 協助的流程</span><ol>{demo.steps.map((step, i) => <li key={step}><span>{i + 1}</span>{step}{i < 3 && <div className="lk-step-line" />}</li>)}</ol><span className="lk-demo-note">預設情境示範，未呼叫即時 AI 或連接你的帳號。</span></div>
              <div className="lk-demo-output" aria-live="polite"><div className="lk-output-eyebrow"><Sparkles size={17} /><span>03 / 你拿到的成果</span><span className="lk-review-status">待你確認</span></div><h3>{demo.title}</h3><p>{demo.subtitle}</p><div className="lk-output-insight"><span>內容方向</span><strong>{demo.output}</strong></div><div className="lk-output-rows">{demo.rows.map(([day, label, text]) => <div key={day}><span className="lk-output-day">{day}</span><div><small>{label}</small><strong>{text}</strong></div><Check size={17} /></div>)}</div><div className="lk-output-footer"><span><Layers3 size={16} />{demo.result}</span><button onClick={() => chooseService(demo.key)} aria-label={demo.action}><ArrowUpRight size={23} /></button></div></div>
            </div>
          </div>
        </div></section>

        <section className="lk-work-section lk-section lk-container" id="work">
          <SectionHeading number="03" label="MADE WITH AI. READY FOR BUSINESS." description="廣告、品牌角色、知識內容。不只聊可能，直接播放，看交付。">能力，不用想像。<br /><em>成品在這裡。</em></SectionHeading>
          <div className="lk-showcase-grid">{videos.slice(0, 3).map((video, index) => <article className="lk-showcase" key={video.id}><button className="lk-showcase-poster" onClick={() => openVideo(video)} aria-label={`播放${video.label}：${video.title}`}><img src={`/showcase/${video.id}.jpg`} alt={video.title} width="720" height="1280" loading="lazy" /><span className="lk-showcase-no">0{index + 1} / {video.label}</span><span className="lk-showcase-play"><Play size={20} fill="currentColor" /></span><span className="lk-showcase-duration">{video.duration}</span></button><div className="lk-showcase-copy"><h3>{video.title}</h3><p>{video.description}</p><div className="lk-tags">{video.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></article>)}</div>
          <div className="lk-course-row"><button onClick={() => openVideo(videos[3])} className="lk-course-poster" aria-label="播放 AI 知識內容：安命宮與身宮"><img src="/showcase/ai-course.jpg" alt="紫微斗數課程：安命宮與身宮" width="720" height="405" loading="lazy" /><span className="lk-showcase-play"><Play size={18} fill="currentColor" /></span></button><div><span className="lk-eyebrow">04 / KNOWLEDGE TO PRODUCT</span><h3>你的專業，也可以是一門好生意。</h3><p>把教學、顧問經驗與專業知識，做成能重複銷售的課程與數位內容。</p><button className="lk-text-link" onClick={() => openVideo(videos[3])}>播放課程示範 <ArrowUpRight size={17} /></button></div><span className="lk-course-number">01:42<small>課程影片示範</small></span></div>
          <p className="lk-section-footnote">影片為作品展示，含 AI 生成人物與情境演出；片中情境、數字與產品訴求不代表客戶實績或成效保證。</p>
          <div className="lk-product-links"><div><span className="lk-eyebrow">BEYOND CONTENT</span><h3>也能把工作，做成一套系統。</h3></div><Link href="/decisions/"><LayoutDashboard size={20} /><span>老闆決策工作台<small>互動產品示範 · 使用模擬資料</small></span><ArrowUpRight size={20} /></Link><Link href="/quote/"><FileText size={20} /><span>智慧報價工具<small>互動產品示範 · 使用模擬資料</small></span><ArrowUpRight size={20} /></Link></div>
        </section>

        <section className="lk-calculator-section" id="calculator"><div className="lk-container lk-calculator-grid">
          <div className="lk-calculator-copy"><div className="lk-eyebrow"><span>04 /</span> MAKE THE NUMBERS WORK</div><h2>每週的重複工作，<br />正在花掉多少錢？</h2><p>先算算可以拿回多少時間。<br />再決定，哪件事最值得交給 AI。</p><span className="lk-calculator-mark" aria-hidden="true">TIME<br /><em>IS YOURS.</em></span></div>
          <div className="lk-calculator"><div className="lk-calculator-label"><Clock3 size={19} /> 你的團隊工時試算</div>
            <div className="lk-range-field"><label htmlFor="weekly-hours">每週花在重複工作的總時數 <strong>{hours} <small>小時</small></strong></label><input id="weekly-hours" type="range" min="1" max="100" step="1" value={hours} onChange={e => setHours(Number(e.target.value))} /><div><span>1 小時</span><span>100 小時</span></div></div>
            <div className="lk-range-field"><label htmlFor="hourly-cost">平均每小時人力成本 <strong>NT$ {money(cost)}</strong></label><input id="hourly-cost" type="range" min="100" max="1500" step="50" value={cost} onChange={e => setCost(Number(e.target.value))} /><div><span>NT$ 100</span><span>NT$ 1,500</span></div></div>
            <fieldset className="lk-reduction"><legend>假設 AI 協助減少的工時比例</legend><div>{[30, 50, 70].map(value => <button key={value} type="button" aria-pressed={percent === value} onClick={() => setPercent(value)}>{value}% <span>{value === 30 ? '保守試算' : value === 50 ? '中間情境' : '高度自動化'}</span></button>)}</div></fieldset>
            <div className="lk-estimate" aria-live="polite"><div><span>每月可釋出的工時價值</span><strong><small>NT$</small> {money(estimate.capacityValue)}</strong></div><div><b>{Number(estimate.savedHours.toFixed(1))}<small>小時／月</small></b><span>留給更有價值的工作</span></div></div>
            <p className="lk-calculator-note">以每月 4 週估算。這是你設定條件下的工時價值，非保證現金節省；尚未扣除導入、訂閱與維護費用。</p><button className="lk-button lk-button-light" onClick={() => { setDetails(`想評估每週 ${hours} 小時的重複工作，人力成本每小時 NT$${cost}，以減少 ${percent}% 工時為目標。`); chooseService('operations'); }}>一起找出最值得開始的流程 <ArrowUpRight size={18} /></button>
          </div>
        </div></section>

        <section className="lk-section lk-container" id="process"><SectionHeading number="05" label="START SMALL. MOVE FAST." description="不用一開始就換系統、招團隊。先把一件事做成，再把有效的方法放大。">低成本的關鍵，<br /><span className="lk-muted-heading">是把第一步做對。</span></SectionHeading>
          <div className="lk-process-grid">{[{ title: '說一個問題', text: '哪件事最花時間？哪個生意最想試？先用你熟悉的方式聊。', deliverable: '需求與優先順序' }, { title: '看一份提案', text: '做什麼、花多少、多久交付。工具費用與修改範圍一起說明。', deliverable: '範圍、報價、時程' }, { title: '試一個首版', text: '先給你可看的影片、可點的網站，或真的跑得動的流程。', deliverable: '可驗證的第一版' }, { title: '讓成果持續', text: '驗收、教學、交接，再依使用成效決定維護與下一步擴充。', deliverable: '正式交付與操作教學' }].map((step, i) => <article key={step.title}><div className="lk-process-num">0{i + 1}<ArrowRight size={20} /></div><h3>{step.title}</h3><p>{step.text}</p><span><Check size={14} />{step.deliverable}</span></article>)}</div>
          <div className="lk-about-strip"><Wordmark /><p>把複雜的事，做成有價值的系統。</p><span>商業策略 × 產品設計 × AI 落地</span></div>
        </section>

        <section className="lk-faq-section lk-container"><div><span className="lk-eyebrow">BEFORE WE START</span><h2>老闆常問的，<br />先幫你回答。</h2><a href="https://lin.ee/6M3pM1o" target="_blank" rel="noreferrer" className="lk-text-link">還有問題？LINE 直接聊 <ArrowUpRight size={17} /></a></div><div className="lk-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={19} /></summary><p>{answer}</p></details>)}</div></section>

        <section className="lk-start-section" id="start"><div className="lk-container lk-start-grid"><div className="lk-start-copy"><div className="lk-eyebrow"><span className="lk-dot" /> LET'S MAKE IT WORK</div><h2>先把一件事，<br /><em>交給 AI。</em></h2><p>選擇你想開始的方向，<br />我們一起把「想做」變成「做得到」。</p><a href="https://lin.ee/6M3pM1o" target="_blank" rel="noreferrer" className="lk-direct-contact"><MessageCircle size={20} /><span>不想填？LINE 直接聊<small>告訴我們，你最想解決哪件事。</small></span><ArrowUpRight size={22} /></a></div>
          <div className="lk-brief-builder"><div className="lk-form-heading"><span>你的 AI 起步計畫</span><small>選擇需求，即時整理</small></div><div className="lk-field-row"><label>你的產業<select value={industry} onChange={e => setIndustry(e.target.value)}>{industries.map(item => <option key={item}>{item}</option>)}</select></label><label>最想先做什麼<select value={service} onChange={e => setService(e.target.value as ServiceKey)}>{Object.entries(servicePlans).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label></div>
            <div className="lk-plan-result" aria-live="polite"><span><Sparkles size={15} /> 建議從這裡開始</span><h3>{plan.first}</h3><ul>{plan.deliverables.map(item => <li key={item}><Check size={15} />{item}</li>)}</ul><p><strong>可以先準備：</strong>{plan.input}</p></div>
            <label className="lk-details-label" htmlFor="brief-details">還有什麼想告訴我們？<span>選填</span></label><textarea id="brief-details" maxLength={1200} rows={3} value={details} onChange={e => setDetails(e.target.value)} placeholder="例如：每週想發 3 則貼文，但沒有專職小編。" />
            <div className="lk-brief-actions"><button className="lk-button lk-button-primary" onClick={copyBrief}>{copied ? <CheckCheck size={17} /> : <Copy size={17} />}{copied ? '需求已複製' : '複製需求，帶去聊聊'}</button><a className="lk-button lk-button-outline" href="https://lin.ee/6M3pM1o" target="_blank" rel="noreferrer">開啟 LINE <ArrowUpRight size={17} /></a></div>
            <div role="status" className="lk-copy-status">{copied ? '已複製。開啟 LINE 後貼上，就能接著討論。' : copyError ? '瀏覽器不允許複製，請展開需求摘要手動複製，或改用 Email。' : '內容只在你的瀏覽器整理；開啟 LINE 後貼上，再由你送出。'}</div>
            <details className="lk-brief-preview" open={copyError || contactOpen} onToggle={e => setContactOpen(e.currentTarget.open)}><summary>查看完整需求摘要 <ChevronDown size={15} /></summary><pre tabIndex={0}>{brief}</pre></details>
            <a className="lk-email-link" href={`mailto:luxkey.tw@gmail.com?subject=${encodeURIComponent(`AI 合作需求｜${plan.label}`)}&body=${encodeURIComponent(brief)}`}><Mail size={16} /> 或用 Email 帶著需求聯絡我們 <ArrowUpRight size={15} /></a>
          </div></div></section>
      </main>
      <footer className="lk-footer lk-container"><div className="lk-footer-main"><a href="#top" aria-label="LUXKEY 回到頁首"><Wordmark /></a><div><strong>金曜石國際股份有限公司</strong><address>臺北市信義區信義路四段458號6樓</address></div><a href="mailto:luxkey.tw@gmail.com">luxkey.tw@gmail.com <ArrowUpRight size={16} /></a><a href="#top" className="lk-back-top">回到頂端 <ArrowUpRight size={16} /></a></div><div className="lk-footer-bottom"><span>© {new Date().getFullYear()} LUXKEY. ALL RIGHTS RESERVED.</span><span>把 AI 做進生意裡。</span><a href="/privacy/">隱私說明</a></div></footer>
      <dialog className="lk-video-dialog" ref={dialog} onClose={closeVideo} onClick={e => { if (e.target === e.currentTarget) closeVideo(); }} aria-labelledby="video-title">
        {selectedVideo && <div className="lk-video-dialog-content"><div className="lk-dialog-header"><div><span>{selectedVideo.label}</span><h2 id="video-title">{selectedVideo.title}</h2></div><button autoFocus onClick={closeVideo} aria-label="關閉影片"><X size={23} /></button></div><div className={`lk-dialog-player ${selectedVideo.portrait ? 'is-portrait' : ''}`}><video ref={videoRef} key={selectedVideo.id} controls autoPlay playsInline preload="metadata" poster={`/showcase/${selectedVideo.id}.jpg`} onError={() => setVideoError(true)}><source src={`/showcase/${selectedVideo.id}.mp4`} type="video/mp4" />你的瀏覽器不支援影片播放。</video></div>{videoError && <p role="alert">影片暫時無法載入。請重開播放器，或使用下方連結直接開啟。</p>}<div className="lk-dialog-footer"><span>展示作品 · 含 AI 生成內容 · 影片內含中文字幕</span><a href={`/showcase/${selectedVideo.id}.mp4`} target="_blank" rel="noreferrer">直接開啟影片 <ArrowUpRight size={14} /></a></div></div>}
      </dialog>
    </div>
  );
}
