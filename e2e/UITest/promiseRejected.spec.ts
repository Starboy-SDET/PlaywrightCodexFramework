import { test, expect } from '@playwright/test';

// A mock backend function that generates a PDF receipt
async function generateInvoicePdf(orderId: string) {
  // Simulating a network delay while generating the PDF
  await new Promise((resolve) => setTimeout(resolve, 1000)); 
  
  // Simulated Failure: The database crashes or refuses to save the PDF
  throw new Error("Database Error: Failed to save PDF Invoice!");
}

test('Should complete checkout successfully', async ({ page }) => {
  await page.goto('https://my-ecommerce-store.com/checkout');
  await page.click('#place-order-button');

  const orderId = "12345";

  // ❌ THE MISTAKE: We trigger the PDF generation but forget the 'await' keyword!
  // Because we didn't use await, JavaScript kicks this task off in the background 
  // and immediately moves to the next line of code.
  generateInvoicePdf(orderId);

  // Assert that the success message is visible on the screen
  const successMessage = page.locator('.order-success-banner');
  await expect(successMessage).toContainText('Order Successful!');
  
  // The test block ends here. Playwright thinks the test passed!
});