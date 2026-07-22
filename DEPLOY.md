# 部署到 Vercel(取得公開網址)

本專案是零設定 Next.js app:**不需要任何環境變數、不需要任何外部服務**,
匯入後直接 Deploy 就會成功。

## 最短路徑(約 2 分鐘)

1. 打開 **https://vercel.com/new**
2. 用 GitHub 登入 → 匯入(Import)`VitoKOK-lab/vitowebsite`
   - 本 repo 的預設分支就是 `claude/system-design-confirmation-342l3q`,
     Vercel 會自動抓它,**不用選分支、不用改設定**。
3. Framework 會被自動偵測為 **Next.js**;Build/Install 指令留預設即可。
4. 按 **Deploy**。
5. 完成後 Vercel 給你一個 `https://<專案名>.vercel.app` 公開網址,
   手機打開就能 demo。

## 一鍵匯入連結

> https://vercel.com/new/clone?repository-url=https://github.com/VitoKOK-lab/vitowebsite

## 本機執行(不部署也能看)

```bash
npm install && npm run dev
# http://localhost:3000
```

## 未來接真服務時才需要的環境變數

見 `.env.example`(現在全部是 mock,可全部留空)。
