import test, { Browser, chromium } from "@playwright/test";


test('check if the mutiple users can communicate through chatting application in single browser', async () => {
 let browser: Browser = await chromium.launch({channel: 'chrome', headless: false, slowMo: 2000});
     // 1. Create two independent, isolated browser contexts from the provided browser
  const userOne = await browser.newContext();
  const userTwo = await browser.newContext();

   // 2. Create pages (tabs) within those distinct contexts
  const page1 = await userOne.newPage();
  const page2 = await userTwo.newPage();

  //3. go to same URL same browser for different browser context
  await  page1.goto('http://localhost:3000/');
  await page2.goto('http://localhost:3000/');
  
  //4. enter the username and click
  await page1.fill('input[data-testid="username-input"]', "Tony Stark");
  await page1.locator('button[data-testid="join-btn"]').click();

  await page2.fill('input[data-testid="username-input"]', "Captain Rogers");
  await page2.locator('button[data-testid="join-btn"]').click();

  // 5. enter the message you wanted to sent
  await page1.fill('input[data-testid="message-input"]', "I am in a new role in upcoming Avengers");
  await page1.locator('button[data-testid="send-btn"]').click();
  await page2.fill('input[data-testid="message-input"]', "Yup I also not in captain America role how strange!!");
  await page2.locator('button[data-testid="send-btn"]').click();
  await page1.fill('input[data-testid="message-input"]', "ohh this is new but mine is completely different");
  await page1.locator('button[data-testid="send-btn"]').click();
  await page2.fill('input[data-testid="message-input"]', "ok!! will see you then until then bye----!");
  await page2.locator('button[data-testid="send-btn"]').click();
})