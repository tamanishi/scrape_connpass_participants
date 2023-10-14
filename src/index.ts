import { chromium } from 'playwright-core';

(async () => {
  const browser = await chromium.launch({
    channel: 'chrome', 
    headless: false,
  });
  const event_url = process.argv[2];
  const page = await browser.newPage();
  await page.goto(`${event_url}participation/`);
  await page.getByRole('link', { name: 'More', exact: true }).click();
  const pages = await page.locator('.paging_area > ul > li');
  const pages_cnt = await pages.count();
  let last_page = 0;
  for (let i = -1; i >= 0 - pages_cnt; i--) {
	const page = await pages.nth(i).innerText();
    if (!Number.isNaN(parseInt(page))) {
      last_page = parseInt(page);
      break;
    }
  }
  const participant_url = await page.url();
  for (let i = 0; i < last_page; i++) {
    await page.goto(`${participant_url}?page=${i + 1}`); 

    const names = await page.locator('.display_name');
    const names_cnt = await names.count();
    for (let j = 0; j < await names?.count(); j++) {
      const user_url = await names.nth(j).evaluate(elm => elm.children[0].getAttribute('href'));
      const name = await names.nth(j).innerText();
      console.log(name + ',' + user_url);
    }
  }
  await browser.close();
})();

