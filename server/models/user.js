const connection = require("../config/connection");
const sql = require("mssql");
const Joi = require("joi");

class User {
  constructor(user) {
    this.ID = user.ID;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.isDisabled = user.isDisabled;
    this.preferredCurrency = user.preferredCurrency;
  }

  static validate(user) {
    const schema = Joi.object({
      userId: Joi.number().integer().min(1),
      firstName: Joi.string().min(1),
      lastName: Joi.string().min(1),
      isDisabled: Joi.number().integer().min(0).max(1),
      preferredCurrency: Joi.number().integer().min(1),
    });
  }
  // readById

  // readAll

  // create
  create() {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const userData = {
            firstName: this.firstName,
            lastName: this.lastName,
            isDisabled: false,
            preferredCurrency: this.preferredCurrency,
          };
          const { error } = User.validate(userData);
          if (error) throw error;

          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("firstName", sql.NVarChar, this.firstName)
            .input("lastName", sql.NVarChar, this.firstName)
            .input("isDisabled", sql.Bit, this.isDisabled)
            .input("preferredCurrency", sql.Int, this.preferredCurrency)
            .query(
              `INSERT INTO bpUser (firstName, lastName, isDisabled, preferredCurrency) 
              VALUES (@firstName, @lastName, @isDisabled, @preferredCurrency); 
              SELECT * FROM bpUser WHERE ID = SCOPE_IDENTITY()`
            );

          console.log(result);

          if (!result.recordset[0])
            throw {
              message: "Failed to save User to database.",
            };

          const dbRecord = {
            ID: result.recordset[0].ID,
            firstName: result.recordset[0].firstName,
            lastName: result.recordset[0].lastName,
            isDisabled: result.recordset[0].isDisabled,
            preferredCurrency: result.recordset[0].preferredCurrency,
          };

          resolve(new User(dbRecord));
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

  // delete
}

module.exports = User;
