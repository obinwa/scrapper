let { getProductInitialDetails } = require("./document-query");
let { getOtherDetails } = require("./embedded-document-query");
let puppeteer = require("puppeteer");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// https://www.ebay.com/
async function scraper(brand) {
  let productsWithPartialDetails = await getAllProducts(brand);
}

function getAllProducts(brand){
  return new Promise(async function (resolve, reject) {
    const browser = await puppeteer.launch();
    let page = await browser.newPage();

    let productList =[];
    for (i = 1; i < 100; i++) {
      try {
        let productDetails = await getProductInitialDetails(brand, i, page);
        if (productDetails.length < 2) {
          browser.close();
          console.log("parsed all products!");
          return resolve(productList);
        }
        let fullProductDetails = await addOtherDetails(
          brand,
          productDetails,
          page
        );
        //productList = productList.concat(productDetails);
      } catch (error) {
        console.log(error);
        continue;
      }
    }
    browser.close();
    return resolve(productList);
  });
 
}

async function addOtherDetails(brand, productList, page) {
  return new Promise(async function (resolve, reject) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const csvWriter = createCsvWriter({
      path: "out_ebay.csv",
      header: [
        { id: "link", title: "link" },
        { id: "marketPlace", title: "marketplace" },
        { id: "name", title: "name" },
        { id: "brand", title: "brand" },
        { id: "size", title: "size" },
        { id: "currentPrice", title: "currentPrice" },
        { id: "previousPrice", title: "previousPrice" },
        { id: "department", title: "department" },
        { id: "color", title: "color" },
        { id: "shippingCharge", title: "shippingCharge" },
      ],
    });
    for (product of productList) {
      try {
        let url = product["link"];
        let otherDetails = await getOtherDetails(url, page);
        product["color"] = otherDetails["color"];
        product["size"] = otherDetails["size"];
        product["department"] = otherDetails["department"];
        product["brand"] = brand;

        await csvWriter.writeRecords([product]);
        console.log(product);
      } catch (error) {
        console.log(error);
        continue;
      }
    }
    return resolve(product);
  });
}

(async() =>{
  // let allProducts = await getAllProducts("nike");
  // console.log(allProducts);
  await scraper("addidas");
})();
