import type { Metadata } from "next";
import { AstrolabeArt, ImageSlot, MotifArt, ObsidianArt } from "./ImageSlot";
import { assetUrl } from "./asset";
import "./jewelry.css";

export const metadata: Metadata = {
  title: "泰熙爾札娜 TAHIR ZINAB — 高級珠寶平台",
  description:
    "金曜石國際旗下高級珠寶品牌泰熙爾札娜:星盤黃金典藏、手工鏨刻工藝、真品溯源與私人鑑賞預約。",
};

const NAV_LINKS = [
  { href: "#collections", label: "典藏系列" },
  { href: "#craft", label: "匠心工藝" },
  { href: "#story", label: "品牌故事" },
  { href: "#platform", label: "會員平台" },
];

const COLLECTIONS = [
  {
    name: "星盤系列",
    en: "CELESTIAL ASTROLABE",
    desc: "以古星盤的環刻與準線為靈感,999 足金手工鏨刻,把星辰的秩序戴在腕間。",
    src: "/assets/celestial-astrolabe-gold.png",
    art: AstrolabeArt,
  },
  {
    name: "金紋系列",
    en: "GOLD MOTIF",
    desc: "幾何金紋層層交疊,取自泰熙爾札娜傳承紋樣,日常配戴亦見儀式感。",
    src: "/assets/motif-gold.png",
    art: MotifArt,
  },
  {
    name: "曜石系列",
    en: "LUXKEY OBSIDIAN",
    desc: "金曜石切面與亮金鑲邊的對話,LUXKEY 之名的起點,黑與金的當代詮釋。",
    src: "/assets/obsidian-gold.png",
    art: ObsidianArt,
  },
];

const CRAFT_PILLARS = [
  { stat: "999", unit: "足金", desc: "嚴選高純度金料,每件作品皆附材質證明。" },
  { stat: "60+", unit: "道工序", desc: "自鑄胚、鏨刻至拋光,均由資深金工師手工完成。" },
  { stat: "1:1", unit: "專屬編號", desc: "每件作品獨立編號,平台可查驗真品溯源。" },
  { stat: "終身", unit: "保養", desc: "會員享終身清潔保養與改款諮詢服務。" },
];

const PLATFORM_FEATURES = [
  {
    title: "真品溯源",
    desc: "輸入作品編號即可查驗出廠紀錄、材質與證書,杜絕仿冒。",
  },
  {
    title: "私人鑑賞預約",
    desc: "線上預約一對一鑑賞,由專屬顧問依場合與預算挑選作品。",
  },
  {
    title: "會員典藏發售",
    desc: "限量典藏優先通知與保留,會員專屬價與分期方案。",
  },
  {
    title: "保養與改款",
    desc: "線上申請送件,追蹤保養進度;舊金改款折抵工資。",
  },
];

export default function JewelryPlatformSite() {
  return (
    <div className="tz-root min-h-screen">
      {/* 標題襯線字型(Playfair Display + Noto Serif TC) */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Noto+Serif+TC:wght@500;600;700&family=Noto+Sans+TC:wght@300;400;500&display=swap"
      />

      {/* ===== 導覽列 ===== */}
      <header className="fixed inset-x-0 top-0 z-50 border-b tz-border bg-[rgb(11_9_7/0.82)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-3">
            <ImageSlot
              src="/assets/logo-black.png"
              alt="泰熙爾札娜 TAHIR ZINAB"
              className="h-9 w-9 shrink-0"
              imgClassName="h-9 w-9 object-contain"
              fallback={
                <span className="tz-display flex h-9 w-9 items-center justify-center border tz-border-strong text-lg tz-text-gold-bright">
                  札
                </span>
              }
            />
            <span className="flex flex-col leading-tight">
              <span className="tz-display text-base tracking-[0.2em]">
                泰熙爾札娜
              </span>
              <span className="text-[0.6rem] tracking-[0.4em] tz-text-muted">
                TAHIR ZINAB
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="tz-nav-link">
                {l.label}
              </a>
            ))}
            <a href="#contact" className="tz-btn-outline !px-5 !py-2 text-xs">
              預約鑑賞
            </a>
          </nav>

          {/* 行動版選單(無 JS) */}
          <details className="tz-mobile-menu relative md:hidden">
            <summary
              className="flex h-9 w-9 items-center justify-center border tz-border"
              aria-label="開啟選單"
            >
              <span className="tz-text-gold text-lg leading-none">☰</span>
            </summary>
            <nav className="absolute right-0 mt-3 flex w-48 flex-col border tz-border tz-bg-surface p-2">
              {[...NAV_LINKS, { href: "#contact", label: "預約鑑賞" }].map(
                (l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="tz-link-gold px-4 py-3 text-sm tracking-[0.15em]"
                  >
                    {l.label}
                  </a>
                )
              )}
            </nav>
          </details>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section
        id="top"
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        {/* 背景:hero-banner.jpg,未提供時退為金黑漸層 + 星盤紋 */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: [
              "linear-gradient(rgb(11 9 7 / 0.62), rgb(11 9 7 / 0.9))",
              `url(${assetUrl("/assets/hero-banner.jpg")})`,
              "radial-gradient(70rem 50rem at 50% 20%, rgb(151 120 62 / 0.35), rgb(11 9 7) 70%)",
            ].join(", "),
          }}
        />
        <AstrolabeArt className="pointer-events-none absolute -right-40 top-1/2 hidden w-[44rem] -translate-y-1/2 opacity-[0.14] lg:block" />

        <div className="relative z-10 mx-auto max-w-3xl px-5 pb-24 pt-36 text-center">
          <p className="tz-eyebrow mb-6">TAHIR ZINAB · 金曜石國際 LUXKEY</p>
          <h1 className="tz-display text-4xl leading-snug sm:text-5xl md:text-6xl">
            以星辰為度
            <br />
            <span className="tz-gold-gradient-text">鑄金成詩</span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-8 tz-text-muted sm:text-base">
            從古星盤的刻度到當代高級珠寶的線條,泰熙爾札娜以手工鏨刻延續金藝傳承
            —— 每一件作品,都是可以配戴的時間。
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#collections" className="tz-btn-gold text-sm">
              探索典藏系列
            </a>
            <a href="#contact" className="tz-btn-outline text-sm">
              預約私人鑑賞
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.4em] tz-text-muted">
          SCROLL
        </div>
      </section>

      {/* ===== 典藏系列 ===== */}
      <section id="collections" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
        <p className="tz-eyebrow text-center">COLLECTIONS</p>
        <h2 className="tz-display mt-4 text-center text-3xl sm:text-4xl">
          典藏系列
        </h2>
        <div className="tz-divider mx-auto mt-8 max-w-md">
          <span className="text-sm">◆</span>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {COLLECTIONS.map((c) => (
            <article key={c.name} className="tz-card group flex flex-col">
              <ImageSlot
                src={c.src}
                alt={`${c.name} ${c.en}`}
                className="flex aspect-square items-center justify-center overflow-hidden bg-[rgb(29_24_18)] p-8"
                imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                fallback={
                  <c.art className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
                }
              />
              <div className="flex flex-1 flex-col p-7">
                <p className="text-[0.65rem] tracking-[0.35em] tz-text-muted">
                  {c.en}
                </p>
                <h3 className="tz-display mt-2 text-xl tz-text-gold-bright">
                  {c.name}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-7 tz-text-muted">
                  {c.desc}
                </p>
                <a
                  href="#contact"
                  className="tz-link-gold mt-6 text-xs tracking-[0.25em]"
                >
                  預約鑑賞此系列 →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===== 匠心工藝 ===== */}
      <section id="craft" className="scroll-mt-20 border-y tz-border tz-bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <p className="tz-eyebrow text-center">CRAFTSMANSHIP</p>
          <h2 className="tz-display mt-4 text-center text-3xl sm:text-4xl">
            匠心工藝
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden border tz-border bg-[rgb(200_164_94/0.18)] sm:grid-cols-2 lg:grid-cols-4">
            {CRAFT_PILLARS.map((p) => (
              <div
                key={p.unit}
                className="flex flex-col items-center bg-[rgb(20_17_13)] px-8 py-12 text-center"
              >
                <span className="tz-display text-4xl tz-gold-gradient-text">
                  {p.stat}
                </span>
                <span className="mt-2 text-sm tracking-[0.3em] tz-text-gold">
                  {p.unit}
                </span>
                <p className="mt-4 text-xs leading-6 tz-text-muted">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 品牌故事 ===== */}
      <section id="story" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <ImageSlot
            src="/assets/celestial-astrolabe-gold.png"
            alt="星盤金藝"
            className="mx-auto w-full max-w-md p-6"
            imgClassName="w-full object-contain"
            fallback={<AstrolabeArt className="w-full" />}
          />
          <div>
            <p className="tz-eyebrow">OUR STORY</p>
            <h2 className="tz-display mt-4 text-3xl leading-snug sm:text-4xl">
              一枚星盤,
              <br />
              開啟的金藝旅程
            </h2>
            <div className="mt-8 space-y-5 text-sm leading-8 tz-text-muted">
              <p>
                泰熙爾札娜(TAHIR
                ZINAB)之名,承載跨越地域的金藝記憶。品牌由金曜石國際創立,以
                LUXKEY 為鑰,將傳統手工鏨刻帶入當代高級珠寶。
              </p>
              <p>
                我們相信珠寶不只是飾品,而是被時間認可的信物。每一道紋樣都由金工師親手刻下,每一件作品都有自己的編號與故事
                —— 從工坊到你手上,全程可溯。
              </p>
            </div>
            <a href="#platform" className="tz-btn-outline mt-10 text-sm">
              了解真品溯源
            </a>
          </div>
        </div>
      </section>

      {/* ===== 會員平台 ===== */}
      <section
        id="platform"
        className="scroll-mt-20 border-y tz-border tz-bg-surface"
      >
        <div className="mx-auto max-w-6xl px-5 py-24">
          <p className="tz-eyebrow text-center">MEMBER PLATFORM</p>
          <h2 className="tz-display mt-4 text-center text-3xl sm:text-4xl">
            會員平台服務
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-7 tz-text-muted">
            珠寶的價值在於長久。平台將鑑賞、驗證、保養串成一條完整服務,讓每件作品在歲月裡持續發光。
          </p>
          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {PLATFORM_FEATURES.map((f, i) => (
              <div key={f.title} className="tz-card flex gap-6 p-8">
                <span className="tz-display text-2xl tz-text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="tz-display text-lg tz-text-gold-bright">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 tz-text-muted">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 預約鑑賞 ===== */}
      <section id="contact" className="relative scroll-mt-20 overflow-hidden">
        <MotifArt className="pointer-events-none absolute -left-32 top-1/2 w-[36rem] -translate-y-1/2 opacity-10" />
        <div className="relative mx-auto max-w-3xl px-5 py-28 text-center">
          <p className="tz-eyebrow">PRIVATE VIEWING</p>
          <h2 className="tz-display mt-4 text-3xl leading-snug sm:text-4xl">
            預約一場只屬於你的鑑賞
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-8 tz-text-muted">
            由專屬顧問陪同,於私人鑑賞室細看每件典藏。來信或來電,我們將於一個工作日內回覆。
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:taiwanstore365@gmail.com?subject=預約鑑賞"
              className="tz-btn-gold text-sm"
            >
              來信預約鑑賞
            </a>
            <a href="#collections" className="tz-btn-outline text-sm">
              再看典藏系列
            </a>
          </div>
        </div>
      </section>

      {/* ===== 頁尾 ===== */}
      <footer className="border-t tz-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-12 text-center">
          <span className="tz-display text-lg tracking-[0.3em]">
            泰熙爾札娜
          </span>
          <p className="text-[0.65rem] tracking-[0.4em] tz-text-muted">
            TAHIR ZINAB · A LUXKEY MAISON
          </p>
          <nav className="flex flex-wrap justify-center gap-6">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="tz-nav-link">
                {l.label}
              </a>
            ))}
          </nav>
          <p className="text-xs tz-text-muted">
            © {new Date().getFullYear()} 金曜石國際 LUXKEY International.
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
