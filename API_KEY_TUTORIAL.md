# 🎓 Google Maps API 金鑰建立教學（圖文並茂版）

## 📝 完整步驟指南

### 🌐 步驟 1：開啟 Google Cloud Console

1. **前往網址**：
   ```
   https://console.cloud.google.com/
   ```

2. **使用 Google 帳號登入**
   - 選擇或輸入您的 Google 帳號
   - 完成登入

---

### 📦 步驟 2：建立新專案

#### 2.1 點擊專案選擇器

在頁面**頂部**找到專案名稱（通常顯示 "My First Project" 或 "選取專案"）

```
位置：頂部導覽列 → 左側（Google Cloud 標誌旁）
圖示：📋 專案名稱 + 下拉箭頭
```

#### 2.2 建立新專案

1. 在彈出視窗中，點擊右上角的 **「新增專案」** 按鈕

2. 填寫專案資訊：
   ```
   專案名稱：Hungry Wheel
   位置：無機構（或保持預設）
   ```

3. 點擊 **「建立」** 按鈕

4. 等待 10-30 秒，專案建立完成

5. 系統會自動切換到新專案

💡 **提示**：確認頂部顯示的專案名稱已變更為 "Hungry Wheel"

---

### 🔌 步驟 3：啟用 Places API

#### 3.1 前往 API 程式庫

**方法 A：使用側邊欄**
```
左側選單 → API 和服務 → 程式庫
```

**方法 B：直接訪問**
```
https://console.cloud.google.com/apis/library
```

#### 3.2 搜尋 Places API

1. 在頁面頂部的搜尋框輸入：
   ```
   Places API
   ```

2. 在搜尋結果中找到 **"Places API"**
   - ⚠️ 注意：不是 "Places API (New)"
   - 圖示：📍 紅色地標圖示

3. 點擊進入 Places API 頁面

#### 3.3 啟用 API

1. 點擊藍色的 **「啟用」** 按鈕

2. 等待 5-10 秒，API 啟用完成

3. 頁面會跳轉到 API 詳情頁面

✅ **確認**：頁面頂部顯示 "API 已啟用"

---

### 🔐 步驟 4：建立 API 金鑰

#### 4.1 前往憑證頁面

**在 Places API 頁面中**，點擊頂部的 **「建立憑證」** 按鈕

或者：

**使用側邊欄**
```
左側選單 → API 和服務 → 憑證
```

**直接訪問**
```
https://console.cloud.google.com/apis/credentials
```

#### 4.2 建立新的 API 金鑰

1. 點擊頁面頂部的 **「+ 建立憑證」** 按鈕

2. 在下拉選單中選擇 **「API 金鑰」**

3. 系統會自動產生 API 金鑰

4. **重要！** 立即複製顯示的 API 金鑰

   ```
   範例格式：AIzaSyC1234567890abcdefghijklmnopqrstu
   ```

5. 點擊 **「複製」** 按鈕或手動選取並複製

#### 4.3 儲存 API 金鑰

**⚠️ 非常重要：立即儲存金鑰！**

將金鑰貼到安全的地方：
- 📝 記事本（暫時）
- 🔒 密碼管理器（推薦）
- 💾 專案的 .env 文件（最終目的地）

---

### 🛡️ 步驟 5：限制 API 金鑰（強烈建議）

#### 為什麼要限制？
- 防止他人盜用您的金鑰
- 避免意外產生大量費用
- 提高安全性

#### 5.1 編輯 API 金鑰

在憑證頁面：

1. 找到剛建立的 API 金鑰

2. 點擊金鑰名稱（通常是 "API 金鑰 1"）

3. 進入編輯頁面

#### 5.2 設定應用程式限制

找到 **「應用程式限制」** 區段：

1. 選擇 **「HTTP 來源（網站）」**

2. 在 **「網站限制」** 中新增以下網址：

   **本地開發環境：**
   ```
   http://localhost:3000/*
   http://localhost:*
   http://127.0.0.1:*
   ```

   **GitHub Pages（生產環境）：**
   ```
   https://samzhu.github.io/*
   https://blog.samzhu.dev/*
   ```

   💡 **說明**：
   - 如果您有自訂網域，兩個都要加入
   - 確保 `/*` 通配符涵蓋子路徑（如 `/hungry-wheel/`）

3. 點擊 **「新增項目」** 來新增每個網址

#### 5.3 設定 API 限制

找到 **「API 限制」** 區段：

1. 選擇 **「限制金鑰」**

2. 在下拉選單中勾選：
   - ✅ **Places API**
   - ✅ Maps JavaScript API（如果需要）

3. 點擊 **「確定」**

#### 5.4 儲存設定

點擊頁面底部的 **「儲存」** 按鈕

⏰ 等待 2-5 分鐘讓設定生效

---

### 💳 步驟 6：設定帳單（必要步驟）

#### 6.1 為什麼需要設定帳單？

- Google 要求所有使用 Maps API 的專案都要綁定帳單帳戶
- **不用擔心**：有免費額度，個人使用通常不會產生費用
- 新用戶還有 $300 試用額度

#### 6.2 啟用帳單

如果系統提示需要設定帳單：

1. 點擊 **「啟用帳單」** 按鈕

2. 選擇 **「建立帳單帳戶」**

3. 填寫資訊：
   - **帳戶類型**：個人
   - **國家/地區**：台灣
   - **地址**：您的地址
   - **付款方式**：信用卡資訊

4. ✅ 勾選同意服務條款

5. 點擊 **「開始免費試用」** 或 **「提交並啟用帳單」**

#### 6.3 設定預算警示（強烈建議）

**保護自己的荷包！**

1. 前往：
   ```
   左側選單 → 帳單 → 預算與快訊
   ```

2. 點擊 **「建立預算」**

3. 設定預算：
   ```
   預算名稱：Hungry Wheel 預算
   金額：$10 USD（或您覺得合適的金額）
   ```

4. 設定警示臨界值：
   - 50%（$5）
   - 90%（$9）
   - 100%（$10）

5. 填寫通知電子郵件

6. 點擊 **「完成」**

---

### 📦 步驟 7：將 API 金鑰加入專案

#### 7.1 本地開發環境

**在專案根目錄：**

1. **複製範例文件：**
   ```bash
   cp .env.example .env
   ```

2. **編輯 .env 文件：**
   ```bash
   # macOS/Linux
   nano .env

   # Windows
   notepad .env
   ```

3. **貼上 API 金鑰：**
   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyC你的完整金鑰在這裡
   ```

   **⚠️ 注意事項：**
   - 金鑰前後不要有空格
   - 不要使用引號 `""` 或單引號 `''`
   - 確保完整複製金鑰（通常 39 個字元）
   - 等號 `=` 前後不要有空格

4. **儲存文件**
   - nano：按 `Ctrl + O` 儲存，`Ctrl + X` 離開
   - notepad：按 `Ctrl + S` 儲存

5. **重新啟動開發伺服器：**
   ```bash
   # 停止當前伺服器（Ctrl + C）
   npm run dev
   ```

#### 7.2 GitHub Pages（生產環境）

**設定 GitHub Secret：**

1. **前往 GitHub 倉庫設定：**
   ```
   https://github.com/samzhu/hungry-wheel/settings/secrets/actions
   ```

2. **點擊「New repository secret」**

3. **填寫資訊：**
   ```
   Name: VITE_GOOGLE_MAPS_API_KEY
   Value: [貼上您的 API 金鑰]
   ```

   **⚠️ 名稱必須完全一致（區分大小寫）！**

4. **點擊「Add secret」**

5. **觸發重新部署：**
   ```bash
   # 方法 1：推送新的 commit
   git commit --allow-empty -m "chore: trigger redeploy"
   git push origin main

   # 方法 2：手動觸發（在 GitHub Actions 頁面）
   ```

---

### ✅ 步驟 8：驗證設定

#### 8.1 測試本地環境

```bash
# 啟動開發伺服器
npm run dev
```

**開啟瀏覽器：**
```
http://localhost:3000
```

**測試步驟：**
1. ✅ 頁面正常載入
2. ✅ 允許位置權限
3. ✅ 等待搜尋餐廳（約 2-5 秒）
4. ✅ 顯示餐廳列表
5. ✅ 3D 輪盤正常運作

**如果成功**：恭喜！API 金鑰設定正確 🎉

**如果失敗**：查看瀏覽器 Console（按 F12）的錯誤訊息

#### 8.2 常見錯誤排查

**錯誤 1：「API 金鑰未設定」**
```
解決：檢查 .env 文件是否存在且格式正確
```

**錯誤 2：「InvalidKeyMapError」**
```
解決：
1. 檢查金鑰是否完整複製
2. 確認 Places API 已啟用
3. 等待 2-5 分鐘讓設定生效
```

**錯誤 3：「ApiNotActivatedMapError」**
```
解決：返回 Google Cloud Console 啟用 Places API
```

**錯誤 4：「RefererNotAllowedMapError」**
```
解決：
1. 檢查 API 金鑰的 HTTP 來源設定
2. 確認已加入 http://localhost:3000/*
3. 暫時移除 HTTP 來源限制測試
```

---

## 🎉 完成！

恭喜您成功建立並設定 Google Maps API 金鑰！

### 📋 完成檢查清單

- [x] Google Cloud 專案已建立
- [x] Places API 已啟用
- [x] API 金鑰已建立並複製
- [x] API 金鑰限制已設定
- [x] 帳單帳戶已啟用
- [x] 預算警示已設定
- [x] 本地 .env 文件已設定
- [x] 開發伺服器測試通過

### 🔗 下一步

- 📖 閱讀 [FREE_TIER_INFO.md](./FREE_TIER_INFO.md) 了解免費額度
- 🚀 查看 [DEPLOY.md](./DEPLOY.md) 學習部署到 GitHub Pages
- 🔧 遇到問題？參考 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 💡 實用提示

### 保護您的 API 金鑰

1. **永遠不要將 .env 文件提交到 Git**
   ```bash
   # .gitignore 已包含
   .env
   ```

2. **不要在程式碼中寫死金鑰**
   ```javascript
   // ❌ 錯誤
   const apiKey = 'AIzaSyC...'

   // ✅ 正確
   const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
   ```

3. **定期檢查使用量**
   ```
   Google Cloud Console → API 和服務 → 已啟用的 API → Places API
   ```

4. **如果金鑰洩漏**
   - 立即刪除舊金鑰
   - 建立新金鑰
   - 更新所有使用該金鑰的地方

### 最佳實踐

1. **開發/生產使用不同金鑰**
   - 開發：寬鬆的限制，方便測試
   - 生產：嚴格的限制，提高安全性

2. **為不同專案建立不同金鑰**
   - 方便追蹤使用量
   - 降低安全風險

3. **定期審查權限**
   - 移除不需要的 API 權限
   - 更新 HTTP 來源限制

---

## 📞 需要幫助？

- 💬 查看 [常見問題](./TROUBLESHOOTING.md#常見問題)
- 📧 檢視 [Google Maps Platform 文檔](https://developers.google.com/maps/documentation)
- 🔍 搜尋 [Stack Overflow](https://stackoverflow.com/questions/tagged/google-maps-api-3)

---

**祝您開發順利！** 🚀
