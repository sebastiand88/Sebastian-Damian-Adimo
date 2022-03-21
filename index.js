const axios = require("axios");
const cheerio = require("cheerio");
const jsonfile = require("jsonfile");

axios("https://cdn.adimo.co/clients/Adimo/test/index.html").then(res => {
  const data = res.data;

  const $ = cheerio.load(data);
  // Extract and save scrap data
  allData = [];

  $("div.item").each((index, element) => {
    const title = $(element).children("h1").text();
    const price = $(element).children(".price").text();
    const oldPrice = $(element).children(".oldPrice").text();
    const image = $(element).find("img").attr("src");

    allData.push({
      title,
      price,
      oldPrice,
      image,
    });

    jsonfile.writeFile("data.json", allData);

    // Extract and save total number of items
    numberOfItems = allData.length;
    jsonfile.writeFile("numberOfItems.json", numberOfItems);
  });

  // Extract and save average price of each item
  finalPrice = [];
  $("div.item").each((index, element) => {
    const title = $(element).children("h1").text();
    const price = $(element).children(".price").text();
    const oldPrice = $(element).children(".oldPrice").text();

    newPrice = price.substring(1);
    newOldPrice = oldPrice.substring(1);

    extractedNewPrice = parseInt(newPrice);
    extractedNewOldPrice = parseInt(newOldPrice);

    avaragePrice = (extractedNewPrice + extractedNewOldPrice) / 2;

    if (newOldPrice != "") {
      finalPrice.push({
        title,
        avaragePrice,
      });
    } else {
      finalPrice.push({
        title,
        newPrice,
      });
    }

    jsonfile.writeFile("avaragePrice.json", finalPrice);
    console.log(finalPrice);
  });
});
