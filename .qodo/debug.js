const puppeteer = require('c:/Users/rpalu/Desktop/Quiz-latino-fracco/node_modules/puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: "true",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--allow-file-access-from-files"]
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));
  page.on('requestfailed', request => {
    console.error('BROWSER REQ FAILED:', request.url(), request.failure().errorText);
  });

  const absPath = "c:/Users/rpalu/Desktop/Quiz-latino-fracco/index.html";
  console.log('Loading:', absPath);
  await page.goto(`file://${absPath}`);
  
  console.log('Page loaded. Waiting 1 second...');
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('Closing browser.');
  await browser.close();
})();
