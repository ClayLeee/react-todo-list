import { test, expect } from '@playwright/test';

test.describe('Todo List Calendar', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5173/');
  });

  test('should add a new todo item', async ({ page }) => {
    // Wait for the page to load
    await expect(page).toHaveTitle('Todo List Calendar');

    // Find and click on date 18 in the calendar
    // The date number is displayed in a span, and the parent div is clickable
    const date18 = page.locator('span').filter({ hasText: /^18$/ }).locator('..').first();
    await date18.click();

    // Verify the date is selected and shows in the sidebar
    await expect(page.getByRole('heading', { name: /2025 年 11 月 18 日/ })).toBeVisible();

    // Click the add todo button in the sidebar (button with title "新增 Todo")
    const addButton = page.getByRole('button', { name: '新增 Todo' });
    await addButton.click();

    // Wait for the form modal to appear
    await expect(page.getByRole('heading', { name: '新增 Todo' })).toBeVisible();

    // Fill in the title
    const titleInput = page.getByRole('textbox', { name: '輸入標題' });
    await titleInput.fill('測試 Todo 項目');

    // Fill in the description
    const descriptionInput = page.getByRole('textbox', { name: '輸入描述' });
    await descriptionInput.fill('這是一個測試用的 Todo 描述');

    // Select medium priority
    const mediumPriorityButton = page.getByRole('button', { name: '中' });
    await mediumPriorityButton.click();

    // Click the save button (the form submit button, which is the last "新增" button)
    const saveButtons = page.getByRole('button', { name: '新增' });
    await saveButtons.last().click();

    // Verify the form modal is closed
    await expect(page.getByRole('heading', { name: '新增 Todo' })).not.toBeVisible();

    // Verify the todo appears in the todo list
    await expect(page.getByRole('heading', { name: '測試 Todo 項目', level: 3 })).toBeVisible();
    await expect(page.getByText('這是一個測試用的 Todo 描述')).toBeVisible();
    await expect(page.getByText('中')).toBeVisible();

    // Verify the todo appears on the calendar date
    // The todo is displayed as a button with the title attribute set to the todo title
    await expect(page.getByRole('button', { name: '測試 Todo 項目' })).toBeVisible();
  });

  test('should add a todo from calendar date selection', async ({ page }) => {
    // Wait for the page to load
    await expect(page).toHaveTitle('Todo List Calendar');

    // Click on a future date (e.g., date 20) to select it
    // This will show the date in the sidebar
    const date20 = page.locator('span').filter({ hasText: /^20$/ }).first();
    await date20.locator('..').click();
    await page.waitForTimeout(300);

    // Verify the date is selected and shows in the sidebar
    await expect(page.getByRole('heading', { name: /2025 年 11 月 20 日|2025 年 12 月 20 日/ })).toBeVisible();

    // Click the add todo button in the sidebar
    const addButton = page.getByRole('button', { name: '新增 Todo' });
    await addButton.click();

    // Verify the form modal appears with the correct date
    await expect(page.getByRole('heading', { name: '新增 Todo' })).toBeVisible();

    // Fill in the title
    await page.getByRole('textbox', { name: '輸入標題' }).fill('從日曆新增的 Todo');

    // Click the save button
    const saveButtons = page.getByRole('button', { name: '新增' });
    await saveButtons.last().click();

    // Verify the todo was created
    await expect(page.getByRole('heading', { name: '新增 Todo' })).not.toBeVisible();
    // The todo should appear in the calendar
    await expect(page.getByRole('button', { name: '從日曆新增的 Todo' })).toBeVisible();
  });

  test('should view todo details by clicking on calendar todo', async ({ page }) => {
    // Wait for the page to load
    await expect(page).toHaveTitle('Todo List Calendar');

    // First, create a todo if it doesn't exist
    const date18 = page.locator('span').filter({ hasText: /^18$/ }).locator('..').first();
    await date18.click();

    // Check if there's already a todo, if not create one
    const existingTodo = page.getByRole('button', { name: '測試 Todo 項目' });
    const todoExists = await existingTodo.isVisible().catch(() => false);

    if (!todoExists) {
      const addButton = page.getByRole('button', { name: '新增 Todo' });
      await addButton.click();
      await page.getByRole('textbox', { name: '輸入標題' }).fill('測試 Todo 項目');
      await page.getByRole('textbox', { name: '輸入描述' }).fill('這是一個測試用的 Todo 描述');
      await page.getByRole('button', { name: '中' }).click();
      const saveButtons = page.getByRole('button', { name: '新增' });
      await saveButtons.last().click();
    }

    // Click on the todo button in the calendar
    const todoButton = page.getByRole('button', { name: '測試 Todo 項目' }).first();
    await todoButton.click();

    // Verify the todo detail modal appears
    await expect(page.getByRole('heading', { name: '測試 Todo 項目', level: 2 })).toBeVisible();
    await expect(page.getByText('這是一個測試用的 Todo 描述').first()).toBeVisible();
    await expect(page.getByRole('button', { name: '編輯' }).last()).toBeVisible();
    await expect(page.getByRole('button', { name: '刪除' }).last()).toBeVisible();
  });

  test('should edit a todo item', async ({ page }) => {
    // Wait for the page to load
    await expect(page).toHaveTitle('Todo List Calendar');

    // Click on date 18
    const date18 = page.locator('span').filter({ hasText: /^18$/ }).locator('..').first();
    await date18.click();

    // Ensure there's a todo to edit
    const todoButton = page.getByRole('button', { name: '測試 Todo 項目' }).first();
    const todoExists = await todoButton.isVisible().catch(() => false);

    if (!todoExists) {
      // Create a todo first
      const addButton = page.getByRole('button', { name: '新增 Todo' });
      await addButton.click();
      await page.getByRole('textbox', { name: '輸入標題' }).fill('測試 Todo 項目');
      await page.getByRole('textbox', { name: '輸入描述' }).fill('這是一個測試用的 Todo 描述');
      await page.getByRole('button', { name: '中' }).click();
      const saveButtons = page.getByRole('button', { name: '新增' });
      await saveButtons.last().click();
    }

    // Click on the todo to view details
    await todoButton.click();

    // Click the edit button (use last() to get the one in the modal)
    await page.getByRole('button', { name: '編輯' }).last().click();

    // Verify the edit form appears
    await expect(page.getByRole('heading', { name: '編輯 Todo' })).toBeVisible();

    // Update the title
    const titleInput = page.getByRole('textbox', { name: '輸入標題' });
    await titleInput.clear();
    await titleInput.fill('更新後的 Todo 項目');

    // Add a tag
    const tagInput = page.getByRole('textbox', { name: '輸入標籤後按 Enter' });
    await tagInput.fill('工作');
    await tagInput.press('Enter');

    // Click the update button
    await page.getByRole('button', { name: '更新' }).click();

    // Verify the todo was updated
    await expect(page.getByRole('heading', { name: '編輯 Todo' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: '更新後的 Todo 項目' })).toBeVisible();
  });

  test('should delete a todo item', async ({ page }) => {
    // Wait for the page to load
    await expect(page).toHaveTitle('Todo List Calendar');

    // Set up dialog handler to accept the confirmation BEFORE any actions
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('確定要刪除這個 Todo 嗎？');
      await dialog.accept();
    });

    // Click on date 18
    const date18 = page.locator('span').filter({ hasText: /^18$/ }).locator('..').first();
    await date18.click();

    // Create a todo to delete (ensure we have one)
    const addButton = page.getByRole('button', { name: '新增 Todo' });
    await addButton.click();
    await page.getByRole('textbox', { name: '輸入標題' }).fill('要刪除的 Todo');
    await page.getByRole('textbox', { name: '輸入描述' }).fill('這個 Todo 將被刪除');
    await page.getByRole('button', { name: '中' }).click();
    const saveButtons = page.getByRole('button', { name: '新增' });
    await saveButtons.last().click();

    // Wait for the todo to appear
    await expect(page.getByRole('heading', { name: '要刪除的 Todo', level: 3 })).toBeVisible();

    // Click on the todo button in the calendar to view details
    const todoButton = page.getByRole('button', { name: '要刪除的 Todo' }).first();
    await todoButton.click();

    // Click the delete button (use last() to get the one in the modal)
    await page.getByRole('button', { name: '刪除' }).last().click();

    // Verify the todo was deleted
    await expect(page.getByRole('heading', { name: '要刪除的 Todo' })).not.toBeVisible();

    // Verify the calendar date no longer shows the todo
    await expect(page.getByRole('button', { name: '要刪除的 Todo' })).not.toBeVisible();
  });

  test('should navigate calendar months', async ({ page }) => {
    // Wait for the page to load
    await expect(page).toHaveTitle('Todo List Calendar');

    // Get the current month text
    const currentMonth = page.getByText(/十一月|十二月|一月|二月|三月|四月|五月|六月|七月|八月|九月|十月/).first();
    const currentMonthText = await currentMonth.textContent();

    // Find and click the next month button
    // The next month button is a button with an SVG arrow pointing right
    const nextMonthButton = page.locator('button').filter({ hasText: '' }).nth(2); // Usually the third button
    await nextMonthButton.click();

    // Wait for the month to change
    await page.waitForTimeout(500);

    // Verify the month has changed (the text should be different)
    const newMonth = page.getByText(/十一月|十二月|一月|二月|三月|四月|五月|六月|七月|八月|九月|十月/).first();
    const newMonthText = await newMonth.textContent();

    // The month should have changed
    expect(newMonthText).not.toBe(currentMonthText);
  });

  test('should add tags to a todo', async ({ page }) => {
    // Wait for the page to load
    await expect(page).toHaveTitle('Todo List Calendar');

    // Click on date 18
    const date18 = page.locator('span').filter({ hasText: /^18$/ }).locator('..').first();
    await date18.click();

    // Click the add todo button
    const addButton = page.getByRole('button', { name: '新增 Todo' });
    await addButton.click();

    // Fill in the title
    await page.getByRole('textbox', { name: '輸入標題' }).fill('帶標籤的 Todo');

    // Add tags using Enter key
    const tagInput = page.getByRole('textbox', { name: '輸入標籤後按 Enter' });
    await tagInput.fill('工作');
    await tagInput.press('Enter');

    await tagInput.fill('重要');
    await tagInput.press('Enter');

    // Verify tags are displayed
    await expect(page.getByText('工作')).toBeVisible();
    await expect(page.getByText('重要')).toBeVisible();

    // Save the todo
    const saveButtons = page.getByRole('button', { name: '新增' });
    await saveButtons.last().click();

    // Verify the todo was created with tags
    await expect(page.getByRole('heading', { name: '帶標籤的 Todo', level: 3 })).toBeVisible();
  });

  test('should add todo with time and location', async ({ page }) => {
    // Wait for the page to load
    await expect(page).toHaveTitle('Todo List Calendar');

    // Click on date 18
    const date18 = page.locator('span').filter({ hasText: /^18$/ }).locator('..').first();
    await date18.click();

    // Click the add todo button
    const addButton = page.getByRole('button', { name: '新增 Todo' });
    await addButton.click();

    // Fill in the title
    await page.getByRole('textbox', { name: '輸入標題' }).fill('會議 Todo');

    // Fill in time (using time input)
    const timeInput = page.locator('input[type="time"]');
    await timeInput.fill('14:30');

    // Fill in location
    await page.getByRole('textbox', { name: '輸入地點' }).fill('會議室 A');

    // Select high priority
    await page.getByRole('button', { name: '高' }).click();

    // Save the todo
    const saveButtons = page.getByRole('button', { name: '新增' });
    await saveButtons.last().click();

    // Verify the todo was created
    await expect(page.getByRole('heading', { name: '會議 Todo', level: 3 })).toBeVisible();

    // Click on the todo to view details
    const todoButton = page.getByRole('button', { name: '會議 Todo' }).first();
    await todoButton.click();

    // Verify time and location are displayed in the detail modal
    await expect(page.getByText('14:30').first()).toBeVisible();
    await expect(page.getByText('會議室 A').first()).toBeVisible();
  });
});
