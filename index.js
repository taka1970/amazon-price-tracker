import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 3000;

// Amazon の価格を取得する関数
async function getPrice(url) {
  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "ja-JP,ja;q=0.9",
    };

    const { data } = await axios.get(url, { headers });
    const $ = cheerio.load(data);

    // ★ Amazon の価格構造（whole / decimal / fraction）を完全に再構築
    const whole = $("span.a-price-whole").first().text().trim();
    const decimal = $("span.a-price-decimal").first().text().trim(); // ← "." が入る
    const fraction = $("span.a-price-fraction").first().text().trim();

    let price = null;

    if (whole) {
      // 小数点があれば結合、なければ整数だけ
      price = `${whole}${decimal || ""}${fraction || ""}`;
    }

    // fallback（他の Amazon ページ用）
    price =
      price ||
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

// ★あなたの Switch の URL
const url = "https://www.amazon.co.jp/dp/B07SVXHD1P";

// Web サーバーのルート
app.get("/", async (req, res) => {
  const price = await getPrice(url);
  res.send(`現在の価格: ${price}`);
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
