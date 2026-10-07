export type DealerOption = {
  name: string;
  price: string;
  unit: string;
  detail: string;
  includes: string[];
};

export type DealerCase = {
  src: string;
  title: string;
  description: string;
};

export type DealerService = {
  slug: string;
  nav: string;
  eyebrow: string;
  headline: string;
  intro: string;
  image: string;
  imageAlt: string;
  priceLine: string;
  priceNote: string;
  accent?: 'orange';
  options: DealerOption[];
  reasons: {title: string; body: string}[];
  steps: string[];
  cases: DealerCase[];
};

export const dealerServices: DealerService[] = [
  {
    slug: 'digital-human',
    nav: '數字人',
    eyebrow: '01 / AI 數字人短影音',
    headline: '不用天天拍，品牌天天有人開口賣。',
    intro: '建立固定的虛擬品牌角色，持續介紹產品、回答常見問題、更新活動。老闆給重點，我們交付能發布的直式影片。',
    image: '/dealer/digital-human.webp',
    imageAlt: '手機顯示虛擬品牌角色與多支直式產品影片',
    priceLine: '4 支 NT$19,800 起',
    priceNote: '15–30 秒／支・未稅參考價',
    options: [{
      name: '數字人開口賣',
      price: 'NT$19,800 起',
      unit: '／4 支',
      detail: '用固定虛擬角色，讓產品持續被介紹。',
      includes: ['4 支 9:16 直式影片，每支 15–30 秒', '產品腳本、數字人口播、字幕與配樂', '同一品牌角色與視覺版型', '每支 1 次集中修改'],
    }],
    reasons: [
      {title: '不必反覆約拍', body: '提供產品資訊與素材，便能持續產出新主題。'},
      {title: '形象維持一致', body: '同一角色和版型，讓品牌更容易被記住。'},
      {title: '拿到就能發布', body: '交付完整直式成片，不只是一個數字人檔案。'},
    ],
    steps: ['給產品資料與角色方向', '確認腳本和示範畫面', '製作、審稿、交付影片'],
    cases: [{src: '/dealer/simulated/digital-human-vertical.webp', title: '數字人商品介紹情境', description: 'AI 生成模擬圖，9:16 完整展示。'}],
  },
  {
    slug: 'real-video',
    nav: '實拍短影音',
    eyebrow: '02 / 真實到場拍攝',
    headline: '一次拍夠，一個月都有影片可發。',
    intro: '產品、店面、服務流程真的拍給客戶看。從題目、拍攝到剪輯同一團隊完成，省掉老闆分頭找人。',
    image: '/dealer/real-video.webp',
    imageAlt: '攝影機在店內實際拍攝商品與場景',
    priceLine: '4 支 NT$29,800 起',
    priceNote: '單一地點半天拍攝・未稅參考價',
    options: [{
      name: '實拍短影音包',
      price: 'NT$29,800 起',
      unit: '／4 支',
      detail: '一次到場，拍出可連續發布的內容。',
      includes: ['1 個地點、半天最多 4 小時拍攝', '4 支 9:16 直式影片，每支 15–45 秒', '題目與拍攝提綱、剪輯、字幕、配樂', '每支 1 次集中修改'],
    }],
    reasons: [
      {title: '真實產品真實現場', body: '商品細節、店面與製作過程由鏡頭直接證明。'},
      {title: '一次安排多支內容', body: '集中拍攝，少打斷日常營運。'},
      {title: '拍完就接著剪', body: '從腳本到成片一個窗口負責。'},
    ],
    steps: ['確認產品與拍攝地點', '一次集中拍攝', '剪輯、審稿、交付 4 支'],
    cases: [{src: '/dealer/simulated/real-video-vertical.webp', title: '店內商品實拍情境', description: 'AI 生成模擬圖，9:16 完整展示。'}],
  },
  {
    slug: 'ai-video',
    nav: 'AI 剪片／生片',
    eyebrow: '03 / AI 商品影片',
    headline: '素材丟過來，快速變成會賣的影片。',
    intro: '現有照片和影片可以重新剪成社群短影音；素材不夠，還能用 AI 補出產品情境畫面。',
    image: '/dealer/ai-video.webp',
    imageAlt: '電腦剪輯時間軸把產品素材轉成多支直式影片',
    priceLine: '4 支 NT$12,800 起',
    priceNote: '客供素材剪輯・未稅參考價',
    options: [
      {name: '素材快剪', price: 'NT$12,800', unit: '／4 支', detail: '把手上的素材變成 4 支可發布短片。', includes: ['4 支 9:16、15–30 秒成片', '開場文案、字幕、基礎配樂與封面', '客供照片／影片搭配必要 AI 補畫面', '每支 1 次集中修改']},
      {name: 'AI 商品生片', price: 'NT$19,800 起', unit: '／4 支', detail: '素材不夠，也能建立新的商品情境畫面。', includes: ['4 支 9:16、15–30 秒產品情境短片', 'AI 畫面規劃、生成、剪輯與字幕', '每支 1 次集中修改', '角色一致性與特殊授權另估']},
    ],
    reasons: [
      {title: '舊素材重新賣', body: '照片、商品影片與活動紀錄都能再製。'},
      {title: '不夠的畫面用 AI 補', body: '快速測試新產品情境和廣告方向。'},
      {title: '一案多支分批發', body: '一次拿到多個直式主題，提高內容使用率。'},
    ],
    steps: ['提供素材與產品重點', '選剪輯或 AI 生片方向', '審稿後交付直式成片'],
    cases: [{src: '/dealer/simulated/ai-video-vertical.webp', title: 'AI 商品影片情境', description: 'AI 生成模擬圖，9:16 完整展示。'}],
  },
  {
    slug: 'social-posts',
    nav: '圖文小編',
    eyebrow: '04 / AI 圖文小編',
    headline: '每週都有內容，不用老闆每天想題目。',
    intro: '從產品賣點、貼文主題到文案和圖片，整月排好、分批交件。讓社群持續更新，不再靠靈感硬撐。',
    image: '/dealer/social-posts.webp',
    imageAlt: '螢幕與手機展示一整月已製作的商品圖文貼文',
    priceLine: '8 則 NT$16,800／月',
    priceNote: '圖文製作・未稅參考價',
    options: [{
      name: '圖文小編月包',
      price: 'NT$16,800',
      unit: '／月 8 則',
      detail: '每週穩定更新，讓產品持續出現在客戶眼前。',
      includes: ['每月 8 則貼文文案＋主圖', '1 份當月主題與發布月曆', 'FB／IG 同素材適配', '分 2 批交付，每批 1 次集中修改'],
    }],
    reasons: [
      {title: '題目我們先想', body: '圍繞產品、促銷、故事與常見問題排內容。'},
      {title: '文案與圖一起拿', body: '減少老闆來回找小編和設計師。'},
      {title: '一個月看得見', body: '固定數量、固定交付節奏。'},
    ],
    steps: ['給品牌和產品資料', '確認月度題目', '分兩批交付圖文'],
    cases: [{src: '/dealer/simulated/social-posts-vertical.webp', title: '烘焙品牌圖文情境', description: 'AI 生成模擬圖，9:16 完整展示。'}],
  },
  {
    slug: 'web-system',
    nav: '網站／系統',
    eyebrow: '05 / 網站與專案系統',
    headline: '要賣東西做網站；要跑生意做系統。',
    intro: '從能接詢問的銷售頁，到訂單、報名、報到、管理流程的專案軟體，依真正要完成的事建置。',
    image: '/dealer/web-system.webp',
    imageAlt: '大型桌上電腦同時展示商品網站和多模組營運管理系統',
    priceLine: '網站 NT$38,000 起',
    priceNote: '專案系統 NT$150,000 起・未稅',
    options: [
      {name: '銷售型網站', price: 'NT$38,000 起', unit: '／案', detail: '把產品、優勢與詢問入口集中在一頁。', includes: ['一頁式響應式銷售網站', '最多 6 個內容區塊與 1 個聯絡導流', '客供素材整理與基礎 SEO 設定', '1 次上線協助與 2 次集中修改']},
      {name: '專案型軟體', price: 'NT$150,000 起', unit: '／案', detail: '先做本案最有用的功能，快速投入使用。', includes: ['1 個核心流程的網頁軟體首版', '最多 5 個主要頁面、2 種使用角色', '1 種約定格式的資料匯入／匯出', '部署、操作教學與結案退場規劃']},
    ],
    reasons: [
      {title: '網站把曝光變詢問', body: '讓客戶一次看懂產品，找到下一步。'},
      {title: '系統讓工作跑起來', body: '把重複資料與人工追進度接成流程。'},
      {title: '先做能賺錢的首版', body: '從一個核心任務開始，不必先買整套大系統。'},
    ],
    steps: ['確認最重要的一件事', '定頁面或系統範圍', '製作、驗收、上線'],
    cases: [{src: '/dealer/simulated/web-system-vertical.webp', title: '銷售網站與管理系統情境', description: 'AI 生成模擬圖，9:16 完整展示。'}],
  },
  {
    slug: 'creator-campaign',
    nav: 'KOC／KOL',
    eyebrow: '06 / KOC × KOL 專案合作',
    headline: '一個產品，讓更多人幫你說。',
    intro: 'KOC 帶來使用者視角與內容素材；KOL 幫品牌打開新受眾。從人選、題目、合作到交付，一個窗口管理。',
    image: '/dealer/creator-campaign.webp',
    imageAlt: '同一產品出現在多支不同創作者的直式內容中',
    priceLine: 'KOC 5 位 NT$30,000 起',
    priceNote: 'KOL 5 位 NT$100,000 起・未稅',
    accent: 'orange',
    options: [
      {name: 'KOC 口碑合作', price: 'NT$30,000 起', unit: '／5 位', detail: '多位素人從真實使用角度介紹產品。', includes: ['5 位合作對象媒合與檔期確認', '每位 1 則約定貼文或短影音', '產品重點、發布規範與交付追蹤', '授權範圍、人選與運送費依報價確認']},
      {name: 'KOL 曝光合作', price: 'NT$100,000 起', unit: '／5 位', detail: '多位創作者一次傳遞品牌訊息。', includes: ['5 位 KOL 候選人與合作提案', '合作內容、檔期及發布管理', '每位 1 則約定貼文或短影音', '實際人選、授權、刊登費依正式報價確認']},
    ],
    reasons: [
      {title: '人選一次找齊', body: '依產品受眾挑選合作方向與內容形式。'},
      {title: '內容有人追', body: '統一管理腳本重點、檔期與交付。'},
      {title: '口碑與曝光分開買', body: 'KOC 與 KOL 的用途、預算和期待不混在一起。'},
    ],
    steps: ['說明產品與目標受眾', '確認人選、授權及正式報價', '發布、驗收與成果彙整'],
    cases: [{src: '/dealer/simulated/creator-campaign-vertical.webp', title: 'KOC 商品開箱情境', description: 'AI 生成模擬圖，9:16 完整展示。'}],
  },
];

export function getDealerService(slug: string) {
  return dealerServices.find(service => service.slug === slug);
}
