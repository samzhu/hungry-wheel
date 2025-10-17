# 🚀 Hungry Wheel 快速開始指南

## 1️⃣ 安裝依賴

```bash
npm install
```

## 2️⃣ 設定 Google Maps API 金鑰

### 取得 API 金鑰

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案（或選擇現有專案）
3. 啟用 **Places API (New)**：
   - 在側邊欄選擇「API 和服務」>「程式庫」
   - 搜尋「Places API」
   - 點擊「啟用」
4. 建立憑證：
   - 點擊「建立憑證」>「API 金鑰」
   - 複製產生的 API 金鑰

### 設定環境變數

```bash
# 複製範例檔案
cp .env.example .env

# 編輯 .env 文件，將 your_api_key_here 替換為您的 API 金鑰
```

您的 `.env` 文件應該如下：
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyC...你的金鑰...
```

## 3️⃣ 啟動開發伺服器

```bash
npm run dev
```

伺服器將在 http://localhost:3000 啟動

## 4️⃣ 使用專案

1. 開啟瀏覽器訪問 http://localhost:3000
2. 點擊「允許位置存取」（確保瀏覽器允許位置權限）
3. 等待搜尋附近餐廳
4. 點擊「開始抽籤」按鈕
5. 享受 3D 動畫，查看抽中的餐廳！

## 🔧 建置生產版本

```bash
npm run build
```

建置結果將輸出到 `dist` 資料夾

## 預覽生產版本

```bash
npm run preview
```

## ⚠️ 常見問題

### 無法取得位置
- 確認瀏覽器已允許位置權限
- 在 HTTPS 或 localhost 環境下使用（HTTP 可能被阻擋）

### API 金鑰錯誤
- 檢查 `.env` 文件是否正確設定
- 確認 Places API 已啟用
- 重新啟動開發伺服器

### 找不到餐廳
- 確認您的位置附近有餐廳
- 可以調整搜尋半徑（在 `src/App.tsx` 第 12 行）

### 3D 場景載入緩慢
- 這是正常的，首次載入 Three.js 需要時間
- 建議在生產環境使用程式碼分割和懶加載

## 📱 行動裝置測試

```bash
# 啟動伺服器並暴露到區域網路
npm run dev -- --host
```

然後使用手機訪問顯示的網路 URL

## 🎨 自訂設定

### 修改搜尋半徑
編輯 `src/App.tsx`：
```typescript
const { restaurants, isLoading, error } = useRestaurants(
  userLocation,
  1500, // 改為您想要的半徑（公尺）
  true
)
```

### 修改主題顏色
編輯 `tailwind.config.js` 的 `theme.extend.colors`

### 調整 3D 場景
編輯 `src/components/LotteryWheel.tsx` 的參數

## 💡 開發建議

- 使用 Chrome/Edge 開發者工具的「裝置模擬」測試響應式
- 建議使用 VSCode + Volar 擴充套件獲得最佳開發體驗
- TypeScript 嚴格模式已啟用，確保程式碼品質

## 📚 更多資訊

查看完整文件：[README.md](./README.md)
