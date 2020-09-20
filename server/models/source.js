const connection = require("../config/connection");
const sql = require("mssql");
const axios = require("axios");

class Source {
  constructor(source) {
    this.id = source.id;
    this.name = source.sourceName;
    if (
      source.sourceDescription !== undefined &&
      source.sourceDescription !== null
    ) {
      this.description = source.sourceDescription;
    } else {
      this.description = "";
    }
    if (source.sourceConvertedAmount) {
      this.convertedAmount = source.sourceConvertedAmount;
    }
    this.amount = source.sourceAmount;
    this.currency = {};
    this.currency.id = source.currency.id;
    this.currency.name = source.currency.name;
    this.currency.code = source.currency.code;
    this.currency.symbol = source.currency.symbol;

    if (source.owner) {
      this.owner = {};
      this.owner.id = source.owner.id;
      this.owner.firstName = source.owner.firstName;
      this.owner.lastName = source.owner.lastName;
      this.owner.username = source.owner.username;

      this.owner.currency = {};
      this.owner.currency.id = source.owner.currency.id;
      this.owner.currency.name = source.owner.currency.name;
      this.owner.currency.code = source.owner.currency.code;
      this.owner.currency.symbol = source.owner.currency.symbol;
    }
  }

  // checker methods
  static checkOwner(sourceId, userId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const access = await pool
            .request()
            .input("SourceId", sql.Int, sourceId)
            .input("UserId", sql.Int, userId).query(`
            SELECT SourceId FROM bpSource
            WHERE SourceId = @SourceId AND UserId = @UserId;
          `);

          if (!access.recordset[0]) {
            throw {
              status: 401,
              message: "You are not the owner of this source",
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
  }

  // source CRUD
  static create(sourceObj, owner) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("SourceName", sql.NVarChar, sourceObj.name)
            .input("SourceDescription", sql.NVarChar, sourceObj.description)
            .input("SourceAmount", sql.Money, sourceObj.amount)
            .input("UserId", sql.Int, owner.id)
            .input("CurrencyId", sql.Int, sourceObj.currencyId).query(`
                  INSERT INTO bpSource (SourceName, SourceDescription, SourceAmount, UserId, CurrencyId)
                  VALUES (@SourceName, @SourceDescription, @SourceAmount, @UserId, @CurrencyId);

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
              symbol: record.CurrencySymbol,
            },
            owner: owner,
          });

          resolve(newSource);
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

  static readAllOwner(owner) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool.request().input("UserId", sql.Int, owner.id)
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
            };

          const { data } = await axios.get(
            `https://api.exchangeratesapi.io/latest?base=${owner.currency.code.toUpperCase()}`
          );

          const sources = [];
          result.recordset.forEach((record) => {
            const sourceObj = {
              id: record.SourceId,
              sourceName: record.SourceName,
              sourceDescription: record.SourceDescription,
              sourceAmount: record.SourceAmount,
              sourceConvertedAmount: Number(
                parseFloat(
                  record.SourceAmount /
                    data.rates[record.CurrencyCode.toUpperCase()]
                ).toFixed(4)
              ),
              currency: {
                id: record.CurrencyId,
                name: record.CurrencyName,
                code: record.CurrencyCode,
                symbol: record.CurrencySymbol,
              },
              owner: owner,
            };

            sources.push(new Source(sourceObj));
          });

          resolve(sources);
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

  static readById(sourceId, requester) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("SourceId", sql.Int, sourceId).query(`
            SELECT SourceId, SourceName, SourceDescription, SourceAmount, 
            bpSource.UserId,
            bpSource.CurrencyId, 
            CurrencyName,
            CurrencyCode, 
            CurrencySymbol 
            FROM bpSource
            INNER JOIN bpCurrency
            ON bpSource.CurrencyId = bpCurrency.CurrencyId
            INNER JOIN bpUser
            on bpSource.UserId = bpUser.UserId
            WHERE bpSource.SourceId = @SourceId;
            `);

          if (!result.recordset[0]) {
            throw {
              status: 500,
              message: "Failed to get source",
            };
          }

          const { data } = await axios.get(
            `https://api.exchangeratesapi.io/latest?base=${requester.currency.code.toUpperCase()}`
          );

          const record = result.recordset[0];
          const source = new Source({
            id: record.SourceId,
            sourceName: record.SourceName,
            sourceDescription: record.SourceDescription,
            sourceAmount: record.SourceAmount,
            sourceConvertedAmount: Number(
              parseFloat(
                record.SourceAmount /
                  data.rates[record.CurrencyCode.toUpperCase()]
              ).toFixed(4)
            ),
            currency: {
              id: record.CurrencyId,
              name: record.CurrencyName,
              code: record.CurrencyCode,
              symbol: record.CurrencySymbol,
            },
          });

          resolve(source);
        } catch (err) {
          console.log(err);
          reject(err);
        }

        sql.close();
      })();
    });
  }

  update(input, owner) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          const key = Object.keys(input)[0];

          let result;

          if (key === "currencyId") {
            this.currency.id = input.currencyId;

            result = await pool
              .request()
              .input("SourceId", sql.Int, this.id)
              .input("CurrencyId", sql.Int, this.currency.id)
              .input("UserId", sql.Int, owner.id)
              .query(
                `UPDATE bpSource SET CurrencyId = @CurrencyId WHERE UserId = @UserId AND SourceId=@SourceId;`
              );
          } else {
            this[key] = input[key];

            result = await pool
              .request()
              .input("SourceId", sql.Int, this.id)
              .input("SourceName", sql.NVarChar, this.name)
              .input("SourceDescription", sql.NVarChar, this.description)
              .input("SourceAmount", sql.Money, this.amount)
              .input("CurrencyId", sql.Int, this.currency.id)
              .input("UserId", sql.Int, owner.id).query(`
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
              message: "Failed to update source",
            };
          }

          if (result.rowsAffected.length != 1) {
            throw {
              status: 500,
              message: "Database is corrupt",
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
  }

  static delete(sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          await pool.request().input("SourceId", sql.Int, sourceId).query(`
          DELETE FROM bpTransaction
          WHERE SourceId = @SourceId;

          DELETE bpUserSourceContainer FROM bpUserSourceContainer
          INNER JOIN bpSourceContainer
          ON bpUserSourceContainer.SourceContainerId = bpSourceContainer.SourceContainerId
          WHERE SourceId = @SourceId;

          DELETE FROM bpSourceContainer
          WHERE SourceId = @SourceId;

          DELETE FROM bpSource 
          WHERE SourceId = @SourceId;
            `);

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }
}

module.exports = Source;
