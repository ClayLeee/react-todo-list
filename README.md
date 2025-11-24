# 自動化測試流程

1. 在本地端開啓此專案
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

c. 開啓專案
```
$ pnpm dev
```

2. 告訴你的 LLM 執行以下流程
```
這個專案是一個 todo list 的 App，包含日曆界面、todo list 的 CRUD 和本地儲存資料的功能，幫我用 @.github/prompt/playwright-manual-test-report.md 描述的指引探索此網站
```

3. 等它完成測試檔案 (./tests/todo-app.spec.ts)

4. 查看測試結果 -> 在此專案根目錄下執行以下指令

a. 重跑測試
```
$ pnpm exec playwright test tests/{測試檔案名稱} --reporter=html
ex: pnpm exec playwright test tests/todo-app.spec.ts --reporter=html

or
// 已經配置在 package.json
$ pnpm test

```
b. 查看結果
```
$ pnpm exec playwright show-report

or
// 已經配置在 package.json
$ pnpm test:report
```

## 補充
簡報放在 ./powerpoint/index.html，在網頁上直接打開就能看到了
