# SauceDemo 測試套件

## 概述

此目錄包含針對 [SauceDemo](https://www.saucedemo.com/) 電商網站的完整測試套件，涵蓋登入、商品瀏覽、購物車和結帳功能。

## 文件結構

```
tests/
├── saucedemo.spec.ts              # 自動化測試套件
├── saucedemo-manual-test-report.md  # 手動測試報告
├── screenshots/                   # 測試截圖
│   ├── login-page.png
│   ├── login-error-empty.png
│   ├── login-error-invalid.png
│   ├── login-error-locked.png
│   ├── products-page.png
│   ├── products-sort-*.png
│   ├── product-detail.png
│   ├── cart-*.png
│   ├── checkout-*.png
│   └── checkout-complete.png
└── README.md                     # 本文件
```

## 測試套件內容

### 1. 登入功能測試 (4 個測試)
- ✅ 成功登入
- ✅ 空白欄位驗證
- ✅ 無效帳號密碼處理
- ✅ 鎖定使用者處理

### 2. 商品展示和排序測試 (5 個測試)
- ✅ 顯示所有 6 個商品
- ✅ 價格排序（低到高）
- ✅ 價格排序（高到低）
- ✅ 名稱排序（Z到A）
- ✅ 商品詳細頁面導航

### 3. 購物車功能測試 (5 個測試)
- ✅ 加入商品並更新徽章
- ✅ 加入多個商品
- ✅ 顯示購物車內容
- ✅ 從購物車移除商品
- ✅ 從商品頁面移除商品

### 4. 結帳流程測試 (6 個測試)
- ✅ 空表單驗證
- ✅ 缺少姓氏驗證
- ✅ 缺少郵遞區號驗證
- ✅ 完整結帳流程
- ✅ 價格計算驗證
- ✅ 取消結帳功能

### 5. 登出功能測試 (1 個測試)
- ✅ 成功登出

## 執行測試

### 執行所有測試

```bash
# 使用預設報告器
pnpm exec playwright test tests/saucedemo.spec.ts

# 使用列表報告器（顯示詳細進度）
pnpm exec playwright test tests/saucedemo.spec.ts --reporter=list

# 生成 HTML 報告
pnpm exec playwright test tests/saucedemo.spec.ts --reporter=html
```

### 執行特定測試組

```bash
# 只執行登入測試
pnpm exec playwright test tests/saucedemo.spec.ts -g "Login Functionality"

# 只執行購物車測試
pnpm exec playwright test tests/saucedemo.spec.ts -g "Shopping Cart"

# 只執行結帳測試
pnpm exec playwright test tests/saucedemo.spec.ts -g "Checkout Process"
```

### 偵錯模式

```bash
# 以偵錯模式執行測試
pnpm exec playwright test tests/saucedemo.spec.ts --debug

# 執行特定測試並開啟 UI 模式
pnpm exec playwright test tests/saucedemo.spec.ts --ui
```

### 查看測試報告

```bash
# 開啟最新的 HTML 報告
pnpm exec playwright show-report
```

## 測試結果

### 最新測試執行結果

```
✅ 21 passed (15.8s)
```

所有測試都成功通過！測試涵蓋：
- 正常使用流程
- 錯誤處理和驗證
- 邊界情況測試

## 測試覆蓋功能

### 已測試功能
✅ 使用者認證（成功和失敗情境）
✅ 表單驗證（登入和結帳）
✅ 商品列表展示
✅ 商品排序功能
✅ 商品詳細資訊頁面
✅ 購物車操作（新增、移除）
✅ 購物車徽章更新
✅ 結帳流程（資訊填寫、總覽、完成）
✅ 價格計算和稅金
✅ 登出功能

### 未來可擴展的測試
- 其他使用者類型測試（problem_user, performance_glitch_user 等）
- 空購物車結帳測試
- 瀏覽器相容性測試
- 行動裝置響應式測試
- 效能測試
- 無障礙測試

## 測試資料

### 可用的測試帳號

| 使用者名稱 | 密碼 | 用途 |
|-----------|------|------|
| standard_user | secret_sauce | 標準使用者（主要測試帳號） |
| locked_out_user | secret_sauce | 鎖定使用者（測試錯誤處理） |
| problem_user | secret_sauce | 有問題的使用者 |
| performance_glitch_user | secret_sauce | 效能延遲使用者 |
| error_user | secret_sauce | 錯誤使用者 |
| visual_user | secret_sauce | 視覺使用者 |

## 手動測試報告

完整的手動測試報告請參閱：
- [saucedemo-manual-test-report.md](./saucedemo-manual-test-report.md)

報告內容包括：
- 詳細的測試步驟
- 預期和實際結果
- 測試截圖
- 發現的問題和建議

## 測試截圖

所有測試過程中捕獲的截圖都存儲在 `screenshots/` 目錄中，包括：
- 登入頁面（正常和錯誤狀態）
- 商品頁面（不同排序方式）
- 購物車頁面
- 結帳流程各階段
- 訂單完成頁面

## 相關文檔

- [Playwright 官方文檔](https://playwright.dev/)
- [SauceDemo 網站](https://www.saucedemo.com/)
- [專案根目錄 README](../README.md)

## 貢獻

如需新增或修改測試，請遵循以下原則：
1. 保持測試獨立性（每個測試可單獨執行）
2. 使用描述性的測試名稱
3. 適當使用 `beforeEach` 處理通用設置
4. 使用 Playwright 的自動等待機制（避免手動 setTimeout）
5. 使用 `data-test` 屬性選擇元素（更穩定）
6. 新增測試時同步更新本文檔

---

**最後更新：** 2025-11-20
**測試套件版本：** 1.0.0
**Playwright 版本：** 1.56.1
