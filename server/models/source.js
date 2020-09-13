const connection = require("../config/connection");
const sql = require("mssql");
const Joi = require("joi");
const { create } = require("./user");
const { ValidationError, isSchema } = require("joi");

class Source {
  constructor(source) {
    this.id = source.id;
    this.name = source.sourceName;
    if(source.sourceDescription !== undefined && source.sourceDescription !== null){
      this.description = source.sourceDescription
    } else {
      this.description = "";
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
            id : record.SourceId,
            sourceName : record.SourceName,
            sourceDescription : record.SourceDescription,
            sourceAmount : record.SourceAmount,
            currency : {
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
    
  };
};



//create source \\
//readAll -- has access to
//readAll -- is owner of
//readById
//update
//delete
//reallAllContainers -- where you sources are involved



module.exports = Source;
