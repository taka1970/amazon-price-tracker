import { chromium } from 'playwright';

export async function scrapeAmazonPrice(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

  // -----------------------------
  // タイトル取得（最強版）
  // -----------------------------
  let title = 'Unknown';

  try {
    // span の productTitle のみを対象にする
    await page.waitForSelector('span#productTitle', { timeout: 20000 });

    const rawTitle = await page.locator('span#productTitle').evaluate(el => el.textContent);
    title = rawTitle.replace(/\s+/g, ' ').trim();
  } catch (e) {
    console.log("タイトル取得に失敗:", e.message);
  }

  // -----------------------------
  // 価格取得（複数セレクタ対応）
  // -----------------------------
  const priceSelectors = [
    '.a-price .a-offscreen',
    '.a-price-whole',
    '#corePrice_feature_div .a-offscreen',
    '#priceblock_ourprice',
    '#priceblock_dealprice'
  ];

  let priceText = null;

  for (const selector of priceSelectors) {
    const el = await page.locator(selector);
    if (await el.count() > 0) {
      priceText = await el.first().innerText();
      break;
    }
  }

  await browser.close();

  if (!priceText) return null;

  const price = parseInt(priceText.replace(/[^\d]/g, ''), 10);

  return { title, price };
}
