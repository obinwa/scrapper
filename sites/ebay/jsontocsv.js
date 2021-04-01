const createCsvWriter = require("csv-writer").createObjectCsvWriter;

function getCsvWriter() {
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
  return csvWriter;
}

function writeToCSV(data) {
  return new Promise(async function (resolve, reject) {
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
    await csvWriter
      .writeRecords([data])
      .then(() => console.log(`saved data ${data["name"]} to csv`))
      .catch((error) => console.log(error));
    return resolve(true);
  });
}

exports.writeToCSV = writeToCSV;
