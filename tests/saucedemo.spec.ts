import { test, expect } from '@playwright/test';

/**
 * SauceDemo E-commerce Website Test Suite
 *
 * This test suite covers the main user flows of the SauceDemo website:
 * - User login (success and failure scenarios)
 * - Product browsing and sorting
 * - Shopping cart operations
 * - Checkout process (including form validation)
 *
 * Based on manual testing report: tests/saucedemo-manual-test-report.md
 */

test.describe('SauceDemo Website Tests', () => {
  const baseURL = 'https://www.saucedemo.com/';
  const validUsername = 'standard_user';
  const validPassword = 'secret_sauce';

  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto(baseURL);
  });

  // ==================== LOGIN TESTS ====================

  test.describe('Login Functionality', () => {
    test('should successfully login with valid credentials', async ({ page }) => {
      // Verify login page elements
      await expect(page).toHaveTitle('Swag Labs');
      await expect(page.locator('[data-test="username"]')).toBeVisible();
      await expect(page.locator('[data-test="password"]')).toBeVisible();
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();

      // Perform login
      await page.locator('[data-test="username"]').fill(validUsername);
      await page.locator('[data-test="password"]').fill(validPassword);
      await page.locator('[data-test="login-button"]').click();

      // Verify successful navigation to products page
      await expect(page).toHaveURL(/.*inventory\.html/);
      await expect(page.locator('text=Products')).toBeVisible();
    });

    test('should show error message when submitting empty login form', async ({ page }) => {
      // Click login button without filling any fields
      await page.locator('[data-test="login-button"]').click();

      // Verify error message is displayed
      await expect(page.locator('[data-test="error"]')).toBeVisible();
      await expect(page.locator('[data-test="error"]')).toContainText('Username is required');

      // Verify still on login page
      await expect(page).toHaveURL(baseURL);
    });

    test('should show error message with invalid credentials', async ({ page }) => {
      // Try to login with invalid credentials
      await page.locator('[data-test="username"]').fill('invalid_user');
      await page.locator('[data-test="password"]').fill('wrong_password');
      await page.locator('[data-test="login-button"]').click();

      // Verify error message is displayed
      await expect(page.locator('[data-test="error"]')).toBeVisible();
      await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');

      // Verify still on login page
      await expect(page).toHaveURL(baseURL);
    });

    test('should show error message for locked out user', async ({ page }) => {
      // Try to login with locked out user
      await page.locator('[data-test="username"]').fill('locked_out_user');
      await page.locator('[data-test="password"]').fill(validPassword);
      await page.locator('[data-test="login-button"]').click();

      // Verify error message is displayed
      await expect(page.locator('[data-test="error"]')).toBeVisible();
      await expect(page.locator('[data-test="error"]')).toContainText('this user has been locked out');

      // Verify still on login page
      await expect(page).toHaveURL(baseURL);
    });
  });

  // ==================== PRODUCT TESTS ====================

  test.describe('Product Display and Sorting', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test in this group
      await page.locator('[data-test="username"]').fill(validUsername);
      await page.locator('[data-test="password"]').fill(validPassword);
      await page.locator('[data-test="login-button"]').click();
      await expect(page.locator('text=Products')).toBeVisible();
    });

    test('should display all 6 products correctly', async ({ page }) => {
      // Verify all 6 products are displayed
      const productNames = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt',
        'Sauce Labs Fleece Jacket',
        'Sauce Labs Onesie',
        'Test.allTheThings() T-Shirt (Red)'
      ];

      for (const productName of productNames) {
        await expect(page.locator(`[data-test="inventory-item-name"]:has-text("${productName}")`).first()).toBeVisible();
      }

      // Verify product prices are displayed
      await expect(page.locator('text=$29.99')).toBeVisible(); // Backpack
      await expect(page.locator('text=$9.99')).toBeVisible(); // Bike Light
      await expect(page.locator('text=$7.99')).toBeVisible(); // Onesie
      await expect(page.locator('text=$49.99')).toBeVisible(); // Fleece Jacket
    });

    test('should sort products by price (low to high)', async ({ page }) => {
      // Select price sort option (low to high)
      await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

      // Verify sort dropdown shows correct selection
      await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('lohi');

      // Get all product prices
      const prices = await page.locator('.inventory_item_price').allTextContents();
      const priceValues = prices.map(p => parseFloat(p.replace('$', '')));

      // Verify prices are in ascending order
      for (let i = 0; i < priceValues.length - 1; i++) {
        expect(priceValues[i]).toBeLessThanOrEqual(priceValues[i + 1]);
      }

      // Verify first and last items
      expect(priceValues[0]).toBe(7.99); // Onesie
      expect(priceValues[priceValues.length - 1]).toBe(49.99); // Fleece Jacket
    });

    test('should sort products by price (high to low)', async ({ page }) => {
      // Select price sort option (high to low)
      await page.locator('[data-test="product-sort-container"]').selectOption('hilo');

      // Verify sort dropdown shows correct selection
      await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('hilo');

      // Get all product prices
      const prices = await page.locator('.inventory_item_price').allTextContents();
      const priceValues = prices.map(p => parseFloat(p.replace('$', '')));

      // Verify prices are in descending order
      for (let i = 0; i < priceValues.length - 1; i++) {
        expect(priceValues[i]).toBeGreaterThanOrEqual(priceValues[i + 1]);
      }

      // Verify first and last items
      expect(priceValues[0]).toBe(49.99); // Fleece Jacket
      expect(priceValues[priceValues.length - 1]).toBe(7.99); // Onesie
    });

    test('should sort products by name (Z to A)', async ({ page }) => {
      // Select name sort option (Z to A)
      await page.locator('[data-test="product-sort-container"]').selectOption('za');

      // Verify sort dropdown shows correct selection
      await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('za');

      // Get all product names
      const names = await page.locator('[data-test="inventory-item-name"]').allTextContents();

      // Verify names are in descending order
      for (let i = 0; i < names.length - 1; i++) {
        expect(names[i].localeCompare(names[i + 1])).toBeGreaterThanOrEqual(0);
      }
    });

    test('should navigate to product detail page', async ({ page }) => {
      // Click on product name to go to detail page
      await page.locator('[data-test="item-4-title-link"]').click(); // Backpack

      // Verify navigation to product detail page
      await expect(page).toHaveURL(/.*inventory-item\.html\?id=4/);
      await expect(page.locator('text=Sauce Labs Backpack')).toBeVisible();
      await expect(page.locator('text=$29.99')).toBeVisible();
      await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
      await expect(page.locator('[data-test="add-to-cart"]').first()).toBeVisible();
    });
  });

  // ==================== SHOPPING CART TESTS ====================

  test.describe('Shopping Cart Functionality', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test in this group
      await page.locator('[data-test="username"]').fill(validUsername);
      await page.locator('[data-test="password"]').fill(validPassword);
      await page.locator('[data-test="login-button"]').click();
      await expect(page.locator('text=Products')).toBeVisible();
    });

    test('should add product to cart and update badge', async ({ page }) => {
      // Initially, cart badge should not be visible
      const cartBadge = page.locator('.shopping_cart_badge');
      await expect(cartBadge).not.toBeVisible();

      // Add first product to cart
      await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();

      // Verify cart badge shows 1
      await expect(cartBadge).toBeVisible();
      await expect(cartBadge).toHaveText('1');

      // Verify button changed to Remove
      await expect(page.locator('[data-test="remove-sauce-labs-onesie"]')).toBeVisible();
    });

    test('should add multiple products to cart', async ({ page }) => {
      const cartBadge = page.locator('.shopping_cart_badge');

      // Add first product
      await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
      await expect(cartBadge).toHaveText('1');

      // Add second product
      await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
      await expect(cartBadge).toHaveText('2');

      // Add third product
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await expect(cartBadge).toHaveText('3');
    });

    test('should display cart items correctly', async ({ page }) => {
      // Add products to cart
      await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
      await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

      // Navigate to cart
      await page.locator('[data-test="shopping-cart-link"]').click();

      // Verify cart page
      await expect(page).toHaveURL(/.*cart\.html/);
      await expect(page.locator('text=Your Cart')).toBeVisible();

      // Verify cart items are displayed
      await expect(page.locator('text=Sauce Labs Onesie')).toBeVisible();
      await expect(page.locator('text=Sauce Labs Bike Light')).toBeVisible();
      await expect(page.locator('text=$7.99')).toBeVisible();
      await expect(page.locator('text=$9.99')).toBeVisible();

      // Verify Remove buttons are present
      await expect(page.locator('[data-test="remove-sauce-labs-onesie"]')).toBeVisible();
      await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();

      // Verify checkout button is present
      await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    });

    test('should remove product from cart', async ({ page }) => {
      const cartBadge = page.locator('.shopping_cart_badge');

      // Add two products
      await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
      await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
      await expect(cartBadge).toHaveText('2');

      // Navigate to cart
      await page.locator('[data-test="shopping-cart-link"]').click();

      // Remove one product
      await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();

      // Verify cart badge updated
      await expect(cartBadge).toHaveText('1');

      // Verify product removed from cart
      await expect(page.locator('text=Sauce Labs Bike Light')).not.toBeVisible();
      await expect(page.locator('text=Sauce Labs Onesie')).toBeVisible();
    });

    test('should remove product from products page', async ({ page }) => {
      const cartBadge = page.locator('.shopping_cart_badge');

      // Add product
      await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
      await expect(cartBadge).toHaveText('1');

      // Remove product from products page
      await page.locator('[data-test="remove-sauce-labs-onesie"]').click();

      // Verify cart badge is not visible
      await expect(cartBadge).not.toBeVisible();

      // Verify button changed back to Add to cart
      await expect(page.locator('[data-test="add-to-cart-sauce-labs-onesie"]')).toBeVisible();
    });
  });

  // ==================== CHECKOUT TESTS ====================

  test.describe('Checkout Process', () => {
    test.beforeEach(async ({ page }) => {
      // Login and add product to cart before each test
      await page.locator('[data-test="username"]').fill(validUsername);
      await page.locator('[data-test="password"]').fill(validPassword);
      await page.locator('[data-test="login-button"]').click();
      await expect(page.locator('text=Products')).toBeVisible();

      // Add product to cart
      await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();

      // Navigate to cart and click checkout
      await page.locator('[data-test="shopping-cart-link"]').click();
      await page.locator('[data-test="checkout"]').click();

      // Verify on checkout information page
      await expect(page).toHaveURL(/.*checkout-step-one\.html/);
      await expect(page.locator('text=Checkout: Your Information')).toBeVisible();
    });

    test('should show error when submitting empty checkout form', async ({ page }) => {
      // Try to continue without filling form
      await page.locator('[data-test="continue"]').click();

      // Verify error message appears
      await expect(page.locator('[data-test="error"]')).toBeVisible();
      await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');

      // Verify still on checkout information page
      await expect(page).toHaveURL(/.*checkout-step-one\.html/);
    });

    test('should show error when missing last name', async ({ page }) => {
      // Fill only first name and postal code
      await page.locator('[data-test="firstName"]').fill('John');
      await page.locator('[data-test="postalCode"]').fill('12345');
      await page.locator('[data-test="continue"]').click();

      // Verify error message for last name
      await expect(page.locator('[data-test="error"]')).toBeVisible();
      await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');
    });

    test('should show error when missing postal code', async ({ page }) => {
      // Fill only first name and last name
      await page.locator('[data-test="firstName"]').fill('John');
      await page.locator('[data-test="lastName"]').fill('Doe');
      await page.locator('[data-test="continue"]').click();

      // Verify error message for postal code
      await expect(page.locator('[data-test="error"]')).toBeVisible();
      await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
    });

    test('should complete checkout successfully', async ({ page }) => {
      // Fill checkout information
      await page.locator('[data-test="firstName"]').fill('John');
      await page.locator('[data-test="lastName"]').fill('Doe');
      await page.locator('[data-test="postalCode"]').fill('12345');
      await page.locator('[data-test="continue"]').click();

      // Verify checkout overview page
      await expect(page).toHaveURL(/.*checkout-step-two\.html/);
      await expect(page.locator('text=Checkout: Overview')).toBeVisible();

      // Verify product is displayed
      await expect(page.locator('text=Sauce Labs Onesie')).toBeVisible();

      // Verify payment and shipping information
      await expect(page.locator('text=Payment Information')).toBeVisible();
      await expect(page.locator('text=Shipping Information')).toBeVisible();

      // Complete checkout
      await page.locator('[data-test="finish"]').click();

      // Verify checkout complete page
      await expect(page).toHaveURL(/.*checkout-complete\.html/);
      await expect(page.locator('text=Checkout: Complete!')).toBeVisible();
      await expect(page.locator('text=Thank you for your order!')).toBeVisible();
      await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
    });

    test('should calculate correct total price with tax', async ({ page }) => {
      // Add another product for more interesting calculation
      await page.locator('[data-test="cancel"]').click(); // Go back to cart
      await page.locator('[data-test="continue-shopping"]').click(); // Go back to products
      await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

      // Go to checkout
      await page.locator('[data-test="shopping-cart-link"]').click();
      await page.locator('[data-test="checkout"]').click();

      // Fill checkout information
      await page.locator('[data-test="firstName"]').fill('John');
      await page.locator('[data-test="lastName"]').fill('Doe');
      await page.locator('[data-test="postalCode"]').fill('12345');
      await page.locator('[data-test="continue"]').click();

      // Verify price calculations
      // Item total: $7.99 + $9.99 = $17.98
      await expect(page.locator('[data-test="subtotal-label"]')).toContainText('17.98');

      // Tax should be displayed
      const taxElement = page.locator('[data-test="tax-label"]');
      await expect(taxElement).toBeVisible();

      // Total should be item total + tax
      const totalElement = page.locator('[data-test="total-label"]');
      await expect(totalElement).toBeVisible();

      // Get the actual values to verify calculation
      const subtotalText = await page.locator('[data-test="subtotal-label"]').textContent();
      const taxText = await page.locator('[data-test="tax-label"]').textContent();
      const totalText = await page.locator('[data-test="total-label"]').textContent();

      const subtotal = parseFloat(subtotalText?.match(/[\d.]+/)?.[0] || '0');
      const tax = parseFloat(taxText?.match(/[\d.]+/)?.[0] || '0');
      const total = parseFloat(totalText?.match(/[\d.]+/)?.[0] || '0');

      // Verify calculation (allowing small floating point differences)
      expect(total).toBeCloseTo(subtotal + tax, 2);
      expect(subtotal).toBe(17.98);
    });

    test('should allow user to cancel checkout and return to products', async ({ page }) => {
      // Click cancel button
      await page.locator('[data-test="cancel"]').click();

      // Verify returned to cart page
      await expect(page).toHaveURL(/.*cart\.html/);
      await expect(page.locator('text=Your Cart')).toBeVisible();
    });
  });

  // ==================== LOGOUT TEST ====================

  test.describe('Logout Functionality', () => {
    test('should successfully logout', async ({ page }) => {
      // Login first
      await page.locator('[data-test="username"]').fill(validUsername);
      await page.locator('[data-test="password"]').fill(validPassword);
      await page.locator('[data-test="login-button"]').click();
      await expect(page.locator('text=Products')).toBeVisible();

      // Open menu
      await page.locator('#react-burger-menu-btn').click();

      // Wait for menu to be visible
      await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeVisible();

      // Click logout
      await page.locator('[data-test="logout-sidebar-link"]').click();

      // Verify returned to login page
      await expect(page).toHaveURL(baseURL);
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });
  });
});
