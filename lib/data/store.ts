import type { IndustryKey } from "@/lib/types";
import { buildSeed, type SeedData } from "./seed";

// === 記憶體 seed store(app 層 mock,取代 Supabase) ===
// 單例:同一 server 程序內跨 request 保留,demo 期間的採納/調整會累積。
// reset() 重新產生 seed。

type Store = {
  data: SeedData;
};

declare global {
  // eslint-disable-next-line no-var
  var __aiColleagueStore: Store | undefined;
}

function init(): Store {
  return { data: buildSeed() };
}

function store(): Store {
  if (!global.__aiColleagueStore) {
    global.__aiColleagueStore = init();
  }
  return global.__aiColleagueStore;
}

/** 取得某產業的全部資料切片 */
export function db(industry: IndustryKey) {
  return store().data[industry];
}

/** 取得整個 seed(所有產業) */
export function allData(): SeedData {
  return store().data;
}

/** 重置 demo 資料 */
export function resetStore() {
  global.__aiColleagueStore = init();
}
