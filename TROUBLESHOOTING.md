# 🔧 故障排除指南

## 🚨 常見錯誤及解決方案

### 錯誤 1：「Google Maps API 金鑰未設定」

#### 症狀
```
⚠️ Google Maps API 金鑰未設定。請在 .env 文件中設定 VITE_GOOGLE_MAPS_API_KEY
```
或
```
⚠️ Google Maps API 金鑰未設定。請聯繫網站管理員。
```

#### 原因與解決方案

**情況 A：本地開發環境**

1. **確認 .env 文件存在**
   ```bash
   ls -la .env
   ```
   如果不存在，複製範例文件：
   ```bash
   cp .env.example .env
   ```

2. **編輯 .env 文件，填入 API Key**
   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyC...您的完整金鑰...
   ```
   ⚠️ 注意：
   - 金鑰前後不要有空格
   - 不要用引號包住金鑰
   - 確保金鑰完整（通常是 39 個字元）

3. **重新啟動開發伺服器**
   ```bash
   # 停止當前伺服器 (Ctrl+C)
   npm run dev
   ```

**情況 B：GitHub Pages 生產環境**

1. **檢查 GitHub Secret 是否已設定**
   - 前往：`https://github.com/您的用戶名/hungry-wheel/settings/secrets/actions`
   - 確認存在名為 `VITE_GOOGLE_MAPS_API_KEY` 的 Secret
   - ⚠️ Secret 名稱必須完全一致（區分大小寫）

2. **如果 Secret 不存在，新增它**
   - 點擊 "New repository secret"
   - Name: `VITE_GOOGLE_MAPS_API_KEY`
   - Value: 您的 Google Maps API 金鑰
   - 點擊 "Add secret"

3. **重新部署**
   - 前往 Actions 頁籤
   - 選擇 "Deploy to GitHub Pages"
   - 點擊 "Run workflow"
   - 或推送新的 commit 觸發自動部署

4. **檢查 Build Log**
   - 在 Actions 中查看最新的 workflow 執行
   - 點擊 "Build" job
   - 查看 "Build" 步驟的輸出
   - 確認沒有關於環境變數的警告

---

### 錯誤 2：「無法取得位置」

#### 症狀
```
⚠️ 您拒絕了位置存取權限，請在瀏覽器設定中允許存取位置
```

#### 解決方案

**桌面瀏覽器：**

1. **Chrome/Edge**
   - 點擊網址列左側的鎖頭圖示
   - 找到「位置」權限
   - 選擇「允許」
   - 重新整理頁面

2. **Firefox**
   - 點擊網址列左側的圖示
   - 權限 > 存取您的位置 > 允許
   - 重新整理頁面

3. **Safari**
   - Safari 偏好設定 > 網站 > 位置服務
   - 找到您的網站並設定為「允許」

**手機瀏覽器：**

1. **iOS Safari**
   - 設定 > Safari > 位置服務
   - 確認「位置服務」已開啟
   - 確認 Safari 有權限存取位置
   - 在網頁上點擊「允許」

2. **Android Chrome**
   - 設定 > 網站設定 > 位置資訊
   - 確認已啟用
   - 或點擊網址列的鎖頭 > 權限 > 位置 > 允許

⚠️ **重要**：位置服務只能在 HTTPS 或 localhost 上運作！

---

### 錯誤 3：「附近沒有找到餐廳」

#### 症狀
```
😕 附近沒有找到餐廳
```

#### 可能原因

1. **位置偏遠**
   - Google Maps 可能在該區域沒有餐廳資料
   - 解決：移動到城市區域測試

2. **搜尋半徑太小**
   - 預設搜尋半徑：1500 公尺（1.5 公里）
   - 解決：調整搜尋半徑（見下方）

3. **API 限制**
   - Places API 可能達到配額限制
   - 解決：檢查 Google Cloud Console 的配額使用量

#### 調整搜尋半徑

編輯 `src/App.tsx` 第 12 行：

```typescript
// 將 1500 改為更大的值（例如 3000 = 3公里）
const { restaurants, isLoading, error } = useRestaurants(
  userLocation,
  3000, // 搜尋半徑（公尺）
  true
)
```

---

### 錯誤 4：「Google Maps API 載入失敗」

#### 症狀
```
⚠️ Google Maps API 載入失敗：[錯誤訊息]
```

#### 常見錯誤訊息與解決方案

**「InvalidKeyMapError」**
- API Key 無效或格式錯誤
- 解決：
  1. 檢查金鑰是否正確複製（沒有多餘空格）
  2. 前往 Google Cloud Console 重新產生金鑰

**「ApiNotActivatedMapError」**
- Places API 未啟用
- 解決：
  1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
  2. API 和服務 > 程式庫
  3. 搜尋 "Places API"
  4. 點擊「啟用」

**「OverQueryLimitError」**
- 超過 API 配額限制
- 解決：
  1. 前往 Google Cloud Console
  2. 查看 API 使用量
  3. 考慮啟用計費或等待配額重置

**「RequestDeniedMapError」**
- API Key 的 HTTP 來源限制問題
- 解決：
  1. Google Cloud Console > 憑證
  2. 點擊您的 API Key
  3. 應用程式限制 > HTTP 來源（網站）
  4. 新增：
     - `http://localhost:3000/*`（開發環境）
     - `https://您的用戶名.github.io/*`（生產環境）

---

### 錯誤 5：「3D 場景無法載入或卡頓」

#### 症狀
- 3D 輪盤不顯示
- 動畫非常緩慢
- 瀏覽器當機

#### 解決方案

1. **檢查裝置效能**
   - Three.js 需要較好的 GPU
   - 較舊的手機可能無法流暢運行
   - 嘗試在較新的裝置上測試

2. **清除瀏覽器快取**
   ```
   Chrome: Ctrl+Shift+Del (Windows) / Cmd+Shift+Del (Mac)
   選擇「快取的圖片和檔案」
   清除
   ```

3. **檢查瀏覽器相容性**
   - Chrome 90+
   - Firefox 88+
   - Safari 14+
   - Edge 90+

4. **降低渲染品質**（未來功能）
   - 可以在設定中調整 3D 品質

---

### 錯誤 6：「部署後網站空白或 404」

#### 症狀
- GitHub Pages 網址返回 404
- 或頁面載入但所有資源 404

#### 解決方案

1. **確認 GitHub Pages 已啟用**
   - Settings > Pages
   - Source: `GitHub Actions`

2. **檢查 base path 設定**
   - 打開 `vite.config.ts`
   - 確認：
     ```typescript
     base: process.env.NODE_ENV === 'production' ? '/hungry-wheel/' : '/',
     ```
   - `/hungry-wheel/` 應該是您的倉庫名稱

3. **等待部署完成**
   - 部署需要 2-5 分鐘
   - 前往 Actions 確認 workflow 執行完成

4. **清除 CDN 快取**
   - GitHub Pages 使用 CDN
   - 更新可能需要幾分鐘才能全球生效
   - 嘗試無痕模式或強制重新整理（Ctrl+Shift+R）

---

## 🧪 除錯工具

### 檢查環境變數

在瀏覽器開發者工具的 Console 中執行：

```javascript
// 檢查 API Key 是否存在（不會顯示完整金鑰）
console.log('API Key 存在:', !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
console.log('環境:', import.meta.env.MODE)
console.log('是否為開發環境:', import.meta.env.DEV)
```

### 檢查位置權限

```javascript
navigator.permissions.query({name:'geolocation'}).then(result => {
  console.log('位置權限狀態:', result.state)
})
```

### 檢查 Three.js 支援

```javascript
console.log('WebGL 支援:', !!document.createElement('canvas').getContext('webgl2'))
```

---

## 📞 取得協助

如果上述解決方案都無法解決問題：

1. **檢查瀏覽器 Console**
   - F12 打開開發者工具
   - 查看 Console 頁籤的錯誤訊息
   - 截圖錯誤訊息

2. **檢查 Network 頁籤**
   - 查看是否有失敗的請求
   - 特別注意 Google Maps API 的請求

3. **查看 GitHub Issues**
   - 搜尋類似問題
   - 或建立新的 Issue

4. **提供以下資訊**
   - 錯誤訊息截圖
   - 瀏覽器類型和版本
   - 作業系統
   - 是在本地開發還是 GitHub Pages
   - Console 中的完整錯誤訊息

---

## ✅ 快速檢查清單

部署前檢查：
- [ ] `.env` 文件已設定（本地）
- [ ] GitHub Secret 已設定（生產）
- [ ] Google Maps API 已啟用
- [ ] API Key 沒有來源限制或已正確設定
- [ ] `vite.config.ts` base path 正確

運行時檢查：
- [ ] 位置權限已允許
- [ ] 使用 HTTPS 或 localhost
- [ ] 瀏覽器版本夠新
- [ ] 網路連線正常

---

最後更新：2025-10-17
