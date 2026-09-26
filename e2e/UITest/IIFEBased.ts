import { Browser, chromium, Page } from "@playwright/test";

(async () => {
   // launching a browsers and .launch() will ask whic browser we want to launch
   // .launch() method will give promise so can use await
   // now channel parameter will having which browser need to launch
   // store this into a varibale for further use and store as type Browser
   let browser: Browser = await chromium.launch({channel: 'msedge', headless: false});
   // next defined new page
   let page: Page = await browser.newPage();
   // now to launch the URL we need to use 
   await page.goto('https://www.youtube.com/');
   // now to get the title of the page
   let title: string = await page.title();
   console.log('title is', title);
   // now to check the url
   let url: string = page.url();
    console.log('url is', url);
    browser.close();
})();