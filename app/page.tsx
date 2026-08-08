"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  BrainCircuit,
  Layers3,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import "./portfolio.css";

const ease = [0.16, 1, 0.3, 1] as const;

const projects = [
  {
    no: "01",
    eyebrow: "LIVE DIGITAL PRODUCT",
    title: "紫微斗數互動 App",
    description: "把命理知識、排盤演算法與內容體驗整合成大眾能直接使用的數位產品。",
    stat: "從專業知識走向可規模化服務",
    href: "https://ziwei-doushu-app.taiwanstore365.chatgpt.site/#schools",
    image: "/media/live-ziwei.png",
    tone: "copper",
    external: true,
  },
  {
    no: "02",
    eyebrow: "LIVE COMMERCE EXPERIENCE",
    title: "OMA Crystal",
    description: "以品牌敘事、精品影像與客製流程，建立水晶珠寶從探索到購買的完整體驗。",
    stat: "讓客製商品也能在線上被感受",
    href: "https://vitokok-lab.github.io/crystal/#landing-top",
    image: "/media/live-crystal.png",
    tone: "sand",
    external: true,
  },
  {
    no: "03",
    eyebrow: "DIRECT SELLING SYSTEM",
    title: "十代直銷獎金系統",
    description: "將十代組織關係、每代業績、獎金比例與每月結算整合在同一個管理畫面。",
    stat: "十代組織與獎金計算清楚透明",
    href: "#contact",
    image: "/media/live-virena-cover.png",
    tone: "ink",
    badge: "SYSTEM CONCEPT",
    cta: "了解系統設計",
  },
  {
    no: "04",
    eyebrow: "AI OPERATING SYSTEM",
    title: "AI 同事",
    description:
      "把散落在訂單、庫存與客服裡的資訊，整理成老闆每天真正需要決定的事。",
    stat: "5 分鐘掌握全公司",
    href: "/decisions",
    image: "/media/demo-decisions.png",
    tone: "copper",
    aiInsight: "今天只需要你決定 3 件事",
    aiReason: "其餘 47 項例行工作，AI 已經處理完成。",
    aiAction: "先處理主力電芯供應風險",
    aiMetric: "省下 1.5 小時",
  },
  {
    no: "05",
    eyebrow: "DECISION INTELLIGENCE",
    title: "決策儀表板",
    description:
      "不堆疊更多報表。AI 先找出異常、提出判斷，再把最後一哩留給人。",
    stat: "47 項例行工作自動完成",
    href: "/dashboard",
    image: "/media/demo-dashboard.png",
    tone: "sand",
    aiInsight: "本週營收成長 10%，但交期風險升高",
    aiReason: "AI 發現 2 張高價值工單可能延遲。",
    aiAction: "優先調整第二產線排程",
    aiMetric: "準時率 +8%",
  },
  {
    no: "06",
    eyebrow: "BUSINESS AUTOMATION",
    title: "智慧報價引擎",
    description:
      "從成本、毛利到建議售價，在幾秒內把經驗變成團隊可以複製的流程。",
    stat: "3 秒完成報價試算",
    href: "/quote",
    image: "/media/demo-quote.png",
    tone: "ink",
    aiInsight: "這張報價毛利低於安全線",
    aiReason: "依歷史成交與成本波動，25% 是較安全區間。",
    aiAction: "建議售價調整為 NT$1,860,000",
    aiMetric: "毛利 25%",
  },
  {
    no: "07",
    eyebrow: "ORDER OPERATIONS",
    title: "訂單與工單中樞",
    description: "把每張訂單的交期、站點與負責人集中管理，讓團隊不用再靠訊息追進度。",
    stat: "所有工單進度一眼掌握",
    href: "/orders",
    image: "/media/demo-orders.png",
    tone: "copper",
    aiInsight: "WO-2607-018 可能延遲 2 天",
    aiReason: "CNC 工序負載已超過本週可用產能。",
    aiAction: "改派第二產線",
    aiMetric: "追回 2 天",
  },
  {
    no: "08",
    eyebrow: "SMART INVENTORY",
    title: "智慧進銷存",
    description: "依銷售速度、安全庫存與交期提出補貨建議，提早看見缺貨與積貨風險。",
    stat: "補貨判斷從經驗變成系統",
    href: "/inventory",
    image: "/media/demo-inventory.png",
    tone: "sand",
    aiInsight: "電池模組 9 天後缺貨",
    aiReason: "目前銷售速度比近 30 日平均快 18%。",
    aiAction: "今天補貨 120 組",
    aiMetric: "避免停線 6 小時",
  },
  {
    no: "09",
    eyebrow: "AI STOCKTAKE",
    title: "AI 行動盤點",
    description: "現場快速輸入實際數量，AI 即時比對帳面差異並整理可能原因。",
    stat: "盤點差異即時完成分析",
    href: "/inventory/stocktake",
    image: "/media/demo-stocktake.png",
    tone: "ink",
    aiInsight: "差異不是遺失，可能是未入帳領料",
    aiReason: "3 筆領料紀錄與現場數量高度吻合。",
    aiAction: "核對 3 筆領料單",
    aiMetric: "差異縮小 82%",
  },
  {
    no: "10",
    eyebrow: "CUSTOMER SERVICE",
    title: "AI 客服工作台",
    description: "整合客戶訊息、訂單資訊與情緒判斷，常見問題自動處理，重要客訴即時轉交。",
    stat: "24 小時不漏接客戶需求",
    href: "/cs",
    image: "/media/demo-cs.png",
    tone: "copper",
    aiInsight: "這位客戶有流失風險",
    aiReason: "連續兩次詢問交期，情緒已轉為負面。",
    aiAction: "轉真人並提供補償方案",
    aiMetric: "挽回機率 76%",
  },
  {
    no: "11",
    eyebrow: "INDUSTRY INTELLIGENCE",
    title: "AI 產業雷達",
    description: "把大量產業資訊整理成事實、影響與建議，直接送進老闆的決策流程。",
    stat: "從看新聞變成採取行動",
    href: "/radar",
    image: "/media/demo-radar.png",
    tone: "sand",
    aiInsight: "原料價格可能在 14 天內上漲",
    aiReason: "3 個主要供應市場同時出現短缺訊號。",
    aiAction: "提前鎖定下一批原料",
    aiMetric: "預估節省 12%",
  },
  {
    no: "12",
    eyebrow: "PRODUCT DISCOVERY",
    title: "AI 選品助手",
    description: "綜合趨勢、毛利與供應風險，找出值得測試的商品候選並說明判斷理由。",
    stat: "把選品直覺轉成可驗證決策",
    href: "/picking",
    image: "/media/demo-picking.png",
    tone: "ink",
    aiInsight: "這款商品值得先小量測試",
    aiReason: "搜尋成長、毛利與退貨風險都落在安全區。",
    aiAction: "先上架 50 件測市場",
    aiMetric: "成功機率 81%",
  },
  {
    no: "13",
    eyebrow: "SYSTEM GOVERNANCE",
    title: "企業 AI 後台",
    description: "集中管理產業設定、功能開關、資料權限與 AI 成長紀錄，讓系統能被安全接手。",
    stat: "權限、模組與規則集中治理",
    href: "/admin",
    image: "/media/demo-admin.png",
    tone: "copper",
    aiInsight: "AI 已學會你的 6 條決策偏好",
    aiReason: "本月 85% 建議被採納，準確度持續提升。",
    aiAction: "套用至所有補貨決策",
    aiMetric: "採納率 85%",
  },
  {
    no: "14",
    eyebrow: "CUSTOMER EXPERIENCE",
    title: "客戶訂單追蹤",
    description: "客戶不用再反覆詢問，透過專屬頁面即時查看訂單進度、預計完成時間與狀態。",
    stat: "降低重複詢問，提升交付透明度",
    href: "/track/WO-2607-001",
    image: "/media/demo-tracking.png",
    tone: "sand",
    aiInsight: "客戶在問之前，AI 已主動通知",
    aiReason: "訂單進度、延遲原因與新交期已自動整理。",
    aiAction: "發送最新進度",
    aiMetric: "詢問量 -63%",
  },
];

const capabilities = [
  {
    icon: BrainCircuit,
    label: "STRATEGY",
    title: "商業策略",
    text: "先定義值得解的問題，再決定技術。讓每一個產品選擇，都能回到營收、效率與風險。",
  },
  {
    icon: Layers3,
    label: "PRODUCT",
    title: "產品設計",
    text: "把複雜流程收斂成直覺體驗。從第一個畫面到最後一個決策，都有清楚的使用理由。",
  },
  {
    icon: Sparkles,
    label: "AI SYSTEM",
    title: "AI 落地",
    text: "把資料、規則與人的判斷接起來，做成團隊每天真的會使用、也能持續進化的系統。",
  },
];

const testimonials = [
  {
    quote: "以前每天都在問進度，現在早上打開系統，就知道今天真正要決定什麼。",
    role: "製造業負責人",
    context: "製造業 · AI 營運決策",
    number: "01",
  },
  {
    quote: "它沒有丟給我更多報表，而是直接告訴我哪裡有問題、下一步可以怎麼做。",
    role: "零售品牌營運主管",
    context: "零售業 · 老闆營運管理",
    number: "02",
  },
  {
    quote: "最有感的不是 AI 會回答，而是它真的記得流程，還能把事情一路追到完成。",
    role: "電商團隊經理",
    context: "電商業 · AI 工作流程",
    number: "03",
  },
  {
    quote: "原本只有資深同事會做的判斷，現在新人也能照著建議快速完成。",
    role: "中小企業營運者",
    context: "中小企業 · 智慧報價",
    number: "04",
  },
];

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="portfolio-shell">
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="wordmark" href="#top" aria-label="LUXKEY 首頁" onClick={closeMenu}>
          LUXKEY<span>.</span>
        </a>
        <nav className="desktop-nav" aria-label="主要導覽">
          <a href="#work">精選作品</a>
          <a href="#approach">工作方法</a>
          <a href="#about">關於我</a>
        </nav>
        <a className="nav-cta" href="#contact">
          開始一段對話 <ArrowUpRight size={16} />
        </a>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "關閉選單" : "開啟選單"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="mobile-nav"
              aria-label="行動版導覽"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease }}
            >
              <a href="#work" onClick={closeMenu}>精選作品</a>
              <a href="#approach" onClick={closeMenu}>工作方法</a>
              <a href="#about" onClick={closeMenu}>關於我</a>
              <a href="#contact" onClick={closeMenu}>開始一段對話</a>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <motion.div
            className="hero-kicker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span /> LUXKEY · AI OPERATING PARTNER
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease }}
          >
            讓複雜，<em>開始有秩序。</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
          >
            把混亂的資訊、流程與判斷交給 AI，<br />讓人專注在真正重要的決策。
          </motion.p>
        </div>

        <motion.div
          className="hero-film"
          initial={{ opacity: 0, y: 30, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.25, ease }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/media/vito-data-tornado-poster.jpg"
            aria-hidden="true"
          >
            <source src="/media/vito-data-tornado.mp4" type="video/mp4" />
          </video>
          <div className="film-shade" aria-hidden="true" />
          <div className="film-topline">
            <span>BUSINESS × PRODUCT × AI</span>
            <span>TAIWAN · 2026</span>
          </div>
          <div className="film-caption">
            <span>AI 不增加更多工作。</span>
            <strong>它讓工作自己完成。</strong>
          </div>
          <a className="round-link" href="#about" aria-label="繼續往下閱讀">
            <ArrowDown />
          </a>
        </motion.div>
      </section>

      <section className="statement section-pad" id="about">
        <Reveal className="section-label">ABOUT VITO</Reveal>
        <Reveal delay={0.08}>
          <p className="statement-copy">
            技術從來不是目的。真正重要的是，<em>看懂問題的本質</em>，把人、流程與商業目標放回同一張圖上。
          </p>
        </Reveal>
        <Reveal delay={0.16} className="statement-meta">
          <p>商業顧問 · 產品策劃 · AI 實作者</p>
          <p>BASED IN TAIWAN · WORKING EVERYWHERE</p>
        </Reveal>
      </section>

      <section className="work section-pad" id="work">
        <div className="section-heading">
          <Reveal>
            <span className="section-label">SELECTED WORK</span>
            <h2>作品不是展示，<br />是解題的證明。</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p>每一個專案都從一個真實的商業問題開始，最後成為一個能被操作、驗證與持續迭代的系統。</p>
          </Reveal>
        </div>

        <div className="project-list">
          {projects.map((project, index) => (
            <Reveal key={project.no} delay={index * 0.06}>
              <Link
                className={`project-card ${project.tone}`}
                href={project.href}
                target={project.external ? "_blank" : undefined}
                rel={project.external ? "noreferrer" : undefined}
              >
                <div className="project-visual">
                  {project.aiInsight ? (
                    <div className="ai-cover">
                      <div className="ai-cover-status">
                        <span className="ai-signal"><Sparkles size={16} /></span>
                        <strong>AI 已完成分析</strong>
                        <em>即時</em>
                      </div>
                      <div className="ai-cover-body">
                        <small>AI 發現</small>
                        <h4>{project.aiInsight}</h4>
                        <p>{project.aiReason}</p>
                      </div>
                      <div className="ai-cover-action">
                        <div>
                          <small>建議你現在</small>
                          <strong>{project.aiAction}</strong>
                        </div>
                        <div className="ai-cover-metric">
                          <b>{project.aiMetric}</b>
                          <span>預期影響</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img src={project.image} alt={`${project.title} Demo 系統畫面`} />
                  )}
                  <span className="demo-badge">{project.badge ?? (project.external ? "LIVE SITE" : "LIVE DEMO")}</span>
                </div>
                <div className="project-content">
                  <div className="project-meta">
                    <span>{project.no}</span>
                    <span>{project.eyebrow}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-result">
                    <small>DESIGNED OUTCOME</small>
                    <strong>{project.stat}</strong>
                  </div>
                  <div className="project-link">
                    {project.cta ?? (project.external ? "前往正式網站" : "操作完整 Demo")} <ArrowUpRight size={18} />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="approach section-pad" id="approach">
        <Reveal className="approach-intro">
          <span className="section-label">HOW I WORK</span>
          <h2>從策略，到落地。<br />少一點術語，多一點結果。</h2>
        </Reveal>
        <div className="capability-grid">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.label} delay={index * 0.08} className="capability-card">
                <div className="capability-top">
                  <Icon size={24} strokeWidth={1.4} />
                  <span>0{index + 1}</span>
                </div>
                <small>{item.label}</small>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section
        className="feedback section-pad"
        aria-labelledby="feedback-title"
      >
        <div className="feedback-head">
          <span className="section-label">USER VOICES</span>
          <p>不是功能比較多，<br />而是每天少做一點沒必要的事。</p>
        </div>
        <h2 id="feedback-title">他們說，工作開始<br />變得不一樣。</h2>
        <div className="bubble-field">
          {testimonials.map((item, index) => (
            <motion.article
              className={`feedback-bubble bubble-${index + 1}`}
              key={item.number}
              initial={{ opacity: 0, y: 34, scale: .95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: .65, delay: index * .13, ease }}
            >
              <div className={`avatar-crop avatar-${index + 1}`} aria-hidden="true">
                <img src="/media/feedback-avatars.png" alt="" />
              </div>
              <div className="chat-bubble">
                <p>{item.quote}</p>
                <footer>
                  <strong>{item.role}</strong>
                  <span>{item.context}</span>
                </footer>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="principle">
        <Reveal>
          <p>“ 好的 AI 不是取代人，<br />而是讓人把時間留給真正重要的判斷。 ”</p>
        </Reveal>
      </section>

      <section className="contact section-pad" id="contact">
        <div className="contact-grid">
          <Reveal>
            <span className="section-label">LET&apos;S BUILD SOMETHING USEFUL</span>
            <h2>有一個值得<br />被解決的問題？</h2>
          </Reveal>
          <Reveal delay={0.1} className="contact-side">
            <p>不需要先整理成完整需求。告訴我現在最卡、最花時間，或一直需要你親自處理的那件事。</p>
            <a href="https://luxkey.com.tw/#contact" target="_blank" rel="noreferrer">
              和我談談 <ArrowUpRight />
            </a>
          </Reveal>
        </div>
        <footer>
          <a className="wordmark" href="#top">LUXKEY<span>.</span></a>
          <p>© 2026 LUXKEY. ALL RIGHTS RESERVED.</p>
          <a href="#top">BACK TO TOP ↑</a>
        </footer>
      </section>
    </main>
  );
}
