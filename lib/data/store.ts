import type { IndustryKey } from "@/lib/types";
import { buildSeed, type SeedData } from "./seed";

// === 記憶體 seed store(app 層 mock)===
// 模組單例:瀏覽器(靜態部署)與 dev server 皆可用。
// demo 期間的採納/調整會累積;reset() 重新產生 seed。

let _data: SeedData | null = null;

function data(): SeedData {
  if (!_data) _data = buildSeed();
  return _data;
}

/** 取得某產業的全部資料切片 */
export function db(industry: IndustryKey) {
  return data()[industry];
}

/** 取得整個 seed(所有產業) */
export function allData(): SeedData {
  return data();
}

/** 重置 demo 資料 */
export function resetStore() {
  _data = buildSeed();
}
