const connection = require("../config/connection");
const sql = require("mssql");
const Currency = require('./currency')

class Source {
  constructor(source) {
    this.id = source.id;
    this.name = source.sourceName;
    if (source.sourceDescription !== undefined && source.sourceDescription !== null) {
      this.description = source.sourceDescription
    } else {
      this.description = "";
    }
    if (source.convertedAmount) {
      this.convertedAmount = source.source.convertedAmount
    }
    this.amount = source.sourceAmount;
    this.currency = {};
    this.currency.id = source.currency.id;
    this.currency.name = source.currency.name;
    this.currency.code = source.currency.code;
    this.currency.symbol = source.currency.symbol;
  }

  static create(sourceObj, userObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("SourceName", sql.NVarChar, sourceObj.name)
            .input("SourceDescription", sql.NVarChar, sourceObj.description)
            .input("SourceAmount", sql.Money, sourceObj.amount)
            .input("UserId", sql.Int, userObj.id)
            .input("CurrencyId", sql.Int, sourceObj.currencyId)
            .query(`
                  INSERT INTO bpSource (SourceName, SourceDescription, SourceAmount, UserId, CurrencyId)
                  VALUES (@SourceName, @SourceDescription, @SourceAmount, @UserId, @CurrencyId);

                  INSERT INTO bpUserSource (UserId, SourceId)
                  VALUES (@UserId, SCOPE_IDENTITY());

                  SELECT SourceId, SourceName, SourceDescription, SourceAmount, bpSource.CurrencyId, CurrencyName, CurrencyCode, CurrencySymbol FROM bpSource
                  INNER JOIN bpCurrency
                  ON bpSource.CurrencyId = bpCurrency.CurrencyId
                  WHERE SourceId = IDENT_CURRENT('bpSource');
      `);

          if (!result.recordset[0])
            throw {
              status: 500,
              message: "Failed to save Source to database.",
            };

          const record = result.recordset[0];
          const newSource = new Source({
            id: record.SourceId,
            sourceName: record.SourceName,
            sourceDescription: record.SourceDescription,
            sourceAmount: record.SourceAmount,
            currency: {
              id: record.CurrencyId,
              name: record.CurrencyName,
              code: record.CurrencyCode,
              symbol: record.CurrencySymbol
            }
          })

          resolve(newSource);

        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    })
  };

  static readAllOwner(userObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("UserId", sql.Int, userObj.id)
            .query(`
          SELECT 
          bpSource.SourceId,
          bpSource.SourceName,
          bpSource.SourceDescription,
          bpSource.SourceAmount,
          bpSource.CurrencyId,
          bpCurrency.CurrencyCode,
          bpCurrency.CurrencyName,
          bpCurrency.CurrencySymbol 
          FROM bpSource 
          INNER JOIN bpCurrency
          ON bpCurrency.CurrencyId = bpSource.CurrencyId
          WHERE bpSource.UserId = @UserId;
          `);

          if (result.recordset.length <= 0)
            throw {
              status: 404,
              message: "No sources found",
            }

          const sources = [];
          result.recordset.forEach((record) => {
            const sourceObj = {
              id: record.SourceId,
              sourceName: record.SourceName,
              sourceDescription: record.SourceDescription,
              sourceAmount: record.SourceAmount,
              currency: {
                id: record.CurrencyId,
                name: record.CurrencyName,
                code: record.CurrencyCode,
                symbol: record.CurrencySymbol
              }
            };

            sources.push(new Source(sourceObj));
          })

          resolve(sources);

        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  };

  static readById(sourceId, userObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          //throw 401 Unauthorized if the source exists and you are not the owner
          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("SourceId", sql.Int, sourceId)
            .input("UserId", sql.Int, userObj.id)
            .query(`
            SELECT SourceId, SourceName, SourceDescription, SourceAmount, bpSource.CurrencyId, CurrencyName, CurrencyCode, CurrencySymbol FROM bpSource
            INNER JOIN bpCurrency
            ON bpSource.CurrencyId = bpCurrency.CurrencyId
            WHERE bpSource.SourceId = @SourceId AND bpSource.UserId = @UserId;
            `)

          if (!result.recordset[0]) {
            throw {
              status: 500,
              message: "Failed to get source"
            };
          }
          const record = result.recordset[0];
          const source = new Source({
            id: record.SourceId,
            sourceName: record.SourceName,
            sourceDescription: record.SourceDescription,
            sourceAmount: record.SourceAmount,
            currency: {
              id: record.CurrencyId,
              name: record.CurrencyName,
              code: record.CurrencyCode,
              symbol: record.CurrencySymbol
            }
          })

          resolve(source);
        } catch (err) {
          console.log(err);
          reject(err);
        }

        sql.close();
      })();
    });
  };

  update(input, userObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {

          const key = Object.keys(input)[0];

          let result;

          if (key === "currencyId") {
            const currency = await Currency.readById(input[key]);

            if (!currency) {
              throw {
                status: 400,
                message: 'Invalid data'
              }
            }
            this.currency = currency;
            const pool = await sql.connect(connection);
            result = await pool
              .request()
              .input("SourceId", sql.Int, this.id)
              .input("CurrencyId", sql.Int, this.currency.id)
              .input("UserId", sql.Int, userObj.id)
              .query(`UPDATE bpSource SET CurrencyId = @CurrencyId WHERE UserId = @UserId AND SourceId=@SourceId;`);

          } else {
            this[key] = input[key];
            const pool = await sql.connect(connection);
            result = await pool
              .request()
              .input("SourceId", sql.Int, this.id)
              .input("SourceName", sql.NVarChar, this.name)
              .input("SourceDescription", sql.NVarChar, this.description)
              .input("SourceAmount", sql.Money, this.amount)
              .input("CurrencyId", sql.Int, this.currency.id)
              .input("UserId", sql.Int, userObj.id)
              .query(`
                  UPDATE bpSource
                  SET SourceName = @SourceName, SourceDescription = @SourceDescription,
                  SourceAmount = @SourceAmount,
                  CurrencyId = @CurrencyId
                  WHERE bpSource.SourceId = @SourceId AND bpSource.UserId = @UserId;
              `);
          }

          if (!result.rowsAffected[0]) {
            throw {
              status: 500,
              message: "Failed to update source"
            };
          }

          if (result.rowsAffected.length != 1) {
            throw {
              status: 500,
              message: "Database is corrupt"
            };
          }

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  };

  static delete(sourceId, userObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("SourceId", sql.Int, sourceId)
            .input("UserId", sql.Int, userObj.id)
            .query(`
          DELETE FROM bpTransaction
          WHERE SourceId = @SourceId;

          DELETE FROM bpContainerSource
          WHERE SourceId = @SourceId;
          
          DELETE FROM bpUserSource
          WHERE SourceId = @SourceId AND UserId = @UserId;

          DELETE FROM bpSource 
          WHERE SourceId = @SourceId AND UserId = @UserId;
            `);

          resolve();

        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  };

};

module.exports = Source;
