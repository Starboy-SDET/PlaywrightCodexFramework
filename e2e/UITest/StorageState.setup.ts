import { test as setup, expect } from '@playwright/test';
const authFile = 'auth/storageState.json';

setup('creating login functionality as storgae state', async({page}) => {
    await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=account/login');
    // here using isVisible not had the proper assertion result we need to use
    await expect(page.getByText('New Customer')).toBeVisible();
    await page.getByRole('link', {name: 'Continue'}).click();
    await expect(page.getByText('Register Account')).toBeVisible();
    await page.getByPlaceholder('First Name').fill('Langley');
    await page.getByPlaceholder('Last Name').fill('Scott');
    await page.getByPlaceholder('E-Mail').fill(`langley.${Date.now()}@fake.com`);
    await page.getByRole('textbox', {name: 'Telephone'}).fill('+91-1234567801');
    await page.locator('#input-password').fill('tYfgfgh@#');
    await page.getByLabel('Password Confirm').fill('Tyfgfgh@#');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', {name: 'Continue'}).click();
    // here wwe can add 
 /* await page.getByRole('textbox', { name: '* Telephone' }).click();
  await page.getByRole('textbox', { name: '* E-Mail' }).click();
  await page.getByRole('textbox', { name: '* Telephone' }).click();
  await page.getByRole('textbox', { name: '* Password', exact: true }).click();
    // await expect(page).toHaveURL(/.*account\/success/); */
    await page.context().storageState({ path: authFile });
});
