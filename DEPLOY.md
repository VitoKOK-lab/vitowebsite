# 部署(GitHub Pages,免 Vercel)

本專案已設定為 **靜態輸出**(`next export`),可直接放 GitHub Pages,
整包在瀏覽器裡跑——不需伺服器、不需任何環境變數、不需外部服務。
角色/產業切換、滑動採納、學習迴圈全部照常運作(資料本來就是 mock)。

## 自動部署(已設好 GitHub Actions)

`.github/workflows/deploy.yml` 會在每次 push 這條分支時:
建置靜態站 → 部署到 GitHub Pages。

### 一次性設定(只要做一次)

1. 到 GitHub repo → **Settings → Pages**
2. **Build and deployment → Source** 選 **GitHub Actions**
3. 完成。之後每次 push 會自動部署。

### 你的公開網址

```
https://vitokok-lab.github.io/vitowebsite/
```

(第一次 Action 跑完後就會生效;到 repo 的 **Actions** 分頁可看部署進度。)

## 本機執行

```bash
npm install
npm run dev        # http://localhost:3000
```

## 本機預覽「靜態版」(和線上一模一樣)

```bash
npm run build      # 產生 out/
npx serve out      # 或 python3 -m http.server -d out 8080
```

## 測試

```bash
npm test           # 25 個單元測試(關鍵邏輯 + 學習迴圈)
```
