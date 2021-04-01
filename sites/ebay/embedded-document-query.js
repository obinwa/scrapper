let puppeteer = require("puppeteer");

//pass in an array to keys

function getOtherDetailsFromUrl(url) {
  return new Promise(async function (resolve, reject) {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      await page.waitForSelector("table", { timeout: 0 });

      let color = await getTableDetails(page, ["Colour", "Color"]);
      let size = await getTableDetails(page, ["Size:", "Width:"]);
      let department = await getTableDetails(page, ["Department:"]);

      browser.close();
      return resolve({ color: color, size: size, department: department });
    } catch (error) {
      return reject(error);
    }
  });
}

function getTableDetails(page, keys) {
  return new Promise(async function (resolve, reject) {
    const tableData = await page.$$eval("td", (tds) =>
      tds.map((td) => td.innerText)
    );
    for (var i = 0; i < tableData.length; i++) {
      if (isStringInArray(tableData[i], keys)) {
        return resolve(tableData[i + 1]);
      }
    }
    return resolve("");
  });
}

function isStringInArray(string, array) {
  for (key of array) {
    if (string.includes(key)) {
      return true;
    }
  }
  return false;
}

// (async () => {
//   let products = await getOtherDetailsFromUrl(
//     "https://www.ebay.com/itm/Everlane-Grey-Cashmere-Cropped-Sweater-XS/254916454729?hash=item3b5a346949:g:mr8AAOSwFiZgXOCu"
//   );
//   console.log(JSON.stringify(products));
// })();

exports.getOtherDetails = getOtherDetailsFromUrl;
