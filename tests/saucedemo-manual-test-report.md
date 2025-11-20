# SauceDemo 手動測試報告

## 測試日期
2025-11-20

## 測試網站
https://www.saucedemo.com/

## 測試概述
本報告記錄了對 SauceDemo 電商網站的完整手動探索測試，涵蓋登入驗證、商品陳列、購物車和結帳功能的正常流程和邊界情況。

---

## 1. 登入功能測試

### 1.1 測試場景：成功登入
**步驟：**
1. 導航到 https://www.saucedemo.com/
2. 輸入使用者名稱：`standard_user`
3. 輸入密碼：`secret_sauce`
4. 點擊 Login 按鈕

**預期結果：**
- 成功導航到商品頁面 (inventory.html)
- 顯示 "Products" 標題
- 顯示所有商品

**實際結果：**
✅ **通過** - 成功登入並導航到商品頁面

**截圖：** `screenshots/login-page.png`, `screenshots/products-page.png`

---

### 1.2 測試場景：空白欄位登入
**步驟：**
1. 在登入頁面，不填寫任何資料
2. 直接點擊 Login 按鈕

**預期結果：**
- 顯示錯誤訊息
- 不允許登入

**實際結果：**
✅ **通過** - 顯示錯誤訊息 "Epic sadface: Username is required"
- 欄位顯示紅色錯誤圖示
- 保持在登入頁面

**截圖：** `screenshots/login-error-empty.png`

---

### 1.3 測試場景：錯誤的帳號密碼
**步驟：**
1. 輸入無效的使用者名稱：`invalid_user`
2. 輸入錯誤的密碼：`wrong_password`
3. 點擊 Login 按鈕

**預期結果：**
- 顯示錯誤訊息
- 不允許登入

**實際結果：**
✅ **通過** - 顯示錯誤訊息 "Epic sadface: Username and password do not match any user in this service"
- 保持在登入頁面

**截圖：** `screenshots/login-error-invalid.png`

---

### 1.4 測試場景：鎖定的使用者登入
**步驟：**
1. 輸入鎖定的使用者名稱：`locked_out_user`
2. 輸入正確的密碼：`secret_sauce`
3. 點擊 Login 按鈕

**預期結果：**
- 顯示使用者被鎖定的錯誤訊息
- 不允許登入

**實際結果：**
✅ **通過** - 顯示錯誤訊息 "Epic sadface: Sorry, this user has been locked out."
- 保持在登入頁面

**截圖：** `screenshots/login-error-locked.png`

---

## 2. 商品陳列和排序功能測試

### 2.1 測試場景：商品列表顯示
**步驟：**
1. 成功登入後進入商品頁面
2. 檢查商品列表

**預期結果：**
- 顯示所有 6 個商品
- 每個商品顯示圖片、名稱、描述和價格
- 每個商品有 "Add to cart" 按鈕

**實際結果：**
✅ **通過** - 所有商品正確顯示：
1. Sauce Labs Backpack - $29.99
2. Sauce Labs Bike Light - $9.99
3. Sauce Labs Bolt T-Shirt - $15.99
4. Sauce Labs Fleece Jacket - $49.99
5. Sauce Labs Onesie - $7.99
6. Test.allTheThings() T-Shirt (Red) - $15.99

**截圖：** `screenshots/products-page.png`

---

### 2.2 測試場景：價格排序（低到高）
**步驟：**
1. 在商品頁面，點擊排序下拉選單
2. 選擇 "Price (low to high)"

**預期結果：**
- 商品按價格從低到高排序

**實際結果：**
✅ **通過** - 商品正確排序：
1. Sauce Labs Onesie - $7.99
2. Sauce Labs Bike Light - $9.99
3. Sauce Labs Bolt T-Shirt - $15.99
4. Test.allTheThings() T-Shirt (Red) - $15.99
5. Sauce Labs Backpack - $29.99
6. Sauce Labs Fleece Jacket - $49.99

**截圖：** `screenshots/products-sort-price-low-high.png`

---

### 2.3 測試場景：價格排序（高到低）
**步驟：**
1. 選擇 "Price (high to low)"

**預期結果：**
- 商品按價格從高到低排序

**實際結果：**
✅ **通過** - 商品正確排序（Fleece Jacket 在最上方，Onesie 在最下方）

**截圖：** `screenshots/products-sort-price-high-low.png`

---

### 2.4 測試場景：名稱排序（Z到A）
**步驟：**
1. 選擇 "Name (Z to A)"

**預期結果：**
- 商品按名稱從 Z 到 A 排序

**實際結果：**
✅ **通過** - 商品按名稱反向排序

**截圖：** `screenshots/products-sort-name-z-a.png`

---

### 2.5 測試場景：商品詳細資訊頁面
**步驟：**
1. 點擊商品名稱或圖片（如 Sauce Labs Backpack）

**預期結果：**
- 導航到商品詳細頁面
- 顯示完整的商品資訊
- 有 "Back to products" 按鈕
- 有 "Add to cart" 按鈕

**實際結果：**
✅ **通過** - 正確顯示商品詳細資訊
- URL 變更為 inventory-item.html?id=4
- 所有元素正確顯示

**截圖：** `screenshots/product-detail.png`

---

## 3. 購物車功能測試

### 3.1 測試場景：加入商品到購物車
**步驟：**
1. 在商品列表頁面
2. 點擊 "Sauce Labs Onesie" 的 "Add to cart" 按鈕

**預期結果：**
- 購物車徽章顯示 "1"
- 按鈕文字變更為 "Remove"

**實際結果：**
✅ **通過**
- 購物車徽章正確顯示 "1"
- 按鈕變更為紅色的 "Remove" 按鈕

**截圖：** `screenshots/cart-badge-one-item.png`

---

### 3.2 測試場景：加入多個商品
**步驟：**
1. 繼續點擊 "Sauce Labs Bike Light" 的 "Add to cart" 按鈕

**預期結果：**
- 購物車徽章更新為 "2"

**實際結果：**
✅ **通過** - 購物車徽章正確更新為 "2"

**截圖：** `screenshots/cart-badge-two-items.png`

---

### 3.3 測試場景：檢視購物車
**步驟：**
1. 點擊右上角的購物車圖示

**預期結果：**
- 導航到購物車頁面 (cart.html)
- 顯示 "Your Cart" 標題
- 列出所有已加入的商品
- 每個商品顯示數量、名稱、描述和價格
- 每個商品有 "Remove" 按鈕
- 有 "Continue Shopping" 和 "Checkout" 按鈕

**實際結果：**
✅ **通過** - 購物車頁面正確顯示所有資訊
- 顯示 Sauce Labs Onesie ($7.99)
- 顯示 Sauce Labs Bike Light ($9.99)
- 所有按鈕正確顯示

**截圖：** `screenshots/cart-page.png`

---

### 3.4 測試場景：從購物車移除商品
**步驟：**
1. 在購物車頁面
2. 點擊 "Sauce Labs Bike Light" 的 "Remove" 按鈕

**預期結果：**
- 商品從購物車移除
- 購物車徽章更新為 "1"
- 只剩下一個商品

**實際結果：**
✅ **通過**
- Bike Light 成功移除
- 購物車徽章更新為 "1"
- 只顯示 Sauce Labs Onesie

**截圖：** `screenshots/cart-after-remove.png`

---

## 4. 結帳流程測試

### 4.1 測試場景：表單驗證（空白欄位）
**步驟：**
1. 在購物車頁面點擊 "Checkout" 按鈕
2. 不填寫任何資料
3. 直接點擊 "Continue" 按鈕

**預期結果：**
- 顯示錯誤訊息
- 不允許繼續

**實際結果：**
✅ **通過** - 顯示錯誤訊息 "Error: First Name is required"
- 所有欄位顯示紅色錯誤圖示
- 保持在資訊填寫頁面

**截圖：** `screenshots/checkout-info.png`, `screenshots/checkout-validation-error.png`

---

### 4.2 測試場景：填寫結帳資訊並繼續
**步驟：**
1. 填寫 First Name: `John`
2. 填寫 Last Name: `Doe`
3. 填寫 Zip/Postal Code: `12345`
4. 點擊 "Continue" 按鈕

**預期結果：**
- 導航到結帳總覽頁面 (checkout-step-two.html)
- 顯示 "Checkout: Overview" 標題

**實際結果：**
✅ **通過** - 成功導航到總覽頁面

---

### 4.3 測試場景：結帳總覽和價格計算
**步驟：**
1. 檢查結帳總覽頁面內容

**預期結果：**
- 顯示所有購物車中的商品
- 顯示付款資訊
- 顯示運送資訊
- 正確計算價格：
  - Item total
  - Tax
  - Total

**實際結果：**
✅ **通過**
- 商品：Sauce Labs Onesie
- Payment Information: SauceCard #31337
- Shipping Information: Free Pony Express Delivery!
- Item total: $7.99
- Tax: $0.64 (約 8% 稅率)
- Total: $8.63
- 價格計算正確

**截圖：** `screenshots/checkout-overview.png`

---

### 4.4 測試場景：完成訂單
**步驟：**
1. 在結帳總覽頁面點擊 "Finish" 按鈕

**預期結果：**
- 導航到訂單完成頁面 (checkout-complete.html)
- 顯示 "Checkout: Complete!" 標題
- 顯示感謝訊息
- 有 "Back Home" 按鈕

**實際結果：**
✅ **通過**
- 成功完成訂單
- 顯示 "Thank you for your order!"
- 顯示訂單已派送的訊息
- 購物車徽章消失（訂單已完成）

**截圖：** `screenshots/checkout-complete.png`

---

## 測試總結

### 測試統計
- **總測試場景數：** 16
- **通過：** 16
- **失敗：** 0
- **通過率：** 100%

### 主要發現

#### 正向功能
✅ 所有核心功能正常運作：
1. 登入驗證機制完善
2. 商品排序功能正確
3. 購物車操作流暢
4. 結帳流程完整
5. 表單驗證有效

#### 使用者體驗
✅ 良好的使用者體驗：
1. 錯誤訊息清楚明確
2. 視覺反饋即時（購物車徽章、按鈕狀態變化）
3. 導航流程合理
4. 價格計算透明

#### 邊界情況處理
✅ 妥善處理邊界情況：
1. 空白欄位驗證
2. 錯誤登入資訊處理
3. 鎖定使用者訪問限制
4. 表單必填欄位驗證

### 建議

#### 功能改進建議
1. 可以考慮增加商品數量調整功能（目前只能移除或重新加入）
2. 可以提供訂單歷史記錄功能
3. 可以增加商品搜尋和篩選功能

#### 測試建議
1. 需要進一步測試其他使用者類型（problem_user, performance_glitch_user 等）
2. 應該測試空購物車結帳情況
3. 應該測試表單其他驗證情況（如只填部分欄位）
4. 需要測試跨瀏覽器相容性

---

## 附件

### 可用的使用者帳號
測試期間發現以下使用者帳號：
- `standard_user` - 標準使用者 ✅
- `locked_out_user` - 鎖定的使用者 🔒
- `problem_user` - 有問題的使用者
- `performance_glitch_user` - 效能延遲使用者
- `error_user` - 錯誤使用者
- `visual_user` - 視覺使用者

所有使用者的密碼：`secret_sauce`

### 測試環境
- 測試工具：Playwright Browser Extension (MCP)
- 瀏覽器：Chromium (Playwright)
- 測試日期：2025-11-20
- 網站版本：當前生產版本

---

**報告產生時間：** 2025-11-20
**測試執行者：** Automated Test Suite
