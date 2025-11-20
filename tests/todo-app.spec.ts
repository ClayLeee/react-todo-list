import { test, expect } from '@playwright/test';

test.describe('Todo List Calendar App', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app and clear localStorage
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test.describe('Calendar Navigation', () => {
    test('should display current year and month', async ({ page }) => {
      // Verify initial calendar display
      await expect(page.getByText('2025 年')).toBeVisible();
      await expect(page.getByText('十一月')).toBeVisible();
    });

    test('should navigate between months', async ({ page }) => {
      // Click next month button
      await page.getByRole('button').nth(3).click();
      await expect(page.getByText('十二月')).toBeVisible();

      // Click previous month button
      await page.getByRole('button').nth(2).click();
      await expect(page.getByText('十一月')).toBeVisible();
    });

    test('should navigate between years', async ({ page }) => {
      // Click next year button
      await page.getByRole('button').nth(1).click();
      await expect(page.getByText('2026 年')).toBeVisible();

      // Click previous year button
      await page.getByRole('button').first().click();
      await expect(page.getByText('2025 年')).toBeVisible();
    });

    test('should show selected date in sidebar', async ({ page }) => {
      // Click on date 20
      await page.getByText('20+', { exact: false }).click();

      // Verify sidebar shows selected date
      await expect(page.getByRole('heading', { name: '2025 年 11 月 20 日' })).toBeVisible();
      await expect(page.getByText('這一天還沒有 Todo')).toBeVisible();
    });
  });

  test.describe('Todo CRUD Operations', () => {
    test('should create a new todo with all fields', async ({ page }) => {
      // Click on date 20
      await page.getByText('20+', { exact: false }).click();

      // Click the + button to open form
      await page.locator('.mt-1\\.5.flex-shrink-0.w-full.py-1.rounded.text-\\[10px\\].font-medium.transition-colors.bg-blue-50').first().click();

      // Verify form is open
      await expect(page.getByRole('heading', { name: '新增 Todo' })).toBeVisible();

      // Fill in todo details
      await page.getByRole('textbox', { name: '輸入標題' }).fill('完成測試報告');
      await page.getByRole('textbox', { name: '輸入描述' }).fill('撰寫 Playwright 自動化測試報告並提交給團隊');
      await page.locator('input[type="time"]').fill('14:00');
      await page.getByRole('textbox', { name: '輸入地點' }).fill('會議室 A');
      await page.getByRole('button', { name: '高' }).click();

      // Add tag
      await page.getByRole('textbox', { name: '輸入標籤後按 Enter' }).fill('工作');
      await page.getByRole('button', { name: '新增' }).nth(1).click();

      // Submit form
      await page.getByRole('button', { name: '新增' }).nth(2).click();

      // Verify todo is created and displayed
      await expect(page.getByText('完成測試報告').first()).toBeVisible();
      await expect(page.getByRole('heading', { name: '完成測試報告' })).toBeVisible();
      await expect(page.getByText('撰寫 Playwright 自動化測試報告並提交給團隊')).toBeVisible();
      await expect(page.getByText('14:00')).toBeVisible();
      await expect(page.getByText('會議室 A')).toBeVisible();
      await expect(page.getByText('高')).toBeVisible();
      await expect(page.getByText('工作')).toBeVisible();
    });

    test('should create a todo with only required field (title)', async ({ page }) => {
      // Click on date 21
      await page.getByText('21+', { exact: false }).click();

      // Open form
      await page.locator('.mt-1\\.5.flex-shrink-0.w-full.py-1.rounded.text-\\[10px\\].font-medium.transition-colors.bg-blue-50').first().click();

      // Fill only title
      await page.getByRole('textbox', { name: '輸入標題' }).fill('簡單任務');

      // Submit - find the "新增" button within the form
      await page.getByRole('button', { name: '新增' }).filter({ hasText: '新增' }).last().click();

      // Verify todo is created
      await expect(page.getByText('簡單任務').first()).toBeVisible();
    });

    test('should view todo details by clicking on it', async ({ page }) => {
      // Create a todo first
      await page.getByText('20+', { exact: false }).click();
      await page.locator('.mt-1\\.5.flex-shrink-0.w-full.py-1.rounded.text-\\[10px\\].font-medium.transition-colors.bg-blue-50').first().click();
      await page.getByRole('textbox', { name: '輸入標題' }).fill('查看測試');
      await page.getByRole('textbox', { name: '輸入描述' }).fill('測試查看功能');
      await page.getByRole('button', { name: '新增' }).nth(2).click();

      // Click on the todo button in calendar to view details
      await page.getByRole('button', { name: '查看測試' }).first().click();

      // Verify details are shown in modal - use level to distinguish h2 from h3
      await expect(page.getByRole('heading', { name: '查看測試', level: 2 })).toBeVisible();
      await expect(page.getByText('測試查看功能').first()).toBeVisible();
    });

    test('should update an existing todo', async ({ page }) => {
      // Create a todo first
      await page.getByText('20+', { exact: false }).click();
      await page.locator('.mt-1\\.5.flex-shrink-0.w-full.py-1.rounded.text-\\[10px\\].font-medium.transition-colors.bg-blue-50').first().click();
      await page.getByRole('textbox', { name: '輸入標題' }).fill('原始標題');
      await page.getByRole('button', { name: '高' }).click();
      await page.getByRole('button', { name: '新增' }).nth(2).click();

      // Click edit button
      await page.getByRole('button', { name: '編輯' }).click();

      // Verify edit form is open with existing values
      await expect(page.getByRole('heading', { name: '編輯 Todo' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: '輸入標題' })).toHaveValue('原始標題');

      // Update title and priority
      await page.getByRole('textbox', { name: '輸入標題' }).fill('更新後的標題');
      await page.getByRole('button', { name: '中' }).click();

      // Submit update
      await page.getByRole('button', { name: '更新' }).click();

      // Verify changes are saved
      await expect(page.getByRole('heading', { name: '更新後的標題' })).toBeVisible();
      await expect(page.getByText('中')).toBeVisible();
    });

    test('should delete a todo', async ({ page }) => {
      // Create a todo first
      await page.getByText('20+', { exact: false }).click();
      await page.locator('.mt-1\\.5.flex-shrink-0.w-full.py-1.rounded.text-\\[10px\\].font-medium.transition-colors.bg-blue-50').first().click();
      await page.getByRole('textbox', { name: '輸入標題' }).fill('要刪除的任務');
      await page.getByRole('button', { name: '新增' }).nth(2).click();

      // Verify todo exists
      await expect(page.getByText('要刪除的任務').first()).toBeVisible();

      // Set up dialog handler
      page.on('dialog', dialog => dialog.accept());

      // Click delete button - use exact match to avoid matching the todo button
      await page.getByRole('button', { name: '刪除', exact: true }).click();

      // Verify todo is deleted
      await expect(page.getByText('要刪除的任務')).not.toBeVisible();
      await expect(page.getByText('這一天還沒有 Todo')).toBeVisible();
    });

    test('should cancel todo creation', async ({ page }) => {
      // Click on date 20
      await page.getByText('20+', { exact: false }).click();

      // Open form
      await page.locator('.mt-1\\.5.flex-shrink-0.w-full.py-1.rounded.text-\\[10px\\].font-medium.transition-colors.bg-blue-50').first().click();

      // Fill title
      await page.getByRole('textbox', { name: '輸入標題' }).fill('取消的任務');

      // Click cancel
      await page.getByRole('button', { name: '取消' }).first().click();

      // Verify form is closed and todo was not created
      await expect(page.getByRole('heading', { name: '新增 Todo' })).not.toBeVisible();
      await expect(page.getByText('這一天還沒有 Todo')).toBeVisible();
    });
  });

  test.describe('LocalStorage Persistence', () => {
    test('should persist todos in localStorage', async ({ page }) => {
      // Create a todo
      await page.getByText('20+', { exact: false }).click();
      await page.locator('.mt-1\\.5.flex-shrink-0.w-full.py-1.rounded.text-\\[10px\\].font-medium.transition-colors.bg-blue-50').first().click();
      await page.getByRole('textbox', { name: '輸入標題' }).fill('持久化測試');
      await page.getByRole('textbox', { name: '輸入描述' }).fill('測試 localStorage');
      await page.locator('input[type="time"]').fill('10:00');
      await page.getByRole('textbox', { name: '輸入地點' }).fill('辦公室');
      await page.getByRole('button', { name: '中' }).click();
      await page.getByRole('button', { name: '新增' }).nth(2).click();

      // Verify data is in localStorage
      const localStorageData = await page.evaluate(() => {
        const data = localStorage.getItem('todo-list-calendar');
        return data ? JSON.parse(data) : null;
      });

      expect(localStorageData).toBeTruthy();
      expect(Array.isArray(localStorageData)).toBe(true);
      expect(localStorageData.length).toBe(1);
      expect(localStorageData[0]).toMatchObject({
        title: '持久化測試',
        description: '測試 localStorage',
        time: '10:00',
        location: '辦公室',
        priority: 'medium',
        date: '2025-11-20'
      });
    });

    test('should load todos from localStorage on page reload', async ({ page }) => {
      // Create a todo
      await page.getByText('20+', { exact: false }).click();
      await page.locator('.mt-1\\.5.flex-shrink-0.w-full.py-1.rounded.text-\\[10px\\].font-medium.transition-colors.bg-blue-50').first().click();
      await page.getByRole('textbox', { name: '輸入標題' }).fill('重載測試');
      await page.getByRole('textbox', { name: '輸入描述' }).fill('測試頁面重載');
      await page.getByRole('button', { name: '高' }).click();
      await page.getByRole('textbox', { name: '輸入標籤後按 Enter' }).fill('測試');
      await page.getByRole('button', { name: '新增' }).nth(1).click();
      await page.getByRole('button', { name: '新增' }).nth(2).click();

      // Reload page
      await page.reload();

      // Verify todo is still visible
      await expect(page.getByText('重載測試').first()).toBeVisible();

      // Click on date to view details
      await page.getByText('重載測試').first().click();

      // Verify all data is preserved
      await expect(page.getByRole('heading', { name: '重載測試', level: 2 })).toBeVisible();
      await expect(page.getByText('測試頁面重載')).toBeVisible();
      await expect(page.getByText('高')).toBeVisible();
      await expect(page.getByText('測試', { exact: true })).toBeVisible();
    });

    test('should maintain multiple todos after reload', async ({ page }) => {
      // Create first todo on date 20
      await page.getByText('20+', { exact: false }).click();
      await page.locator('.mt-1\\.5.flex-shrink-0.w-full.py-1.rounded.text-\\[10px\\].font-medium.transition-colors.bg-blue-50').first().click();
      await page.getByRole('textbox', { name: '輸入標題' }).fill('任務一');
      await page.getByRole('button', { name: '新增' }).nth(2).click();

      // Create second todo on date 21
      await page.getByText('21+', { exact: false }).click();
      await page.locator('.mt-1\\.5.flex-shrink-0.w-full.py-1.rounded.text-\\[10px\\].font-medium.transition-colors.bg-blue-50').first().click();
      await page.getByRole('textbox', { name: '輸入標題' }).fill('任務二');
      await page.getByRole('button', { name: '新增' }).nth(3).click();

      // Reload page
      await page.reload();

      // Verify both todos are visible
      await expect(page.getByText('任務一').first()).toBeVisible();
      await expect(page.getByText('任務二').first()).toBeVisible();

      // Verify localStorage has both todos
      const todos = await page.evaluate(() => {
        const data = localStorage.getItem('todo-list-calendar');
        return data ? JSON.parse(data) : [];
      });
      expect(todos.length).toBe(2);
    });
  });

  test.describe('Date Filtering', () => {
    test('should only show todos for the selected date', async ({ page }) => {
      // Create todo on date 20
      await page.getByText('20+', { exact: false }).click();
      await page.locator('.mt-1\\.5.flex-shrink-0.w-full.py-1.rounded.text-\\[10px\\].font-medium.transition-colors.bg-blue-50').first().click();
      await page.getByRole('textbox', { name: '輸入標題' }).fill('20號任務');
      await page.getByRole('button', { name: '新增' }).nth(2).click();

      // Verify date 20 is shown in sidebar
      await expect(page.getByRole('heading', { name: '2025 年 11 月 20 日' })).toBeVisible();
      await expect(page.getByText('20號任務').first()).toBeVisible();

      // Click on date 22 (no todos yet)
      await page.getByText('22+', { exact: false }).click();

      // Verify sidebar shows date 22 with no todos
      await expect(page.getByRole('heading', { name: '2025 年 11 月 22 日' })).toBeVisible();
      await expect(page.getByText('這一天還沒有 Todo')).toBeVisible();

      // Click back on a date that does have a todo (date 20)
      await page.getByRole('button', { name: '20號任務' }).first().click();

      // Verify todo details modal is shown
      await expect(page.getByRole('heading', { name: '20號任務', level: 2 })).toBeVisible();
    });

    test('should show todos across different months and years', async ({ page }) => {
      // Create todo in November 2025, date 20
      await page.getByText('20+', { exact: false }).click();
      await page.locator('.mt-1\\.5.flex-shrink-0.w-full.py-1.rounded.text-\\[10px\\].font-medium.transition-colors.bg-blue-50').first().click();
      await page.getByRole('textbox', { name: '輸入標題' }).fill('11月20日任務');
      await page.getByRole('button', { name: '新增' }).nth(2).click();

      // Verify todo is created
      await expect(page.getByText('11月20日任務').first()).toBeVisible();

      // Navigate to December 2025
      await page.getByRole('button').nth(3).click();
      await expect(page.getByText('十二月')).toBeVisible();

      // Check December 20 - should not have the November todo since it's a different month
      await page.getByText('20+', { exact: false }).click();
      await expect(page.getByText('2025 年 12 月 20 日')).toBeVisible();
      await expect(page.getByText('這一天還沒有 Todo')).toBeVisible();

      // Navigate back to November
      await page.getByRole('button').nth(2).click();
      await expect(page.getByText('十一月')).toBeVisible();

      // Verify todo is visible again in November
      await expect(page.getByText('11月20日任務').first()).toBeVisible();

      // Navigate to next year (2026 November)
      await page.getByRole('button').nth(1).click();
      await expect(page.getByText('2026 年')).toBeVisible();

      // In 2026 November, the same date (20) should not show the 2025 todo
      await page.getByText('20+', { exact: false }).click();
      await expect(page.getByText('這一天還沒有 Todo')).toBeVisible();

      // Navigate back to 2025
      await page.getByRole('button').first().click();
      await expect(page.getByText('2025 年')).toBeVisible();

      // Verify todo is still visible in 2025 November
      await expect(page.getByText('11月20日任務').first()).toBeVisible();
    });
  });
});
