

// start the test 
import { BrowserContext, expect, Page, test } from '@playwright/test';

test('check an e-commerse website with multiple users', async ({browser}) => {
    // create context
    let firstContext: BrowserContext = await browser.newContext();
    let secondContext: BrowserContext = await browser.newContext();
    // create page
    let firstPage: Page = await firstContext.newPage();
    let secondPage: Page = await secondContext.newPage();

    // now loggin the first user and order something
    

})