import axios from "axios";
import * as cheerio from "cheerio";

// Amazon の価格を取得する関数
async function getPrice(url) {
  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "ja-JP,ja;q=0.9",
    };

    // Amazon の HTML を取得
    const { data } = await axios.get(url, { headers });

    // HTML を解析
    const $ = cheerio.load(data);

    // Amazon の価格セレクタ（複数パターン対応）
    const price =
      $("#corePrice_feature_div .a-offscreen").first().text().trim() ||
      $("#priceblock_ourprice").text().trim() ||
      $("#priceblock_dealprice").text().trim() ||
      null;

    return price || "価格が取得できませんでした";
  } catch (error) {
    console.error("エラー:", error.message);
    return "取得エラー";
  }
}

// ここに Amazon の商品 URL を入れる
const url = "https://www.amazon.co.jp/dp/B0D1ZQZQZQ"; // ← Switch の URL に変更

// 実行
getPrice(url).then((price) => {
  console.log("現在の価格:", price);
});
