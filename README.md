# 🎡 Hungry Wheel - 美食抽籤輪盤

今天吃什麼？讓 Hungry Wheel 幫你決定！

## ✨ 功能特色

- 🎯 **智慧定位**：自動取得使用者位置，搜尋附近餐廳
- 🎨 **3D 視覺效果**：使用 Three.js 打造半 3D 抽籤輪盤
- 🎭 **流暢動畫**：GSAP 驅動的物理動畫效果
- 📱 **響應式設計**：完美支援桌面與行動裝置
- 🗺️ **Google Maps 整合**：使用最新 Places API (New) 取得餐廳資訊

## 🚀 技術棧

- **React 19.0** - 最新穩定版
- **TypeScript 5.7** - 類型安全
- **Vite 6.0** - 極速建構工具
- **Three.js 0.180** - 3D 渲染引擎
- **@react-three/fiber** - React 整合 Three.js
- **@react-three/drei** - Three.js 輔助工具
- **GSAP 3.13** - 專業動畫庫
- **Tailwind CSS 4.1** - 現代化 CSS 框架
- **Framer Motion** - React 動畫庫
- **Google Maps Places API** - 地圖與餐廳資料

## 📦 安裝

```bash
npm install
```

## 🔧 開發

```bash
npm run dev
```

預設會在 http://localhost:3000 啟動開發伺服器

## 🏗️ 建置

```bash
npm run build
```

## 🚀 部署到 GitHub Pages

本專案已設定自動部署到 GitHub Pages，方便在手機上測試。

### 快速部署步驟

1. **推送程式碼到 GitHub**
   ```bash
   git add .
   git commit -m "feat: 初始專案"
   git push origin main
   ```

2. **設定 Google Maps API Key**
   - 前往 GitHub 倉庫 > Settings > Secrets and variables > Actions
   - 新增 Secret：`VITE_GOOGLE_MAPS_API_KEY`（填入您的 API 金鑰）

3. **啟用 GitHub Pages**
   - 前往 Settings > Pages
   - Source 選擇：`GitHub Actions`

4. **訪問您的網站**
   ```
   https://samzhu.github.io/hungry-wheel/
   ```

📖 詳細部署指南請參閱 [DEPLOY.md](./DEPLOY.md)

## 📝 環境變數

1. 複製 `.env.example` 為 `.env`：
```bash
cp .env.example .env
```

2. 在 `.env` 文件中設定您的 Google Maps API 金鑰：
```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 如何取得 Google Maps API 金鑰

📖 **完整圖文教學**：
- 🎓 **[API_KEY_TUTORIAL.md](./API_KEY_TUTORIAL.md)** - 超詳細步驟指南（推薦新手）
- 📚 **[GET_API_KEY.md](./GET_API_KEY.md)** - 完整說明文檔

**快速 5 步驟**：
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案：`Hungry Wheel`
3. 啟用 **Places API**
4. 建立憑證 → **API 金鑰** → 複製金鑰
5. 加入 `.env` 文件：`VITE_GOOGLE_MAPS_API_KEY=你的金鑰`

💡 **提示**：Google Maps Platform 提供每月免費額度，一般個人使用不會產生費用。

💰 **詳細免費方案說明**：請參閱 [FREE_TIER_INFO.md](./FREE_TIER_INFO.md)

**快速摘要：**
- 🎁 新用戶：$300 USD 試用額度（90天）
- 🆓 每月免費：10,000 次 API 呼叫
- ✅ 個人專案：完全免費（< 10,000 使用者/月）
- 💵 超額費用：$32 / 1,000 次（有自動折扣）

## 🗂️ 專案結構

```
hungry-wheel/
├── src/
│   ├── components/        # React 組件
│   ├── services/          # API 服務
│   ├── hooks/             # 自訂 Hooks
│   ├── types/             # TypeScript 類型定義
│   ├── utils/             # 工具函數
│   └── assets/            # 靜態資源
├── public/                # 公開資源
└── index.html             # HTML 入口
```

## 📄 授權

MIT License

## 📸 功能展示

### 核心功能

1. **智慧定位** - 自動偵測使用者位置
2. **餐廳搜尋** - 使用 Google Places API 搜尋附近 1.5 公里內的餐廳
3. **3D 抽籤輪盤** - 互動式 3D 籤筒，滑鼠可旋轉視角
4. **流暢動畫** - GSAP 驅動的加速/減速動畫
5. **響應式設計** - 完美支援桌面與行動裝置

### 使用流程

1. 開啟網頁，允許位置存取權限
2. 系統自動搜尋附近餐廳
3. 點擊「開始抽籤」按鈕
4. 3D 籤筒開始旋轉，加速後減速停止
5. 顯示抽中的餐廳資訊
6. 可選擇「重新抽籤」

## 🎨 設計特色

- **半 3D 籤筒** - 使用 Three.js 實現立體視覺效果
- **玻璃擬態** - 現代化的 UI 設計風格
- **流暢過場** - Framer Motion 驅動的頁面轉場
- **動態光效** - 點光源與環境光營造氛圍
- **地面反射** - 增強 3D 場景真實感

## 🛠️ 技術亮點

### 前端架構
- React 19 最新功能
- TypeScript 嚴格模式
- Vite 6.0 極速建構

### 3D 渲染
- Three.js r180
- React Three Fiber 整合
- 自訂 Shader 與材質

### 動畫系統
- GSAP 3.13 時間軸動畫
- Framer Motion 聲明式動畫
- CSS3 過渡效果

### API 整合
- Google Maps Places API (New)
- Geolocation API
- 錯誤處理與重試機制

## 👨‍💻 開發狀態

✅ 專案核心功能已完成！

- [x] 專案架構設置（React 19 + Vite + TypeScript）
- [x] Google Maps Places API 整合
- [x] 地理定位功能
- [x] 3D 籤筒視覺效果（Three.js）
- [x] 抽籤動畫實作（GSAP）
- [x] UI/UX 優化（Tailwind + Framer Motion）
- [x] 響應式設計

### 未來改進計劃

- [ ] 音效與觸覺反饋（震動 API）
- [ ] PWA 支援（可安裝到桌面）
- [ ] 歷史記錄功能
- [ ] 餐廳篩選（價格、評分、營業中）
- [ ] 一鍵導航 開啟 googlemap
- [ ] 社群分享功能
- [ ] 深色模式支援