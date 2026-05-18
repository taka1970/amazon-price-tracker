import { scrapeAmazonPrice } from './src/scraper/amazon.js';
import { savePrice } from './src/db/savePrice.js';

const url = "https://www.amazon.co.jp/dp/B07Q8TJ2KL";

async function main() {
  const data = await scrapeAmazonPrice(url);

  if (!data) {
    console.log("価格が取得できませんでした");
    return;
  }

  console.log("取得:", data);

  await savePrice(data.title, data.price);

  console.log("DB に保存しました");
}

main();
