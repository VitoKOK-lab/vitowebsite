"use client";

import { useEffect, useState } from "react";
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
    image: "/media/company-04-manufacturing.png",
    tone: "copper",
    aiInsight: "今天只需要你決定 3 件事",
    aiReason: "AI 已整理訂單、庫存與客服訊息，並依影響程度排好順序。",
    aiAction: "先處理主力電芯供應風險",
    aiMetric: "省下 1.5 小時",
    aiTime: "今天 08:30",
    aiVariant: "brief",
    aiDetails: ["供應商交期增加 4 天", "現有庫存可支撐 12 天", "本週共有 3 件事需要確認"],
  },
  {
    no: "05",
    eyebrow: "DECISION INTELLIGENCE",
    title: "決策儀表板",
    description:
      "AI 主動找出異常、提出判斷，再把關鍵決定交到你手上。",
    stat: "47 項例行工作自動完成",
    href: "/dashboard",
    image: "/media/company-05-hospitality.png",
    tone: "sand",
    aiInsight: "本週營收成長 10%，現在優先守住交期",
    aiReason: "AI 比對產能與工單進度，找到 2 張需要提前安排的高價值訂單。",
    aiAction: "優先調整第二產線排程",
    aiMetric: "準時率 +8%",
    aiTime: "週一 09:12",
    aiVariant: "timeline",
    aiDetails: ["本週營收 NT$428 萬", "第二產線週三可釋出 6 小時", "兩張訂單合計 NT$86 萬"],
  },
  {
    no: "06",
    eyebrow: "BUSINESS AUTOMATION",
    title: "智慧報價引擎",
    description:
      "從成本、毛利到建議售價，在幾秒內把經驗變成團隊可以複製的流程。",
    stat: "3 秒完成報價試算",
    href: "/quote",
    image: "/media/company-06-quotation.png",
    tone: "ink",
    aiInsight: "把這張報價調到 25% 毛利，成交更健康",
    aiReason: "AI 綜合近 18 筆成交紀錄、材料成本與客戶價格接受度完成試算。",
    aiAction: "建議售價調整為 NT$1,860,000",
    aiMetric: "毛利 25%",
    aiTime: "報價前 3 分鐘",
    aiVariant: "quote",
    aiDetails: ["材料成本本月增加 6.2%", "相似案件成交區間 24–28%", "客戶預算仍有 8% 空間"],
  },
  {
    no: "07",
    eyebrow: "ORDER OPERATIONS",
    title: "訂單與工單中樞",
    description: "把每張訂單的交期、站點與負責人集中管理，團隊打開畫面就能掌握進度。",
    stat: "所有工單進度一眼掌握",
    href: "/orders",
    image: "/media/company-07-orders.png",
    tone: "copper",
    aiInsight: "WO-2607-018 可能延遲 2 天",
    aiReason: "CNC 工序負載已超過本週可用產能。",
    aiAction: "改派第二產線",
    aiMetric: "追回 2 天",
    aiTime: "今天 10:45",
    aiVariant: "production",
    aiDetails: ["原交期 8/16", "第二產線 14:00 可開工", "陳組長目前可接手"],
  },
  {
    no: "08",
    eyebrow: "SMART INVENTORY",
    title: "智慧進銷存",
    description: "依銷售速度、安全庫存與交期提出補貨建議，提早看見缺貨與積貨風險。",
    stat: "補貨判斷從經驗變成系統",
    href: "/inventory",
    image: "/media/company-08-retail.png",
    tone: "sand",
    aiInsight: "電池模組 9 天後缺貨",
    aiReason: "目前銷售速度比近 30 日平均快 18%。",
    aiAction: "今天補貨 120 組",
    aiMetric: "避免停線 6 小時",
    aiTime: "今天 11:20",
    aiVariant: "inventory",
    aiDetails: ["現有庫存 84 組", "每日平均使用 9.3 組", "供應商交期 7 天"],
  },
  {
    no: "09",
    eyebrow: "AI STOCKTAKE",
    title: "AI 行動盤點",
    description: "現場快速輸入實際數量，AI 即時比對帳面差異並整理可能原因。",
    stat: "盤點差異即時完成分析",
    href: "/inventory/stocktake",
    image: "/media/company-09-stocktake.png",
    tone: "ink",
    aiInsight: "3 筆領料紀錄可以解釋這次盤點差異",
    aiReason: "AI 已把現場數量、領料時間與工單用量逐筆配對。",
    aiAction: "核對 3 筆領料單",
    aiMetric: "差異縮小 82%",
    aiTime: "盤點後 8 秒",
    aiVariant: "scan",
    aiDetails: ["A 區差異 12 件", "工單 018 領用 8 件", "工單 021 領用 2 件"],
  },
  {
    no: "10",
    eyebrow: "CUSTOMER SERVICE",
    title: "AI 客服工作台",
    description: "整合客戶訊息、訂單資訊與情緒判斷，常見問題自動處理，重要客訴即時轉交。",
    stat: "24 小時完整接住客戶需求",
    href: "/cs",
    image: "/media/company-10-support.png",
    tone: "copper",
    aiInsight: "這位客戶有流失風險",
    aiReason: "連續兩次詢問交期，情緒已轉為負面。",
    aiAction: "轉真人並提供補償方案",
    aiMetric: "挽回機率 76%",
    aiTime: "剛剛 14:36",
    aiVariant: "chat",
    aiDetails: ["客戶今天第 2 次詢問", "訂單預計延後 1 天", "過去 12 個月消費 NT$32 萬"],
  },
  {
    no: "11",
    eyebrow: "INDUSTRY INTELLIGENCE",
    title: "AI 產業雷達",
    description: "把大量產業資訊整理成事實、影響與建議，直接送進老闆的決策流程。",
    stat: "從看新聞變成採取行動",
    href: "/radar",
    image: "/media/company-11-radar.png",
    tone: "sand",
    aiInsight: "原料價格可能在 14 天內上漲",
    aiReason: "3 個主要供應市場同時出現短缺訊號。",
    aiAction: "提前鎖定下一批原料",
    aiMetric: "預估節省 12%",
    aiTime: "今天 07:50 更新",
    aiVariant: "radar",
    aiDetails: ["越南出口量減少 14%", "同業詢價量增加 22%", "目前價格仍在採購區間"],
  },
  {
    no: "12",
    eyebrow: "PRODUCT DISCOVERY",
    title: "AI 選品助手",
    description: "綜合趨勢、毛利與供應風險，找出值得測試的商品候選並說明判斷理由。",
    stat: "把選品直覺轉成可驗證決策",
    href: "/picking",
    image: "/media/company-12-products.png",
    tone: "ink",
    aiInsight: "這款商品值得先小量測試",
    aiReason: "搜尋成長、毛利與退貨風險都落在安全區。",
    aiAction: "先上架 50 件測市場",
    aiMetric: "成功機率 81%",
    aiTime: "趨勢更新 16:10",
    aiVariant: "product",
    aiDetails: ["近 30 日搜尋量 +38%", "預估毛利 41%", "同類商品退貨率 3.8%"],
  },
  {
    no: "13",
    eyebrow: "SYSTEM GOVERNANCE",
    title: "企業 AI 後台",
    description: "集中管理產業設定、功能開關、資料權限與 AI 成長紀錄，讓系統能被安全接手。",
    stat: "權限、模組與規則集中治理",
    href: "/admin",
    image: "/media/company-13-energy.png",
    tone: "copper",
    aiInsight: "AI 已學會你的 6 條決策偏好",
    aiReason: "本月 85% 建議被採納，準確度持續提升。",
    aiAction: "套用至所有補貨決策",
    aiMetric: "採納率 85%",
    aiTime: "每週五 17:00 學習",
    aiVariant: "learning",
    aiDetails: ["偏好安全庫存 14 天", "高毛利商品優先補貨", "急單交由第二供應商"],
  },
  {
    no: "14",
    eyebrow: "CUSTOMER EXPERIENCE",
    title: "客戶訂單追蹤",
    description: "客戶透過專屬頁面即時查看訂單進度、預計完成時間與最新狀態。",
    stat: "降低重複詢問，提升交付透明度",
    href: "/track/WO-2607-001",
    image: "/media/company-14-furniture.png",
    tone: "sand",
    aiInsight: "客戶在問之前，AI 已主動通知",
    aiReason: "訂單進度、延遲原因與新交期已自動整理。",
    aiAction: "發送最新進度",
    aiMetric: "詢問量 -63%",
    aiTime: "預計今天 18:00 發送",
    aiVariant: "tracking",
    aiDetails: ["工單已完成 72%", "包裝預計明天上午完成", "最新到貨日 8/18"],
  },
];

const projectCategories = [
  { id: "featured", label: "精選案例", projects: ["01", "02", "03"] },
  { id: "operations", label: "AI 營運決策", projects: ["04", "05", "07", "13", "14"] },
  { id: "commerce", label: "銷售與庫存", projects: ["06", "08", "09", "12"] },
  { id: "growth", label: "客戶與市場", projects: ["10", "11"] },
];

const capabilities = [
  {
    icon: BrainCircuit,
    label: "AI 先整理",
    title: "資料自己排好",
    text: "訂單、庫存和客服訊息一進來，AI 就自動分類、比對、排出優先順序。你打開畫面，就能直接開始決定。",
    result: "每天找資料，省下 2 小時",
    image: "/media/ai-organize-v2.png",
  },
  {
    icon: Layers3,
    label: "AI 先發現",
    title: "問題提早浮出來",
    text: "交期變慢、庫存快用完、客人開始著急，AI 會持續盯著變化，在事情變大以前提醒你。",
    result: "平均提早 3 天發現風險",
    image: "/media/ai-detect-v2.png",
  },
  {
    icon: Sparkles,
    label: "AI 先執行",
    title: "下一步自動往前走",
    text: "該追的進度、該通知的人、該準備的報表，AI 依照你的規則主動完成，團隊每天都接得上進度。",
    result: "47 項例行工作自動完成",
    image: "/media/ai-execute-v2.png",
  },
];

const testimonials = [
  {
    quote: "我早上喝咖啡的時間看一下，就知道今天先處理哪三件事，腦袋輕鬆很多。",
    role: "阿誠｜工廠老闆",
    context: "製造業 · AI 營運決策",
    number: "01",
  },
  {
    quote: "它會直接圈出今天要補的貨，我確認一下就能送單，真的快很多。",
    role: "小雯｜品牌營運",
    context: "零售業 · 老闆營運管理",
    number: "02",
  },
  {
    quote: "最有感的是它會一直幫我追進度，我忙完回來，事情已經走到下一步了。",
    role: "David｜電商團隊",
    context: "電商業 · AI 工作流程",
    number: "03",
  },
  {
    quote: "新人照著建議就能報價，我現在只要看最後的毛利，放心很多。",
    role: "雅婷｜貿易公司",
    context: "中小企業 · 智慧報價",
    number: "04",
  },
  {
    quote: "客人一急，它會先提醒我。我可以在情緒變糟前打電話處理，差很多。",
    role: "怡君｜客服主管",
    context: "服務業 · AI 客服",
    number: "05",
  },
  {
    quote: "盤點完馬上就看到差在哪，我們那天提早一個多小時收工。",
    role: "俊宏｜倉庫主任",
    context: "物流業 · AI 盤點",
    number: "06",
  },
  {
    quote: "以前選新品都靠感覺，現在先看 AI 幫我整理的三個數字，再決定要進多少。",
    role: "美玲｜選物店主",
    context: "零售業 · AI 選品",
    number: "07",
  },
  {
    quote: "客人自己就看得到做到哪裡，LINE 少了一大半，我終於可以專心做現場。",
    role: "國偉｜工程負責人",
    context: "工程業 · 訂單追蹤",
    number: "08",
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
  const [activeCategory, setActiveCategory] = useState(projectCategories[0].id);
  const [activeProject, setActiveProject] = useState(projectCategories[0].projects[0]);

  const selectedCategory = projectCategories.find((category) => category.id === activeCategory) ?? projectCategories[0];
  const visibleProjects = projects.filter((project) => selectedCategory.projects.includes(project.no));
  const selectedProject = projects.find((project) => project.no === activeProject) ?? visibleProjects[0];

  const chooseCategory = (categoryId: string) => {
    const category = projectCategories.find((item) => item.id === categoryId) ?? projectCategories[0];
    setActiveCategory(category.id);
    setActiveProject(category.projects[0]);
  };

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
          <a href="#about">關於 LUXKEY</a>
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
              <a href="#about" onClick={closeMenu}>關於 LUXKEY</a>
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
            <span>AI 讓工作主動完成。</span>
            <strong>它讓工作自己完成。</strong>
          </div>
          <a className="round-link" href="#about" aria-label="繼續往下閱讀">
            <ArrowDown />
          </a>
        </motion.div>
      </section>

      <section className="statement section-pad" id="about">
        <Reveal className="section-label">ABOUT LUXKEY · 關於我們</Reveal>
        <Reveal delay={0.08} className="about-intro">
          <p className="statement-copy">
            LUXKEY 專注於商業、產品與 AI 的整合。<br />我們把複雜的工作，做成<em>團隊真正用得起來的 AI 系統</em>。
          </p>
          <p className="about-lead">
            我們從企業每天真正面對的問題出發：資料散落、流程靠人盯、決策總是慢一步。從釐清需求、產品規劃、介面設計到 AI 落地，LUXKEY 陪伴團隊把想法做成可以操作、可以驗證，也能持續成長的產品。
          </p>
        </Reveal>
        <Reveal delay={0.16} className="about-details">
          <article>
            <span>01 · WHAT I DO</span>
            <strong>商業問題拆解</strong>
            <p>先找出最花時間、最容易出錯的環節，再決定 AI 應該從哪裡開始。</p>
          </article>
          <article>
            <span>02 · HOW I BUILD</span>
            <strong>產品設計與實作</strong>
            <p>把流程、資料與人的判斷接起來，完成員工能操作、老闆看得懂的系統。</p>
          </article>
          <article>
            <span>03 · WHO I HELP</span>
            <strong>想提高效率的企業</strong>
            <p>適合正在成長、工作量增加，希望用 AI 讓團隊更快完成工作的公司。</p>
          </article>
        </Reveal>
        <Reveal delay={0.22} className="statement-meta">
          <p>商業顧問 · 產品策劃 · AI 實作者</p>
          <p>BASED IN TAIWAN · WORKING EVERYWHERE</p>
        </Reveal>
      </section>

      <section className="work section-pad" id="work">
        <div className="section-heading">
          <Reveal>
            <span className="section-label">SELECTED WORK</span>
            <h2>每一個作品，<br />都是解題的證明。</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p>每一個專案都從一個真實的商業問題開始，最後成為一個能被操作、驗證與持續迭代的系統。</p>
          </Reveal>
        </div>

        <div className="portfolio-browser">
          <div className="portfolio-menu" aria-label="作品選單">
            <div className="category-tabs" role="tablist" aria-label="作品分類">
              {projectCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === category.id}
                  className={activeCategory === category.id ? "is-active" : ""}
                  onClick={() => chooseCategory(category.id)}
                >
                  {category.label}
                  <span>{String(category.projects.length).padStart(2, "0")}</span>
                </button>
              ))}
            </div>

            <div className="portfolio-selects">
              <label>
                <span>選擇類別</span>
                <select value={activeCategory} onChange={(event) => chooseCategory(event.target.value)}>
                  {projectCategories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                </select>
              </label>
              <label>
                <span>選擇作品</span>
                <select value={activeProject} onChange={(event) => setActiveProject(event.target.value)}>
                  {visibleProjects.map((project) => <option key={project.no} value={project.no}>{project.no} · {project.title}</option>)}
                </select>
              </label>
            </div>

            <div className="project-options" role="tablist" aria-label={`${selectedCategory.label}作品`}>
              {visibleProjects.map((project) => (
                <button
                  key={project.no}
                  type="button"
                  role="tab"
                  aria-selected={activeProject === project.no}
                  className={activeProject === project.no ? "is-active" : ""}
                  onClick={() => setActiveProject(project.no)}
                >
                  <span>{project.no}</span>
                  <strong>{project.title}</strong>
                  <ArrowUpRight size={17} />
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProject.no}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: .28, ease }}
            >
              <div
                className={`project-card ${selectedProject.tone}`}
              >
                <div className="project-visual">
                  {selectedProject.aiInsight ? (
                    <div className={`phone-stage phone-stage-${selectedProject.aiVariant}`}>
                      <div className="employee-desktop">
                        <div className="desktop-toolbar">
                          <div aria-hidden="true"><i /><i /><i /></div>
                          <span>員工操作端 · DESKTOP</span>
                          <b>LIVE</b>
                        </div>
                        <img
                          src={selectedProject.image}
                          alt={`${selectedProject.title}員工操作儀表板`}
                          loading="lazy"
                        />
                        <div className="desktop-base" aria-hidden="true" />
                      </div>
                      <div className="phone-device">
                        <div className="phone-hardware" aria-hidden="true"><span /></div>
                        <div className="phone-screen">
                          <div className="phone-appbar">
                            <div>
                              <small>LUXKEY AI</small>
                              <strong>{selectedProject.title}</strong>
                            </div>
                            <span className="phone-avatar">LK</span>
                          </div>
                          <div className="ai-cover-status">
                            <span className="ai-signal"><Sparkles size={15} /></span>
                            <strong>AI 已完成分析</strong>
                            <time>{selectedProject.aiTime}</time>
                          </div>
                          <div className="ai-cover-body">
                            <small>AI 發現</small>
                            <h4>{selectedProject.aiInsight}</h4>
                            <p>{selectedProject.aiReason}</p>
                          </div>
                          <div className="ai-evidence">
                            {selectedProject.aiDetails.map((detail, detailIndex) => (
                              <div key={detail}>
                                <span>0{detailIndex + 1}</span>
                                <p>{detail}</p>
                              </div>
                            ))}
                          </div>
                          <div className="ai-cover-action">
                            <div>
                              <small>建議下一步</small>
                              <strong>{selectedProject.aiAction}</strong>
                            </div>
                            <div className="ai-cover-metric">
                              <b>{selectedProject.aiMetric}</b>
                              <span>預期影響</span>
                            </div>
                          </div>
                          <div className="phone-action">確認並執行 <ArrowUpRight size={17} /></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img src={selectedProject.image} alt={`${selectedProject.title} Demo 系統畫面`} />
                  )}
                  <span className="demo-badge">{selectedProject.badge ?? "PROJECT VIEW"}</span>
                </div>
                <div className="project-content">
                  <div className="project-meta">
                    <span>{selectedProject.no}</span>
                    <span>{selectedProject.eyebrow}</span>
                  </div>
                  <h3>{selectedProject.title}</h3>
                  <p>{selectedProject.description}</p>
                  <div className="project-result">
                    <small>DESIGNED OUTCOME</small>
                    <strong>{selectedProject.stat}</strong>
                  </div>
                  <div className="project-link">
                    作品預覽 · 僅在本站展示
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="approach section-pad" id="approach">
        <Reveal className="approach-intro">
          <span className="section-label">TIME × EFFICIENCY</span>
          <h2>時間，是企業最昂貴的成本。<br /><em>AI 在你看不見的地方，先把工作完成。</em></h2>
          <p>每天消耗時間的工作，通常藏在找資料、追進度和反覆確認裡。LUXKEY 讓 AI 在背後持續整理、檢查與推進，讓老闆和團隊一打開畫面，就能處理真正重要的事。</p>
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
                <div className="capability-image">
                  <img src={item.image} alt={`${item.title}的 AI 系統畫面`} loading="lazy" />
                </div>
                <small>{item.label}</small>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <strong>{item.result}</strong>
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
          <p>每天少一點雜事，<br />多一點時間做重要的決定。</p>
        </div>
        <h2 id="feedback-title">他們說，工作開始<br />變得更順了。</h2>
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
              <div className={`avatar-crop avatar-${index + 1}`}>
                <img src="/media/feedback-avatars-v2.png" alt={`${item.role}的生活照`} />
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
          <p>“ 好的 AI 主動完成工作，<br />讓人把時間留給真正重要的判斷。 ”</p>
        </Reveal>
      </section>

      <section className="contact section-pad" id="contact">
        <div className="contact-grid">
          <Reveal>
            <span className="section-label">LET&apos;S BUILD SOMETHING USEFUL</span>
            <h2>現在，最想解決<br />哪一個問題？</h2>
          </Reveal>
          <Reveal delay={0.1} className="contact-side">
            <p>把目前最花時間、最容易出錯，或最需要你親自盯著的事情告訴我。我會先幫你拆解問題，再提出可以真正執行的 AI 方案。</p>
            <div className="contact-methods">
              <a
                className="line-contact"
                href="https://lin.ee/6M3pM1o"
                target="_blank"
                rel="noreferrer"
                aria-label="加入 LUXKEY LINE 好友"
              >
                <span>LINE 直接聊聊</span>
                <img
                  src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png"
                  alt="加入好友"
                  width="116"
                  height="36"
                />
              </a>
              <a className="email-contact" href="mailto:luxkey.tw@gmail.com">
                <span>EMAIL</span>
                <strong>luxkey.tw@gmail.com</strong>
                <ArrowUpRight />
              </a>
            </div>
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
