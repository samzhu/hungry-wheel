# 🗺️ 取得 Google Maps API 金鑰完整指南

## 📝 前置需求

- Google 帳號
- 信用卡（Google Cloud 需要，但有免費額度）

## 🚀 步驟 1：建立 Google Cloud 專案

### 1.1 前往 Google Cloud Console

訪問：https://console.cloud.google.com/

### 1.2 建立新專案

1. 點擊頂部的專案選擇器
2. 點擊「新增專案」
3. 輸入專案名稱：`Hungry Wheel`
4. 點擊「建立」
5. 等待專案建立完成（約 10-30 秒）

## 🔌 步驟 2：啟用 Places API

### 2.1 前往 API 程式庫

1. 在左側選單選擇「API 和服務」>「程式庫」
2. 或直接訪問：https://console.cloud.google.com/apis/library

### 2.2 搜尋並啟用 Places API

1. 在搜尋框輸入：`Places API`
2. 點擊「Places API」（注意不是 Places API (New)）
3. 點擊「啟用」按鈕
4. 等待啟用完成

## 🔑 步驟 3：建立 API 金鑰

### 3.1 前往憑證頁面

1. 在左側選單選擇「API 和服務」>「憑證」
2. 或直接訪問：https://console.cloud.google.com/apis/credentials

### 3.2 建立 API 金鑰

1. 點擊頂部的「+ 建立憑證」
2. 選擇「API 金鑰」
3. 系統會自動產生一個 API 金鑰
4. **重要**：立即複製這個金鑰！

### 3.3 金鑰格式範例

```
AIzaSyC1234567890abcdefghijklmnopqrstu
```

- 通常以 `AIza` 開頭
- 總長度約 39 個字元

## 🛡️ 步驟 4：設定 API 金鑰限制（建議）

### 4.1 限制應用程式

1. 點擊剛建立的 API 金鑰
2. 選擇「應用程式限制」
3. 選擇「HTTP 來源（網站）」
4. 新增以下網站：

   **本地開發：**
   ```
   http://localhost:3000/*
   http://localhost:*
   ```

   **GitHub Pages（生產環境）：**
   ```
   https://samzhu.github.io/*
   ```

5. 點擊「儲存」

### 4.2 限制 API

1. 在「API 限制」區段
2. 選擇「限制金鑰」
3. 勾選：
   - ✅ Places API
   - ✅ Maps JavaScript API（如果需要）
4. 點擊「儲存」

## 💰 步驟 5：了解定價與免費額度

### 5.1 新用戶福利（強烈推薦！）

**🎁 新用戶可獲得：**
- **$300 USD 免費額度**
- **90 天試用期**
- 試用期間完全不會被收費

**如何啟用試用：**
1. 首次使用 Google Cloud Platform
2. 綁定信用卡（僅驗證身份）
3. 自動獲得 $300 額度
4. 試用期結束前不會自動扣款

### 5.2 每月免費額度（2025年3月起新制）

⚠️ **重要變更**：2025年3月1日起，$200/月統一抵免已取消

**新的免費配額制度：**

| API 等級 | 每月免費次數 | 適用 API |
|---------|------------|---------|
| Essentials | 10,000 次 | Places Nearby Search |
| Pro | 5,000 次 | Maps JavaScript API |
| Enterprise | 1,000 次 | Premium APIs |

**Hungry Wheel 專案使用量估算：**
- 每位使用者 ≈ 1 次 Places API 呼叫
- **100 位使用者/月** = 完全免費 ✅
- **5,000 位使用者/月** = 可能完全免費 ✅
- **10,000+ 位使用者/月** = 可能產生小額費用

### 5.3 超過免費額度後的費用

**Places Nearby Search 定價：**
- 基本價格：$32 / 1,000 次請求
- 自動階梯折扣：使用量越大，單價越低

**範例計算：**
```
15,000 次呼叫/月：
- 前 10,000 次：免費
- 後 5,000 次：$32 × 5 = $160 USD
- 實際費用：約 $160 USD/月
```

### 5.4 設定帳單與預算警示

1. **連結信用卡**
   - 前往「帳單」頁面
   - 新增付款方式
   - 驗證身份

2. **設定預算警示**（強烈建議）
   - 前往「帳單」>「預算與快訊」
   - 建立預算：建議 $10 或 $50
   - 設定警示：達到 50%、90%、100% 時發送電子郵件

3. **監控使用量**
   - 前往「API 和服務」>「已啟用的 API」
   - 點擊「Places API」
   - 查看「配額」和「指標」

⚠️ **安全提示**：
- 一般個人專案**很難**超過免費額度
- 設定 API 金鑰限制（HTTP 來源）可防止濫用
- 定期檢查使用量，避免意外費用
- 如果擔心費用，可設定每日請求配額上限

### 5.5 省錢技巧

1. **實作快取機制**
   - 快取搜尋結果 30-60 分鐘
   - 減少重複 API 呼叫

2. **優化 API 使用**
   - 只在使用者明確需要時才呼叫 API
   - 避免頁面載入時自動搜尋

3. **使用費用計算器**
   - 訪問：https://cloud.google.com/products/calculator
   - 估算您的專案月費用

## 📦 步驟 6：將 API 金鑰加入專案

### 6.1 本地開發環境

1. 在專案根目錄建立 `.env` 文件：
   ```bash
   cp .env.example .env
   ```

2. 編輯 `.env` 文件：
   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstu
   ```

   ⚠️ **重要**：
   - 金鑰前後不要有空格
   - 不要使用引號
   - 確保完整複製金鑰

3. 重新啟動開發伺服器：
   ```bash
   npm run dev
   ```

### 6.2 GitHub Pages（生產環境）

1. 前往 GitHub 倉庫：
   ```
   https://github.com/samzhu/hungry-wheel/settings/secrets/actions
   ```

2. 點擊「New repository secret」

3. 填入資訊：
   - **Name（名稱）**：`VITE_GOOGLE_MAPS_API_KEY`
   - **Value（值）**：您的 API 金鑰

4. 點擊「Add secret」

5. 重新部署：
   - 推送新的 commit，或
   - 手動觸發 GitHub Actions workflow

## ✅ 步驟 7：驗證設定

### 7.1 測試本地環境

```bash
npm run dev
```

開啟 http://localhost:3000，如果能正常搜尋到餐廳，表示設定成功！

### 7.2 測試生產環境

訪問：`https://samzhu.github.io/hungry-wheel/`

允許位置權限，如果能搜尋到餐廳，表示設定成功！

## 🔍 驗證檢查清單

- [ ] Google Cloud 專案已建立
- [ ] Places API 已啟用
- [ ] API 金鑰已建立並複製
- [ ] 本地 `.env` 文件已設定（如果本地開發）
- [ ] GitHub Secret 已設定（如果部署到 GitHub Pages）
- [ ] API 金鑰限制已設定（可選但建議）
- [ ] 預算警示已設定（建議）
- [ ] 測試通過

## 🚨 常見問題

### Q1: 我沒有信用卡，可以使用嗎？

A: Google Cloud 需要信用卡驗證，但：
- 新用戶可能有免費試用額度
- 一般使用不會超過免費額度
- 可以設定嚴格的預算限制

### Q2: API 金鑰會過期嗎？

A: 不會自動過期，但您可以：
- 隨時刪除或停用金鑰
- 定期更換金鑰（安全最佳實踐）
- 設定金鑰的使用限制

### Q3: 我可以在多個專案使用同一個金鑰嗎？

A: 技術上可以，但建議：
- 每個專案使用獨立的金鑰
- 方便追蹤各專案的使用量
- 降低安全風險

### Q4: 如何監控 API 使用量？

A: 前往 Google Cloud Console：
1. 「API 和服務」>「已啟用的 API」
2. 點擊「Places API」
3. 查看「配額」和「指標」頁籤

### Q5: 如果洩漏了 API 金鑰怎麼辦？

A: 立即採取行動：
1. 前往憑證頁面
2. 刪除或停用該金鑰
3. 建立新的金鑰
4. 更新所有使用該金鑰的地方
5. 檢查帳單是否有異常使用

## 📚 相關資源

- [Google Maps Platform 文檔](https://developers.google.com/maps/documentation)
- [Places API 文檔](https://developers.google.com/maps/documentation/places/web-service)
- [API 金鑰最佳實踐](https://cloud.google.com/docs/authentication/api-keys)
- [價格計算器](https://cloud.google.com/products/calculator)

---

如果還有問題，請查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
