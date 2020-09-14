const https = require("https");

const getCurrencies = async () => {
  const EUCurrencies = await getEUCurrencies();
  const USCurrencies = await getUSCurrencies();

  const currencies = EUCurrencies.concat(USCurrencies);
  console.log(currencies);

  let tableName = "bpCurrency";
  let query = `INSERT INTO ${tableName} (CurrencyCode, CurrencyName, CurrencySymbol)
  VALUES
  `;

  currencies.forEach((entry) => {
    query += `('${entry.code}', '${entry.name}', N'${entry.symbol}'), 
    `;
  });
  console.log(query);
};

const getEUCurrencies = async () => {
  return new Promise((resolve, reject) => {
    https
      .get("https://restcountries.eu/rest/v2/region/europe", (resp) => {
        let data = "";

        resp.on("data", (chunk) => {
          data += chunk;
        });

        resp.on("end", () => {
          let EUCurrencies = [];
          data = JSON.parse(data);
          data.forEach((country) => {
            if (
              !EUCurrencies.find(
                (currency) => currency.code === country.currencies[0].code
              )
            ) {
              EUCurrencies.push(country.currencies[0]);
            }
          });

          resolve(EUCurrencies);
          // console.log(EUCurrencies);
          // console.log(EUCurrencies.length);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

const getUSCurrencies = async () => {
  return new Promise((resolve, reject) => {
    https
      .get("https://restcountries.eu/rest/v2/regionalbloc/NAFTA", (resp) => {
        let data = "";

        resp.on("data", (chunk) => {
          data += chunk;
        });

        resp.on("end", () => {
          let USCurrencies = [];
          data = JSON.parse(data);
          data.forEach((country) => {
            if (
              !USCurrencies.find(
                (currency) => currency.code === country.currencies[0].code
              )
            ) {
              USCurrencies.push(country.currencies[0]);
            }
          });

          resolve(USCurrencies);
          // console.log(USCurrencies);
          // console.log(USCurrencies.length);
        });
      })
      .on("error", (err) => {
        reject(err);
        console.log("Error: " + err.message);
      });
  });
};

getCurrencies();
