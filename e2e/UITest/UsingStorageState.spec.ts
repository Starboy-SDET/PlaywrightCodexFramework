import {test, expect} from '@playwright/test';

// as we used use here storage.json
test.use({storageState: 'StorageState.json'});

test('using storage state able to test my application', async ({page})=> {
    await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=account/account');
    await page.waitForTimeout(10000);
});