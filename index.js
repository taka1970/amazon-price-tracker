import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 3000;

async function getPrice(url) {
  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "ja-JP,ja;q=0.9",
    };

    const { data } = await axios.get(url, { headers });
    const $ = cheerio.load(data);

    const whole = $("span.a-price-whole").first().text().trim();
    const fraction = $("span.a-price-fraction").first().text().trim();

    let price = null;

    // ★ 小数点を1回だけ入れる
    if (whole) {
      price = fraction ? `${whole}.${fraction}` : whole;
    }

    // fallback
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

const url = "https://www.amazon.co.jp/dp/B07SVXHD1P";

app.get("/", async (req, res) => {
  const price = await getPrice(url);
  res.send(`現在の価格: ${price}`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
