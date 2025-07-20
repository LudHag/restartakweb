const { chromium } = require("playwright");

const userName = process.env.USER_NAME;
const password = process.env.PASSWORD;
const headless = process.env.HEADLESS;

const run = async () => {
  // Launch browser
  const browser = await chromium.launch({
    headless: headless === "true",
  });
  const context = await browser.newContext();
  const page = await context.newPage();

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
};

run();
