// demo 的單一「今天」來源(避免各處硬寫日期而漂移)
// 台北時區 2026-07-21 當天

/** 2026-07-21 00:00 (+08:00) 的毫秒基準 */
export const DEMO_MIDNIGHT_MS = new Date("2026-07-21T00:00:00+08:00").getTime();

/** demo 的「現在」(上午 9 點) */
export const DEMO_TODAY = new Date("2026-07-21T09:00:00+08:00");
