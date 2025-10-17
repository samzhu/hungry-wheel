# 🚀 GitHub Pages 部署指南

## 📋 部署前準備

### 1. 確認專案已推送到 GitHub

```bash
git add .
git commit -m "feat: 完成 Hungry Wheel 專案"
git push origin main
```

### 2. 設定 Google Maps API Key

#### 在 GitHub 設定 Secret

1. 前往您的 GitHub 倉庫頁面
2. 點擊 `Settings` > `Secrets and variables` > `Actions`
3. 點擊 `New repository secret`
4. 設定以下 Secret：
   - **Name**: `VITE_GOOGLE_MAPS_API_KEY`
   - **Value**: 您的 Google Maps API 金鑰

### 3. 啟用 GitHub Pages

1. 前往 `Settings` > `Pages`
2. 在 **Source** 選擇：`GitHub Actions`
3. 儲存設定

## 🔧 自動部署流程

當您推送到 `main` 分支時，會自動觸發部署：

```bash
git push origin main
```

或手動觸發：

1. 前往 `Actions` 頁籤
2. 選擇 `Deploy to GitHub Pages` workflow
3. 點擊 `Run workflow`

## 📱 訪問您的網站

部署完成後，您的網站將在以下位置可用：

```
https://samzhu.github.io/hungry-wheel/
```

### 手機測試

1. 使用手機瀏覽器開啟上述 URL
2. 允許位置存取權限
3. 開始使用！

## 🔍 查看部署狀態

1. 前往 `Actions` 頁籤
2. 查看最新的 workflow 執行狀態
3. 綠色勾號 ✅ = 部署成功
4. 紅色叉號 ❌ = 部署失敗（點擊查看錯誤日誌）

## ⚠️ 常見問題

### 部署失敗：找不到 API Key

**問題**：Build 時出現 `VITE_GOOGLE_MAPS_API_KEY` 未定義錯誤

**解決方案**：
- 確認已在 GitHub Secrets 中正確設定 `VITE_GOOGLE_MAPS_API_KEY`
- Secret 名稱必須完全一致（區分大小寫）
- 重新運行 workflow

### 網站無法載入資源（404 錯誤）

**問題**：頁面載入但 CSS/JS 無法載入

**解決方案**：
- 確認 `vite.config.ts` 中的 `base` 路徑正確
- 應該是 `/hungry-wheel/`（倉庫名稱）
- 重新建置並部署

### 位置權限無法取得

**問題**：手機上無法取得位置

**解決方案**：
- 確認使用 HTTPS（GitHub Pages 預設是 HTTPS）
- 檢查手機瀏覽器的位置權限設定
- 嘗試重新整理頁面並重新授權

### Google Maps API 配額超限

**問題**：API 請求被拒絕

**解決方案**：
- 前往 [Google Cloud Console](https://console.cloud.google.com/)
- 檢查 API 使用量和配額
- 考慮啟用計費以提高配額限制

## 🔄 更新部署

每次推送到 `main` 分支都會自動重新部署：

```bash
# 1. 修改程式碼
git add .
git commit -m "update: 功能更新"
git push origin main

# 2. 等待自動部署（約 2-3 分鐘）
# 3. 重新整理網頁查看更新
```

## 📊 部署優化

### Chunk 分割

專案已設定自動分割打包：
- `three.js` - Three.js 核心
- `react-three` - React Three Fiber 相關
- `animation` - GSAP & Framer Motion
- `maps` - Google Maps API

這樣可以加快初始載入速度。

### 建置大小

預期建置結果：
- 總大小：約 1.4 MB (gzipped 後約 437 KB)
- 首次載入：較慢（需下載 3D 庫）
- 後續訪問：快速（瀏覽器快取）

## 🛠️ 進階設定

### 自訂網域

1. 購買網域（如：hungrywheel.com）
2. 在 DNS 設定 CNAME 記錄指向 `samzhu.github.io`
3. 在倉庫 `Settings` > `Pages` 設定自訂網域
4. 更新 `vite.config.ts` 的 `base` 為 `/`

### PWA 支援（未來功能）

可以添加 `vite-plugin-pwa` 使網站可安裝到手機：

```bash
npm install -D vite-plugin-pwa
```

### 環境變數管理

開發環境：使用 `.env`
生產環境：使用 GitHub Secrets

```env
# .env (本地開發)
VITE_GOOGLE_MAPS_API_KEY=your_dev_key

# GitHub Secrets (生產環境)
VITE_GOOGLE_MAPS_API_KEY=your_prod_key
```

## 📝 Workflow 說明

### Actions 版本

使用最新穩定版：
- `actions/checkout@v4` - 檢出程式碼
- `actions/setup-node@v4` - 設定 Node.js 20
- `actions/upload-pages-artifact@v3` - 上傳建置結果
- `actions/deploy-pages@v4` - 部署到 GitHub Pages

### 執行時間

一般部署時間：2-4 分鐘
- Build: 1-2 分鐘
- Upload: 10-30 秒
- Deploy: 30-60 秒

## 🎉 部署完成檢查清單

- [ ] 程式碼已推送到 GitHub
- [ ] GitHub Secrets 已設定 API Key
- [ ] GitHub Pages 已啟用（Source: GitHub Actions）
- [ ] Workflow 執行成功（綠色勾號）
- [ ] 網站可以正常訪問
- [ ] 手機測試通過（位置、3D 渲染、抽籤功能）

## 💡 提示

- 建議在推送前先本地測試 `npm run build`
- 使用不同手機和瀏覽器測試相容性
- 監控 Google Maps API 使用量避免超額
- 定期檢查依賴套件更新

## 🆘 需要幫助？

- 查看 [GitHub Actions 文檔](https://docs.github.com/en/actions)
- 查看 [GitHub Pages 文檔](https://docs.github.com/en/pages)
- 查看 [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)

---

祝您部署順利！🚀
