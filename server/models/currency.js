const connection = require("../config/connection");
const sql = require("mssql");

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
          const pool = await sql.connect(connection);
          const result = await pool.request().query(`
                  SELECT *
                  FROM bpCurrency;
              `);

          if (!result.recordset[0])
            throw {
              status: 404,
              message: "No currencies found",
            };

          const currencies = [];

          result.recordset.forEach((record) => {
            const currency = {
              id: record.CurrencyId,
              code: record.CurrencyCode,
              name: record.CurrencyName,
              symbol: record.CurrencySymbol,
            };

            currencies.push(new Currency(currency));
          });

          resolve(currencies);
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

  static readById(currencyId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const input = currencyId;

          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("CurrencyId", sql.Int, input).query(`
                SELECT *
                FROM bpCurrency
                WHERE CurrencyId = @CurrencyId;
            `);

          if (!result.recordset[0])
            throw {
              status: 404,
              message: "Currency not found",
            };

          const dbRecord = {
            id: result.recordset[0].CurrencyId,
            code: result.recordset[0].CurrencyCode,
            name: result.recordset[0].CurrencyName,
            symbol: result.recordset[0].CurrencySymbol,
          };

          resolve(new Currency(dbRecord));
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }
}

module.exports = Currency;
