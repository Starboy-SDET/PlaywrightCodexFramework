import { test, expect } from '@playwright/test';

// The test runner gives us access to the underlying 'browser' instance automatically
test('E-commerce isolation test using multiple browser contexts', async ({ browser }) => {
  
  // 1. Create two independent, isolated browser contexts from the provided browser
  const buyer1Context = await browser.newContext();
  const buyer2Context = await browser.newContext();

  // 2. Create pages (tabs) within those distinct contexts
  const page1 = await buyer1Context.newPage();
  const page2 = await buyer2Context.newPage();

  // ==========================================
  // --- USER 1 ACTIONS (Standard User) ---
  // ==========================================
  await page1.goto('https://www.saucedemo.com/');
  await page1.fill('[data-test="username"]', 'standard_user');
  await page1.fill('[data-test="password"]', 'secret_sauce');
  await page1.click('[data-test="login-button"]');

  // User 1 adds a backpack to their cart
  await page1.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  
  // Verify User 1 has 1 item in the cart using Playwright's built-in assertions
  const cartBadge1 = page1.locator('.shopping_cart_badge');
  await expect(cartBadge1).toHaveText('1');


  // ==========================================
  // --- USER 2 ACTIONS (Another User) ---
  // ==========================================
  await page2.goto('https://www.saucedemo.com/');
  
  // Notice User 2 is NOT logged in automatically, proving cookie isolation!
  await page2.fill('[data-test="username"]', 'problem_user');
  await page2.fill('[data-test="password"]', 'secret_sauce');
  await page2.click('[data-test="login-button"]');

  // Verify User 2's cart is entirely empty. 
  // We expect the badge to NOT be visible because the state is isolated.
  const cartBadge2 = page2.locator('.shopping_cart_badge');
  await expect(cartBadge2).toBeHidden();

  // The Playwright Test Runner automatically closes contexts and browsers when the test finishes!
});