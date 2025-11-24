# 自動化測試流程

1. 告訴你的 LLM 執行以下流程
```
https://www.saucedemo.com/ 是一個模擬電商的網站，包含登入驗證、商品陳列、購物車和結帳的功能，幫我用 @.github/prompt/playwright-manual-test-report.md 描述的指引探索此網站
```

2. 等它完成探索報告 (./tests/saucedemo-manual-test-report.md) 和測試檔案 (./tests/saucedemo.spec.ts)

3. 查看測試結果 -> 在此專案根目錄下執行以下指令

a. 確認系統中有 nodejs 環境和 nodejs 版本是否大於 v18 以上，沒有 nvm 的話要去安裝一下
```
$ nvm current
$ nvm use {version}
```

b. 在本地端下載專案內的套件
```
$ npm install -g pnpm
$ pnpm install
```

c. 重跑測試
```
$ pnpm exec playwright test tests/{測試檔案名稱} --reporter=html
ex: pnpm exec playwright test tests/saucedemo.spec.ts --reporter=html

or
// 已經配置在 package.json
$ pnpm test

```

d. 查看結果
```
$ pnpm exec playwright show-report

or
// 已經配置在 package.json
$ pnpm test:report
```

## 補充
簡報放在 ./powerpoint/index.html，在網頁上直接打開就能看到了
