const puppeteer = require("puppeteer");
let userAgent = require("user-agents");

function run(brand, number, page) {
  return new Promise(async (resolve, reject) => {
    try {
      let url = `https://www.ebay.com/sch/i.html?_from=R40&_nkw=${brand}&_sacat=0&LH_TitleDesc=0&_ipg=100&_oac=1&rt=nc&_pgn=${number}`;
      
      await page.setUserAgent(userAgent.toString());

      await page.goto(url);
      let details = await page.evaluate(async () => {
        let results = [];
        let items = document.querySelectorAll(
          "div.s-item__info.clearfix" // > a > h3.s-item__title.s-item__title--has-tags"
        );
        for(i=0; i < items.length; i++){
          if(!items[i].querySelector("h3.s-item__title")){
            continue;
          }
          let name = items[i].querySelector("h3.s-item__title")
            .innerText;
          let price = items[i].querySelector("span.s-item__price")
            .innerText;
          let previousPrice = items[i].querySelector(
            "span.s-item__trending-price span.STRIKETHROUGH"
          )?.innerText;
          let shippingCharge = items[i].querySelector(
            "span.s-item__shipping.s-item__logisticsCost"
          )?.innerText;
          let link =  items[i]
            .querySelector("a.s-item__link")
            .getAttribute("href");


          results.push({
            "link": link ? link : "",
            "marketPlace":"ebay",
            "name": name?name:"",
            "currentPrice": price ? price : "",
            "previousPrice": previousPrice ? previousPrice : "",
            "shippingCharge": shippingCharge ? shippingCharge : "",

          });
        }
        return results;
      });
      // browser.close();
      return resolve(details);
    } catch (e) {
      return reject(e);
    }
  });
}

exports.getProductInitialDetails = run;
