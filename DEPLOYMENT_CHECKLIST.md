# ✅ GitHub Pages 部署檢查清單

## 📦 部署前檢查

### 本地環境測試
- [ ] 執行 `npm install` 確認依賴安裝正常
- [ ] 執行 `npm run dev` 確認開發環境運行正常
- [ ] 執行 `npm run build` 確認生產建置成功
- [ ] 執行 `npx tsc --noEmit` 確認沒有 TypeScript 錯誤

### 程式碼檢查
- [ ] `.env` 文件已加入 `.gitignore`（✅ 已設定）
- [ ] `.env.example` 已提交到 Git（✅ 已包含）
- [ ] `vite.config.ts` 的 `base` 路徑已設定為 `/hungry-wheel/`（✅ 已設定）
- [ ] GitHub Actions workflow 文件存在於 `.github/workflows/deploy.yml`（✅ 已創建）

## 🔧 GitHub 設定

### 倉庫設定
- [ ] 程式碼已推送到 GitHub 的 `main` 分支
- [ ] 倉庫是 public（GitHub Pages 免費版需要）

### API 金鑰設定
- [ ] 前往 `Settings` > `Secrets and variables` > `Actions`
- [ ] 新增 Secret：`VITE_GOOGLE_MAPS_API_KEY`
- [ ] 確認 Secret 名稱完全一致（區分大小寫）
- [ ] 測試 API Key 在本地環境可用

### GitHub Pages 設定
- [ ] 前往 `Settings` > `Pages`
- [ ] Source 選擇 `GitHub Actions`
- [ ] 儲存設定

## 🚀 執行部署

### 觸發部署
選擇以下任一方式：

**方式 1：自動觸發**
```bash
git add .
git commit -m "deploy: 初始部署"
git push origin main
```

**方式 2：手動觸發**
- [ ] 前往 GitHub 倉庫 > `Actions`
- [ ] 選擇 `Deploy to GitHub Pages` workflow
- [ ] 點擊 `Run workflow` > `Run workflow`

### 監控部署狀態
- [ ] 前往 `Actions` 頁籤查看執行狀態
- [ ] 等待 Build job 完成（約 2-3 分鐘）
- [ ] 等待 Deploy job 完成（約 30-60 秒）
- [ ] 確認所有步驟都顯示綠色勾號 ✅

## 🧪 部署後測試

### 桌面瀏覽器測試
- [ ] 開啟 `https://samzhu.github.io/hungry-wheel/`
- [ ] 頁面正常載入，沒有 404 錯誤
- [ ] CSS 樣式正常顯示
- [ ] 允許位置存取權限
- [ ] 等待餐廳搜尋完成
- [ ] 3D 場景正常渲染
- [ ] 點擊「開始抽籤」測試動畫
- [ ] 抽籤結果正常顯示

### 手機測試
- [ ] 使用手機瀏覽器開啟網站
- [ ] 允許位置權限（確認手機的定位服務已開啟）
- [ ] 測試觸控操作（旋轉 3D 場景）
- [ ] 測試抽籤功能
- [ ] 測試響應式佈局

### 功能測試
- [ ] 位置定位功能正常
- [ ] 餐廳搜尋返回結果
- [ ] 3D 籤筒正常顯示
- [ ] 抽籤動畫流暢運行
- [ ] 結果頁面正常顯示
- [ ] 重新抽籤功能正常

### 效能測試
- [ ] 首次載入時間可接受（< 5 秒）
- [ ] 3D 動畫流暢（不卡頓）
- [ ] 手機上操作流暢

## 🐛 問題排查

### 如果網站無法載入
1. [ ] 檢查 GitHub Pages 是否已啟用
2. [ ] 確認 Source 設定為 `GitHub Actions`
3. [ ] 查看 Actions 執行日誌是否有錯誤

### 如果資源載入失敗（404）
1. [ ] 檢查 `vite.config.ts` 的 `base` 設定
2. [ ] 確認設定為 `/hungry-wheel/`（倉庫名稱）
3. [ ] 重新建置並部署

### 如果 API 錯誤
1. [ ] 確認 GitHub Secret 已正確設定
2. [ ] 檢查 API Key 是否有效
3. [ ] 確認 Google Cloud Console 中 Places API 已啟用
4. [ ] 檢查 API 配額是否用完

### 如果位置無法取得
1. [ ] 確認使用 HTTPS（GitHub Pages 預設是 HTTPS）
2. [ ] 檢查瀏覽器/手機的位置權限設定
3. [ ] 嘗試重新整理頁面

## 📊 部署成功指標

### 必須達成
- [x] GitHub Actions workflow 執行成功（綠色勾號）
- [x] 網站可以訪問（返回 200 狀態碼）
- [x] 位置定位功能正常
- [x] 餐廳搜尋有結果
- [x] 3D 場景正常渲染
- [x] 抽籤功能正常運作

### 建議達成
- [ ] 首次載入時間 < 5 秒
- [ ] 3D 動畫 FPS > 30
- [ ] 在至少 2 種手機瀏覽器測試通過
- [ ] 在至少 2 個不同位置測試餐廳搜尋

## 🎉 完成！

當所有檢查項目都打勾後，您的網站就成功部署了！

可以分享給朋友測試：
```
https://samzhu.github.io/hungry-wheel/
```

## 📝 備註

- 每次推送到 `main` 分支會自動重新部署
- 建議建立 `dev` 分支進行開發，測試無誤後再合併到 `main`
- 部署時間約 2-4 分鐘
- GitHub Pages 有 CDN 快取，更新可能需要幾分鐘才能看到

---

最後更新：2025-10-17
