const pool = require("../db");
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

      if (source.owner.currency) {
        this.owner.currency = {};
        this.owner.currency.id = source.owner.currency.id;
        this.owner.currency.name = source.owner.currency.name;
        this.owner.currency.code = source.owner.currency.code;
        this.owner.currency.symbol = source.owner.currency.symbol;
      }
    }
  }

  // checker methods
  static checkOwner(sourceId, userId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows: access } = await pool.query(`
            SELECT SourceId FROM bpSource
            WHERE SourceId = $1 AND UserId = $2;
          `, [sourceId, userId]);

          if (!access[0]) {
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
      })();
    });
  }

  // source CRUD
  static create(sourceObj, owner) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows: sourceId } = await pool.query(`
            INSERT INTO bpSource (SourceName, SourceDescription, SourceAmount, UserId, CurrencyId)
            VALUES ($1, $2, $3, $4, $5) RETURNING SourceId;
          `, [sourceObj.name, sourceObj.description, sourceObj.amount, owner.id, sourceObj.currencyId]);

          const SourceId = sourceId[0].sourceid

          const { rows: source } = await pool.query(`
            SELECT SourceId, SourceName, SourceDescription, SourceAmount, 
            bpSource.CurrencyId, CurrencyName, CurrencyCode, CurrencySymbol 
            FROM bpSource
            INNER JOIN bpCurrency
            ON bpSource.CurrencyId = bpCurrency.CurrencyId
            WHERE SourceId = $1;
          `, [SourceId]);

          if (!source[0])
            throw {
              status: 500,
              message: "Failed to save Source to database.",
            };

          const { data } = await axios.get(
            `https://api.exchangeratesapi.io/latest?base=${owner.currency.code.toUpperCase()}`
          );

          const record = source[0];
          const newSource = new Source({
            id: record.sourceid,
            sourceName: record.sourcename,
            sourceDescription: record.sourcedescription,
            sourceAmount: record.sourceamount,
            sourceConvertedAmount: Number(
              parseFloat(
                record.sourceamount /
                  data.rates[record.currencycode.toUpperCase()]
              ).toFixed(4)
            ),
            currency: {
              id: record.currencyid,
              name: record.currencyname,
              code: record.currencycode,
              symbol: record.currencysymbol,
            },
            owner: owner,
          });

          resolve(newSource);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  static readAllOwner(owner) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
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
            WHERE bpSource.UserId = $1;
          `, [owner.id]);

          if (rows.length < 0)
            throw {
              status: 404,
              message: "No sources found",
            };

          const { data } = await axios.get(
            `https://api.exchangeratesapi.io/latest?base=${owner.currency.code.toUpperCase()}`
          );

          const sources = [];
          if (rows.length > 0) {
            rows.forEach((record) => {
              const sourceObj = {
                id: record.sourceid,
                sourceName: record.sourcename,
                sourceDescription: record.sourcedescription,
                sourceAmount: record.sourceamount,
                sourceConvertedAmount: Number(
                  parseFloat(
                    record.sourceamount /
                      data.rates[record.currencycode.toUpperCase()]
                  ).toFixed(4)
                ),
                currency: {
                  id: record.currencyid,
                  name: record.currencyname,
                  code: record.currencycode,
                  symbol: record.currencysymbol,
                },
                owner: owner,
              };

              sources.push(new Source(sourceObj));
            });
          }

          resolve(sources);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  static readById(sourceId, requester) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
            SELECT SourceId, SourceName, SourceDescription, SourceAmount, 
            bpSource.UserId,
            bpLogin.LoginUsername,
            bpUser.UserFirstName,
            bpUser.UserLastName,
            bpSource.CurrencyId, 
            CurrencyName,
            CurrencyCode, 
            CurrencySymbol 
            FROM bpSource
            INNER JOIN bpCurrency
            ON bpSource.CurrencyId = bpCurrency.CurrencyId
            INNER JOIN bpUser
            on bpSource.UserId = bpUser.UserId
            INNER JOIN bpLogin
            on bpSource.UserId = bpLogin.UserId
            WHERE bpSource.SourceId = $1;
          `, [sourceId]);

          if (!rows[0]) {
            throw {
              status: 500,
              message: "Failed to get source",
            };
          }

          const { data } = await axios.get(
            `https://api.exchangeratesapi.io/latest?base=${requester.currency.code.toUpperCase()}`
          );

          const record = rows[0];
          const source = new Source({
            id: record.sourceid,
            sourceName: record.sourcename,
            sourceDescription: record.sourcedescription,
            sourceAmount: record.sourceamount,
            sourceConvertedAmount: Number(
              parseFloat(
                record.sourceamount /
                  data.rates[record.currencycode.toUpperCase()]
              ).toFixed(4)
            ),
            currency: {
              id: record.currencyid,
              name: record.currencyname,
              code: record.currencycode,
              symbol: record.currencysymbol,
            },
            owner: {
              id: record.userid,
              username: record.loginusername,
              firstName: record.userfirstname,
              lastName: record.userlastname,
            },
          });

          resolve(source);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  update(sourceObj, owner) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const keys = Object.keys(sourceObj);

          let result;

          keys.forEach((key) => {
            this[key] = sourceObj[key];
          });

          if (keys.includes("currencyId")) {
            this.currency.id = sourceObj.currencyId;

            result = await pool.query(
              `UPDATE bpSource SET CurrencyId = $2 
              WHERE UserId = $3 AND SourceId = $1;
            `, [this.id, this.currency.id, owner.id]);

          } else {
            result = await pool.query(`
              UPDATE bpSource
              SET SourceName = $2, SourceDescription = $3,
              SourceAmount = $4,
              CurrencyId = $5
              WHERE bpSource.SourceId = $1 AND bpSource.UserId = $6
              RETURNING SourceId;
            `, [this.id, this.name, this.description, this.amount, this.currency.id, owner.id]);
          }

          if (!result.rows[0]) {
            throw {
              status: 500,
              message: "Failed to update source",
            };
          }

          if (result.rows.length != 1) {
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
      })();
    });
  }

  static delete(sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await pool.query(`
            DELETE FROM bpTransaction
            WHERE SourceId = $1;
          `, [sourceId]);

          await pool.query(`
            DELETE bpUserSourceContainer FROM bpUserSourceContainer
            INNER JOIN bpSourceContainer
            ON bpUserSourceContainer.SourceContainerId = bpSourceContainer.SourceContainerId
            WHERE SourceId = $1;
          `, [sourceId]);

          await pool.query(`
            DELETE FROM bpSourceContainer
            WHERE SourceId = $1;
          `, [sourceId]);

          await pool.query(`
            DELETE FROM bpSource 
            WHERE SourceId = $1;
          `, [sourceId]);

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }
}

module.exports = Source;
