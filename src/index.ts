import { chromium, Browser, Page } from "playwright";
const userName = process.env.USER_NAME as string;
const password = process.env.PASSWORD as string;
const headless = process.env.HEADLESS as string;

(async () => {
  // Launch browser
  const browser: Browser = await chromium.launch({
    headless: headless === "true",
  });
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  await page.goto("https://cp.accu20.com:8443/login_up.php");

  // Example: Fill a form
  await page.fill("#login_name", userName);
  await page.fill("#passwd", password);
  await page.click(".login-page__login-button");

  await page.locator(".pul-list__row-expander").nth(2).click();
  await page.locator("a[data-type='hostingTab']").click();
  await page.click("#buttonIssAppPool");
  await page.click("#button-recycle");

  await page.waitForTimeout(5000);

  // Close the browser
  await browser.close();
})();
