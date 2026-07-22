// 盤點差異的 AI 推測原因(純函式,client/server 共用,不依賴 store)

export interface VarianceItem {
  category: string;
  perishable: boolean;
}

export function varianceReason(diff: number, it: VarianceItem): string {
  if (diff === 0) return "帳實相符,無差異 👍";
  if (diff < 0) {
    // 實盤少於帳面
    if (it.perishable || it.category === "海鮮")
      return "可能原因:近期報廢未入帳,或備料耗損高於預期。建議檢查報廢紀錄。";
    if (it.category === "電池" || it.category === "電控")
      return "可能原因:近期樣品出借、或工單領料未即時扣帳。建議比對領料單。";
    return "可能原因:未入帳的出貨、樣品出借或短溢收。建議追查近 7 日異動。";
  }
  return "實盤多於帳面,可能原因:退貨未入帳,或前次盤點少計。建議複核入庫紀錄。";
}
