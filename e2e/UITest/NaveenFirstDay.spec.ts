import { test, expect, Page, chromium, Browser, BrowserContext, webkit } from "@playwright/test";

test('creating first test', async ({page}) => {
    await page.goto('https://google.com');
    let pageTitle: String = await page.title();
    console.log(pageTitle);
    let pageUrl: String = page.url();
    console.log(pageUrl);
});

test('running Playwright with custom browser', async () => {
   // as we are creating our own browser so will take browser property {browser}
   // or we can create out own custom browser from strach
    let browser: Browser = await chromium.launch({ channel: '', headless: false });
    // let appleBrowser: Browser = await webkit
    // 2. create a isolated context
    const context: BrowserContext = await browser.newContext();
    // 3. Create the actual page (tab) inside that context
    let page: Page = await context.newPage();

    await page.goto('https://amazon.in');
    let pageTitle: string = await page.title();
    console.log('Title', pageTitle);
    let pageUrl: string = page.url();
    console.log('URL', pageUrl);

    // 5. CRITICAL: Always close manually launched browsers to prevent memory leaks
    await browser.close();
})