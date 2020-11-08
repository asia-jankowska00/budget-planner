const pool = require("../db");

class Currency {
  constructor(currency) {
    this.id = currency.id;
    this.code = currency.code;
    this.name = currency.name;
    this.symbol = currency.symbol;
  }
  static readAll() {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
              SELECT *
              FROM bpCurrency;
            `);

          if (!rows[0])
            throw {
              status: 404,
              message: "No currencies found",
            };

          const currencies = [];

          rows.forEach((record) => {
            const currency = {
              id: record.currencyid,
              code: record.currencycode,
              name: record.currencyname,
              symbol: record.currencysymbol,
            };

            currencies.push(new Currency(currency));
          });

          resolve(currencies);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  static readById(currencyId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
            SELECT * FROM bpCurrency WHERE CurrencyId = $1;
          `, [currencyId]);

          if (!rows[0])
            throw {
              status: 404,
              message: "Currency not found",
            };

          const currency = {
            id: rows[0].currencyid,
            code: rows[0].currencycode,
            name: rows[0].currencyname,
            symbol: rows[0].currencysymbol,
          };

          resolve(new Currency(currency));
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }
}

module.exports = Currency;
