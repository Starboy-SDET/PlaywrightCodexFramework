import { test, expect } from '@playwright/test';

test('create user via API and place order via UI', async ({ page }) => {
  // 1. AUTHENTICATE VIA API
  // This automatically adds the session cookie to the 'page' context
  await page.request.post('/api/login', {
    data: {
      username: 'admin_user',
      password: 'password123'
    }
  });

  // 2. CREATE THE PROFILE VIA API
  // We use the authenticated session to create a test user
  const newUser = await page.request.post('/api/users/create', {
    data: {
      name: 'Test Pilot',
      email: 'testpilot@example.com',
      role: 'customer'
    }
  });
  const userJson = await newUser.json();
  const userId = userJson.id;

  // 3. UI AUTOMATION
  // Now we jump into the browser. No login screen needed!
  await page.goto(`/profile/${userId}`);
  
  // Verify the profile we just created via API is actually visible in UI
  await expect(page.getByText('Test Pilot')).toBeVisible();

  // Continue to the 'Ordering' flow in the UI
  await page.getByRole('button', { name: 'Order New Item' }).click();
  await page.fill('#item-name', 'Refined Gadget');
  await page.click('#submit-order');

  // 4. FINAL VALIDATION (Back to API for speed)
  const orderCheck = await page.request.get(`/api/orders/user/${userId}`);
  expect(orderCheck.ok()).toBeTruthy();
});