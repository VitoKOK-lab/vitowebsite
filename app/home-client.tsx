"use client";

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ArrowDown, Check, CheckCheck, ChevronDown, ChevronRight, CirclePlay, Clapperboard, Copy, FileText, LayoutDashboard, Mail, Menu, MessageCircle, Play, Plus, Send, ShieldCheck, Sparkles, Workflow, X, WandSparkles, Lightbulb, Handshake, CalendarDays, Bot, Clock3, Layers3 } from 'lucide-react';
import { buildBrief, estimateCapacity, industries, servicePlans, type ServiceKey } from '@/lib/marketing';
import './portfolio.css';
import ServiceShop, { TeamComparison } from './service-shop';

const videos = [
  { id: 'ai-product-ad', title: '讓產品，走進真實情境。', label: 'AI 情境廣告', duration: '00:28', source: 'MC-001', description: '人物情境、產品訴求、字幕與動態資訊，整合成一支直式廣告。', tags: ['情境腳本', 'AI 人物', '動態字幕'], portrait: true },
  { id: 'ai-lifestyle-ad', title: '賣的不是規格，是生活。', label: 'AI 生活感短片', duration: '00:24', source: 'MC-002', description: '把產品功能翻成消費者聽得懂的生活故事，適合社群與短影音版位。', tags: ['生活敘事', '產品溝通', '社群短片'], portrait: true },
  { id: 'ai-brand-presenter', title: '你的品牌，也能有自己的 IP。', label: 'AI 品牌角色', duration: '00:36', source: 'LAB-IP-001', description: '以固定角色、口吻與視覺模板，建立可持續更新的品牌內容系列。', tags: ['品牌角色', '解說配音', '系列內容'], portrait: true },
  { id: 'ai-course', title: '把專業，變成可以播放的課。', label: 'AI 知識內容', duration: '01:42', source: 'lesson-05-16x9', description: '將知識拆成清楚的段落，搭配旁白、字幕與畫面，製作課程與教學內容。', tags: ['課程製作', '圖文解說', '知識產品'], portrait: false },
] as const;
type Video = typeof videos[number];
const visualExamples = [
  { id: 'coffee', title: '讓人想走進店裡的一杯。', label: '餐飲新品宣傳', copy: '咖啡、甜點、季節新品，先用畫面勾起想吃、想喝的心情。' },
  { id: 'skincare', title: '把產品質感，拍進第一眼。', label: '美妝產品廣告', copy: '用材質、光線與生活情境，呈現產品的品牌風格。' },
  { id: 'retail', title: '讓新品，像店長親自介紹。', label: '服飾社群內容', copy: '從商品介紹到穿搭主題，規劃可以持續更新的內容系列。' },
  { id: 'factory', title: '專業產品，也能說得好懂。', label: 'B2B 產品解說', copy: '把製程、零件與應用場景，整理成客戶理解的產品故事。' },
  { id: 'course', title: '把你的經驗，變成一堂課。', label: '知識課程企劃', copy: '從課程主題、講師畫面到教學腳本，讓專業更容易傳達。' },
];
const demos = [
  { key: 'content', label: '雲端 AI 小編', icon: MessageCircle, title: '下週的內容，先幫你準備好了。', subtitle: '一個新品主題，延伸成整週的社群內容。', input: '下週推出夏季冷萃，想讓附近的上班族來試喝。', output: '把「上班很累」變成品牌能接住的日常。', steps: ['整理產品與客群', '安排一週主題', '產出文案與腳本', '等你確認再排程'], rows: [['MON', '新品亮相', '週一的清醒，交給這一杯。'], ['WED', '情境短片', '下午三點，把狀態找回來。'], ['FRI', '到店邀請', '這週辛苦了，來喝一杯。']], result: '3 則社群企劃 + 1 支短影音腳本', action: '把這套小編帶進公司' },
  { key: 'video', label: '自動剪輯師', icon: Clapperboard, title: '拍一次，讓內容多用幾次。', subtitle: '把原始素材拆成不同目的與平台的版本。', input: '我有一支產品介紹長片，想做成 IG、Reels 和 YouTube 內容。', output: '先找出最吸引人的一句，再安排畫面。', steps: ['辨識重點段落', '整理開場鉤子', '字幕與版型套用', '預覽後再輸出'], rows: [['9:16', '社群短版', '先用一個痛點，抓住注意力。'], ['1:1', '動態貼文', '放大產品亮點，保留清楚字幕。'], ['16:9', '完整介紹', '把故事說完整，帶到行動邀請。']], result: '一份素材 → 多比例、不同訴求的版本', action: '聊聊我的影片需求' },
  { key: 'operations', label: 'AI 營運助理', icon: LayoutDashboard, title: '先整理好，再交給你做決定。', subtitle: '把散落的資訊整理成今天的優先順序。', input: '訂單在 Excel、進度在 LINE，每天都要問同事才知道做到哪。', output: '今天先看這三件事，其餘進度已整理。', steps: ['整合既有資料', '比對進度與規則', '整理異常摘要', '重要動作由你確認'], rows: [['01', '交期提醒', '兩筆訂單需要確認出貨安排。'], ['02', '補貨建議', '主力品項接近設定的安全庫存。'], ['03', '日報整理', '把今日進度彙整成一頁摘要。']], result: '一份重點摘要 + 可追蹤的待辦清單', action: '找出我能省下的工作' },
] as const;
const faqs = [
  ['五倍行銷部包含哪些服務？', '從找題目、寫文案、做圖，到拍攝或生成影片、短影音、數位人、社群經營、廣告投放、網站與流程自動化，都能由一個窗口規劃。先依目標選擇月包或專案，交付數量、拍攝、廣告代操、媒體預算、工具與維護費分別確認；五倍是整合多種專長的品牌定位，實際產能依約定範圍與素材條件而定。'],
  ['拋棄式軟體是什麼？15 萬包含什麼？', '是為單次活動或專案打造的工具，結案後可依約匯出資料並停用服務。15 萬起的首版會先限定功能與驗收範圍，與 200 萬完整系統的預算假設並非同規格比較。實際報價、稅費、第三方工具、主機與後續維護另於提案確認，且不包含在月度團隊服務內。'],
  ['10 倍效率是保證嗎？', '10 倍是用來挑選高重複流程的改善目標。導入前先記錄原本工時，導入後以相同任務驗證；實際幅度取決於資料品質、串接限制與人工審核需求。'],
  ['每月一位小編的預算，能請 AI 團隊做哪些事？', '依你的月度目標，組合行銷企劃、社群內容、影片剪輯、營運自動化與商業策略。每月先確認優先任務與交付清單，再持續製作、回顧與調整。實際月費、內容數量、影片長度、串接與工具費，會在提案中確認。'],
  ['我不懂 AI，也沒有工程師，可以開始嗎？', '可以。先告訴我們你現在怎麼做事、哪裡最花時間。我們會把需求整理成清楚的交付項目，從一條流程或一份內容開始，並提供操作教學。'],
  ['真的能降低成本？費用怎麼算？', '以月度目標與工作量規劃合作，讓一份預算能使用多種 AI 專長。提案會列出月費、交付範圍，以及另計的串接、工具訂閱或維護費。網站試算的是可釋出工時的價值，尚未扣除這些費用。'],
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
          {[['服務與收費', '#services'], ['看交付作品', '#work'], ['專案軟體', '#software'], ['合作方式', '#process']].map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a href="#start" className="lk-nav-mobile-cta" onClick={() => setMenuOpen(false)}>聊聊你的需求 <ArrowUpRight size={16} /></a>
        </nav>
        <a className="lk-header-cta" href="#start">讓 AI 開始上工 <ArrowUpRight size={16} /></a>
        <button className="lk-menu-toggle" ref={menuButton} aria-label={menuOpen ? '關閉選單' : '開啟選單'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>
      <main id="main">
        <section className="lk-cinema" aria-labelledby="hero-title">
          <img className="lk-cinema-image" src="/heroes/sunny-team-1774.webp" srcSet="/heroes/sunny-team-900.webp 900w, /heroes/sunny-team-1774.webp 1774w" sizes="100vw" alt="AI 生成情境：老闆與團隊確認社群配圖，桌上展示產品拍攝與影片剪輯" width="1774" height="887" fetchPriority="high" />
          <div className="lk-cinema-shade" />
          <div className="lk-container lk-cinema-content">
            <div className="lk-eyebrow"><span className="lk-dot" /> YOUR FIVEFOLD MARKETING DEPARTMENT</div>
            <h1 id="hero-title">中小企業的<br /><em>五倍行銷部。</em></h1>
            <p className="lk-cinema-lead">一個人的成本，五個人的產能。</p>
            <p className="lk-cinema-body">小編、設計、剪輯、廣告、工程，一個窗口幫你整合。<br />把曝光變客戶，再變訂單，讓生意持續運轉。</p>
            <div className="lk-hero-actions"><a className="lk-button lk-button-primary" href="#services">看看五倍行銷方案 <ArrowUpRight size={19} /></a><a className="lk-text-link" href="#software">看看專案軟體 <ArrowDown size={18} /></a></div>
          </div>
          <div className="lk-cinema-bottom lk-container"><span>內容 × 影音 × 廣告 × 網站 × 自動化</span><a href="#work"><CirclePlay size={19} /> 看 AI 交付作品</a><small>AI 生成情境示意</small></div>
        </section>

        <ServiceShop outcomeVisuals onChoose={(key, summary) => { setDetails(summary); chooseService(key); }} />
        <TeamComparison />
        <section className="lk-growth lk-container" id="growth" aria-labelledby="growth-title">
          <div className="lk-eyebrow">ONE TEAM / 從曝光到訂單，一個窗口接起來</div>
          <h2 id="growth-title">你專心做生意，<br /><em>我們讓行銷持續運轉。</em></h2>
          <p className="lk-growth-lead">原本要找小編、設計、剪輯、廣告手、工程師。<br />現在，把目標交給 LUXKEY，從內容到系統一起規劃。</p>
          <div className="lk-growth-steps">{[
            { title: '讓客戶看見你', label: '01 / 曝光', copy: '找題目、寫文案、做圖、拍攝或生成影片、剪短影音、做數位人。', result: '有主題、有畫面、有內容' },
            { title: '把興趣變詢問', label: '02 / 客戶', copy: '經營社群、投放廣告、製作網站與銷售頁，讓有興趣的人找到聯絡入口。', result: '從看見，到主動找你' },
            { title: '把商機往前推', label: '03 / 訂單', copy: '整理名單、設定跟進提醒、串接報價與訂單流程，讓每個機會有下一步。', result: '有紀錄、有跟進、有回應' },
            { title: '讓有效的方法重複跑', label: '04 / 自動化', copy: '接起能自動化的流程，搭配排程、報表與異常提醒，持續檢查、持續調整。', result: '重複工作交給系統' },
          ].map(item => <article key={item.label}><span>{item.label}</span><h3>{item.title}</h3><p>{item.copy}</p><strong>{item.result}<ArrowRight size={17} /></strong></article>)}</div>
          <p className="lk-shop-note">依需求組合服務；拍攝、數位人、廣告代操、媒體預算、網站與自動化另按範圍估價。重要內容與對外動作依授權確認。</p>
          <a className="lk-button lk-button-primary" href="https://lin.ee/rL0q31t" target="_blank" rel="noreferrer">聊聊你的行銷目標 <ArrowUpRight size={18} /></a>
        </section>

        <section className="lk-software" id="software" aria-labelledby="software-title">
          <div className="lk-software-visual">
            <img src="/heroes/enterprise-command-1774.webp" srcSet="/heroes/enterprise-command-900.webp 900w, /heroes/enterprise-command-1774.webp 1774w" sizes="100vw" alt="AI 概念示意：大型桌機展示跨據點營運、營收預測、庫存、專案甘特圖與 AI 異常提醒" width="1774" height="887" loading="lazy" />
            <div className="lk-container lk-software-image-copy"><div className="lk-eyebrow">BUILT FOR THE PROJECT.</div><h2 id="software-title">200萬的大型軟體，<br /><span>你也能快速擁有</span></h2><p>拋棄式的訂製軟體？專案結束就送人，<br />快速上線、快速去賺錢</p><div className="lk-scene-labels"><span><Check size={14} /> 跨據點營運</span><span><Check size={14} /> 庫存與專案整合</span><span><Check size={14} /> AI 異常提醒</span></div></div>
            <small className="lk-image-caption">企業系統概念示意 · 模擬資料 · 功能依專案範圍規劃</small>
          </div>
          <div className="lk-container lk-software-details">
            <div className="lk-software-pitch"><div className="lk-eyebrow"><span>PROJECT SOFTWARE /</span> 專案型軟體</div><h3>你以為要 200 萬，<br />我們先談 15 萬怎麼做。</h3><p>活動報名、專案管理、資料整合、報價工具。把大型系統的需求，拆成這個專案真正會用到的功能；快速做出能操作、能驗收的版本。</p><button className="lk-button lk-button-primary" onClick={() => chooseService('software')}>評估我的 15 萬專案 <ArrowUpRight size={18} /></button></div>
            <div className="lk-project-offer"><span className="lk-micro-label">縮小範圍，放大專案效益 / 提案情境</span><div className="lk-project-price"><div><small>完整系統預算假設</small><span className="lk-old-price">200<small>萬</small></span></div><ArrowRight size={27} /><div><small>聚焦本案的首版</small><strong>15<small>萬起</small></strong></div></div><div className="lk-project-speed"><strong>10×</strong><p>以 10 倍效率為目標<small>先量出原本工時，再驗證改善幅度。</small></p></div><p className="lk-project-terms">新臺幣計價，專案另行報價。以上為不同交付範圍的規劃情境，非同規格價格比較；功能、稅費、串接、主機與維護費於提案確認。實際效率依流程與資料條件驗收。</p></div>
          </div>
          <div className="lk-container lk-project-lifecycle"><div><span>01 / BUILD</span><h4>只做這次要用的。</h4><p>先定功能、交期與驗收標準，讓預算集中在本案。</p></div><div><span>02 / RUN</span><h4>上線就讓它工作。</h4><p>接上資料與流程，完成教學，把重複操作交給系統。</p></div><div><span>03 / EXPORT</span><h4>專案結束，資料帶走。</h4><p>依約匯出資料、停用服務；要留用，再談維護或擴充。</p></div></div>
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
          <div className="lk-visual-examples"><div className="lk-visual-examples-heading"><div><span className="lk-eyebrow">MORE POSSIBILITIES / 更多產業情境</span><h3>你的生意，也能有這樣的畫面。</h3></div><p>五種 AI 影音企劃方向，先看視覺示意。</p></div><div className="lk-example-grid">{visualExamples.map(item => <article key={item.id}><div className="lk-example-photo"><img src={`/showcase/${item.id}-concept.webp`} alt={`${item.label}：${item.title}，AI 生成圖片`} width="720" height="900" loading="lazy" /><span>AI 圖片示意</span></div><div className="lk-example-copy"><small>{item.label}</small><h4>{item.title}</h4><p>{item.copy}</p><button className="lk-text-link" onClick={() => { setDetails(`想製作「${item.label}」方向的內容，請協助評估素材、影片規格與報價。`); chooseService('video'); }}>我也想做這種內容 <ArrowUpRight size={16} /></button></div></article>)}</div><p className="lk-shop-note">以上為新製作的 AI 視覺概念，並非可播放影片或客戶實績；實際商品外觀、人物與影片規格需另行確認。</p></div>
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

        <section className="lk-section lk-container" id="process"><SectionHeading number="05" label="START SMALL. MOVE FAST." description="每月有目標、有交付、有回顧。從最值得做的事情開始，讓 AI 團隊持續跟著你的生意前進。">每個月，<br /><span className="lk-muted-heading">都讓生意往前一步。</span></SectionHeading>
          <div className="lk-process-grid">{[{ title: '定本月目標', text: '想增加詢問、讓內容穩定上線，還是省下例行工作？先抓最重要的一件事。', deliverable: '月度目標與優先順序' }, { title: '排交付清單', text: '組合這個月需要的 AI 專長，談清楚月費、工作量、交期與修改範圍。', deliverable: '月費、範圍、交付節點' }, { title: '快速看首版', text: '先看內容、影片、網站或流程的第一版，確認方向後持續推進。', deliverable: '首版與當月交付成果' }, { title: '每月再進步', text: '一起回顧成果，調整內容與工作優先順序，把有效的方法持續放大。', deliverable: '月度回顧與下月計畫' }].map((step, i) => <article key={step.title}><div className="lk-process-num">0{i + 1}<ArrowRight size={20} /></div><h3>{step.title}</h3><p>{step.text}</p><span><Check size={14} />{step.deliverable}</span></article>)}</div>
          <div className="lk-about-strip"><Wordmark /><p>把複雜的事，做成有價值的系統。</p><span>商業策略 × 產品設計 × AI 落地</span></div>
        </section>

        <section className="lk-faq-section lk-container"><div><span className="lk-eyebrow">BEFORE WE START</span><h2>老闆常問的，<br />先幫你回答。</h2><a href="https://lin.ee/rL0q31t" target="_blank" rel="noreferrer" className="lk-text-link">還有問題？LINE 直接聊 <ArrowUpRight size={17} /></a></div><div className="lk-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={19} /></summary><p>{answer}</p></details>)}</div></section>

        <section className="lk-start-section" id="start"><div className="lk-container lk-start-grid"><div className="lk-start-copy"><div className="lk-eyebrow"><span className="lk-dot" /> LET'S MAKE IT WORK</div><h2>這個月，<br /><em>讓 AI 上工。</em></h2><p>告訴我們這個月最想完成的事，<br />讓你的五倍行銷部開始運作。</p><a href="https://lin.ee/rL0q31t" target="_blank" rel="noreferrer" className="lk-direct-contact"><MessageCircle size={20} /><span>不想填？LINE 直接聊<small>告訴我們，你最想解決哪件事。</small></span><ArrowUpRight size={22} /></a></div>
          <div className="lk-brief-builder"><div className="lk-form-heading"><span>{service === 'software' ? '你的專案軟體需求' : '你的 AI 月度合作計畫'}</span><small>選擇需求，即時整理</small></div><div className="lk-field-row"><label>你的產業<select value={industry} onChange={e => setIndustry(e.target.value)}>{industries.map(item => <option key={item}>{item}</option>)}</select></label><label>最想先做什麼<select value={service} onChange={e => setService(e.target.value as ServiceKey)}>{Object.entries(servicePlans).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label></div>
            <div className="lk-plan-result" aria-live="polite"><span><Sparkles size={15} /> 建議從這裡開始</span><h3>{plan.first}</h3><ul>{plan.deliverables.map(item => <li key={item}><Check size={15} />{item}</li>)}</ul><p><strong>可以先準備：</strong>{plan.input}</p></div>
            <label className="lk-details-label" htmlFor="brief-details">這個月，最想完成什麼？<span>選填</span></label><textarea id="brief-details" maxLength={1200} rows={3} value={details} onChange={e => setDetails(e.target.value)} placeholder="例如：想增加客戶詢問，每週需要貼文與短影音。" />
            <div className="lk-brief-actions"><button className="lk-button lk-button-primary" onClick={copyBrief}>{copied ? <CheckCheck size={17} /> : <Copy size={17} />}{copied ? '需求已複製' : '複製需求，帶去聊聊'}</button><a className="lk-button lk-button-outline" href="https://lin.ee/rL0q31t" target="_blank" rel="noreferrer">開啟 LINE <ArrowUpRight size={17} /></a></div>
            <div role="status" className="lk-copy-status">{copied ? '已複製。開啟 LINE 後貼上，就能接著討論。' : copyError ? '瀏覽器不允許複製，請展開需求摘要手動複製，或改用 Email。' : '內容只在你的瀏覽器整理；開啟 LINE 後貼上，再由你送出。'}</div>
            <details className="lk-brief-preview" open={copyError || contactOpen} onToggle={e => setContactOpen(e.currentTarget.open)}><summary>查看完整需求摘要 <ChevronDown size={15} /></summary><pre tabIndex={0}>{brief}</pre></details>
            <a className="lk-email-link" href={`mailto:luxkey.tw@gmail.com?subject=${encodeURIComponent(`AI 合作需求｜${plan.label}`)}&body=${encodeURIComponent(brief)}`}><Mail size={16} /> 或用 Email 帶著需求聯絡我們 <ArrowUpRight size={15} /></a>
          </div></div></section>
      </main>
      <footer className="lk-footer lk-container"><div className="lk-footer-main"><a href="#top" aria-label="LUXKEY 回到頁首"><Wordmark /></a><div><strong>金曜石國際股份有限公司</strong><address>臺北市信義區信義路四段458號6樓</address></div><a href="mailto:luxkey.tw@gmail.com">luxkey.tw@gmail.com <ArrowUpRight size={16} /></a><a href="#top" className="lk-back-top">回到頂端 <ArrowUpRight size={16} /></a></div><div className="lk-footer-bottom"><span>© {new Date().getFullYear()} LUXKEY. ALL RIGHTS RESERVED.</span><span>中小企業的五倍行銷部。</span><a href="/privacy/">隱私說明</a></div></footer>
      <dialog className="lk-video-dialog" ref={dialog} onClose={closeVideo} onClick={e => { if (e.target === e.currentTarget) closeVideo(); }} aria-labelledby="video-title">
        {selectedVideo && <div className="lk-video-dialog-content"><div className="lk-dialog-header"><div><span>{selectedVideo.label}</span><h2 id="video-title">{selectedVideo.title}</h2></div><button autoFocus onClick={closeVideo} aria-label="關閉影片"><X size={23} /></button></div><div className={`lk-dialog-player ${selectedVideo.portrait ? 'is-portrait' : ''}`}><video ref={videoRef} key={selectedVideo.id} controls autoPlay playsInline preload="metadata" poster={`/showcase/${selectedVideo.id}.jpg`} onError={() => setVideoError(true)}><source src={`/showcase/${selectedVideo.id}.mp4`} type="video/mp4" />你的瀏覽器不支援影片播放。</video></div>{videoError && <p role="alert">影片暫時無法載入。請重開播放器，或使用下方連結直接開啟。</p>}<div className="lk-dialog-footer"><span>展示作品 · 含 AI 生成內容 · 影片內含中文字幕</span><a href={`/showcase/${selectedVideo.id}.mp4`} target="_blank" rel="noreferrer">直接開啟影片 <ArrowUpRight size={14} /></a></div></div>}
      </dialog>
    </div>
  );
}
