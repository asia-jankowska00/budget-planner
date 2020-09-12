const connection = require("../config/connection");
const sql = require("mssql");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

class User {
  constructor(user) {
    this.id = user.id;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.isDisabled = user.isDisabled;
    if (user.currency) {
      this.currency = {};
      this.currency.id = user.currency.id;
      this.currency.name = user.currency.name;
      this.currency.code = user.currency.code;
      this.sources = user.sources;
      this.containers = user.containers;
    }
  }

  // matchPassword
  static matchPassword(reqBody) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const input = reqBody;

          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("LoginUsername", sql.NVarChar, input.username).query(`
            SELECT LoginUsername, LoginPassword
            FROM bpLogin
            WHERE LoginUsername = @LoginUsername
            `);
          console.log(result);

          if (!result.recordset[0])
            throw {
              message: "User not found",
            };

          const dbRecord = {
            username: result.recordset[0].LoginUsername,
          };
          console.log(input);

          const match = await bcrypt.compare(
            input.password,
            result.recordset[0].LoginPassword
          );
          if (!match) throw { statusCode: 400, message: "Incorrect password" };

          resolve(new User(dbRecord));
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

  // canCreateUser
  static canCreateUser(username) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const input = username;

          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("LoginUsername", sql.NVarChar, input).query(`
              SELECT UserId
              FROM bpLogin
              WHERE LoginUsername = @LoginUsername; 
          `);
          console.log(result);

          if (result.recordset[0])
            throw {
              message: "Username taken",
            };

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

  // search

  // create
  static create(reqBody) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const input = reqBody;

          bcrypt.hash(input.password, 10, function (err, hash) {
            if (err)
              throw {
                message: "Failed to save password.",
              };
            else {
              input.password = hash;
            }
          });

          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("LoginUsername", sql.NVarChar, input.username)
            .input("LoginPassword", sql.NVarChar, input.password)
            .input("UserFirstName", sql.NVarChar, input.firstName)
            .input("UserLastName", sql.NVarChar, input.lastName)
            .input("UserIsDisabled", sql.Bit, false)
            .input("CurrencyId", sql.Int, input.currency.id)
            .query(
              `INSERT INTO bpUser (UserFirstName, UserLastName, UserIsDisabled, CurrencyId) 
              VALUES (@UserFirstName, @UserLastName, @UserIsDisabled, @CurrencyId);

              INSERT INTO bpLogin (LoginUsername, LoginPassword, UserId)
              VALUES (@LoginUsername, @LoginPassword, SCOPE_IDENTITY());

              SELECT bpUser.UserId, 
              bpLogin.LoginUsername,
              bpUser.UserFirstName, 
              bpUser.UserLastName,
              bpUser.UserIsDisabled,
              bpUser.CurrencyId,
              bpCurrency.CurrencyName,
              bpCurrency.CurrencyCode
              FROM bpUser
              INNER JOIN bpLogin 
              ON bpUser.UserId = bpLogin.UserId  
              INNER JOIN bpCurrency 
              ON bpUser.CurrencyId = bpCurrency.CurrencyId  
              WHERE bpUser.UserId = IDENT_CURRENT('bpUser');`
            );

          console.log(result);

          if (!result.recordset[0])
            throw {
              message: "Failed to save User to database.",
            };

          const dbRecord = {
            id: result.recordset[0].UserId,
            username: result.recordset[0].LoginUsername,
            firstName: result.recordset[0].UserFirstName,
            lastName: result.recordset[0].UserLastName,
            isDisabled: result.recordset[0].UserIsDisabled,
            currency: {
              id: result.recordset[0].CurrencyId,
              name: result.recordset[0].CurrencyName,
              code: result.recordset[0].CurrencyCode,
            },
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

  // readById
  static readById(userId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const input = userId;

          const pool = await sql.connect(connection);
          const result = await pool.request().input("UserId", sql.Int, input)
            .query(`
          SELECT bpUser.UserId, 
              bpLogin.LoginUsername,
              bpUser.UserFirstName, 
              bpUser.UserLastName,
              bpUser.UserIsDisabled,
              bpUser.CurrencyId,
              bpCurrency.CurrencyName,
              bpCurrency.CurrencyCode
              FROM bpUser
              INNER JOIN bpLogin 
              ON bpUser.UserId = bpLogin.UserId  
              INNER JOIN bpCurrency 
              ON bpUser.CurrencyId = bpCurrency.CurrencyId  
              WHERE bpUser.UserId = @UserId; 
          `);
          console.log(result);

          if (!result.recordset[0])
            throw {
              message: "User not found",
            };

          const dbRecord = {
            id: result.recordset[0].UserId,
            username: result.recordset[0].LoginUsername,
            firstName: result.recordset[0].UserFirstName,
            lastName: result.recordset[0].UserLastName,
            isDisabled: result.recordset[0].UserIsDisabled,
            currency: {
              id: result.recordset[0].CurrencyId,
              name: result.recordset[0].CurrencyName,
              code: result.recordset[0].CurrencyCode,
            },
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

  // readByUsername
  static readByUsername(username) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const input = username;

          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("LoginUsername", sql.NVarChar, input).query(`
          SELECT 
              bpLogin.LoginUsername,
              bpUser.UserId, 
              bpUser.UserFirstName, 
              bpUser.UserLastName,
              bpUser.UserIsDisabled,
              bpUser.CurrencyId,
              bpCurrency.CurrencyName,
              bpCurrency.CurrencyCode
              FROM bpLogin
              INNER JOIN bpUser 
              ON bpLogin.UserId = bpUser.UserId  
              INNER JOIN bpCurrency 
              ON bpUser.CurrencyId = bpCurrency.CurrencyId  
              WHERE bpLogin.LoginUsername = @LoginUsername; 
          `);
          console.log(result);

          if (!result.recordset[0])
            throw {
              message: "User not found",
            };

          const dbRecord = {
            id: result.recordset[0].UserId,
            username: result.recordset[0].LoginUsername,
            firstName: result.recordset[0].UserFirstName,
            lastName: result.recordset[0].UserLastName,
            isDisabled: result.recordset[0].UserIsDisabled,
            currency: {
              id: result.recordset[0].CurrencyId,
              name: result.recordset[0].CurrencyName,
              code: result.recordset[0].CurrencyCode,
            },
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

  // readAll

  // update
  update(reqBody) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const input = reqBody;

          const key = Object.keys(input)[0];

          this[key] = input[key];

          const updatedUser = {
            id: this.id,
            username: this.username,
            firstName: this.firstName,
            lastName: this.lastName,
            isDisabled: this.isDisabled,
            currency: {
              id: this.currency.id,
              name: this.currency.name,
              code: this.currency.code,
            },
            sources: this.sources,
            containers: this.containers,
          };

          // switch (key) {
          //   case value:

          //     break;

          //   default:
          //     break;
          // }

          // const pool = await sql.connect(connection);
          // const result = await pool
          //   .request()
          //   .input("UserId", sql.Int, input)
          //   .input("UserIsDisabled", sql.Bit, true).query(`
          // UPDATE bpUser
          // SET UserIsDisabled = @UserIsDisabled
          // WHERE UserId = @UserId;
          // `);
          // console.log(result);

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

  // delete
  static delete(userId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const input = userId;

          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("UserId", sql.Int, input)
            .input("UserIsDisabled", sql.Bit, true).query(`
          UPDATE bpUser
          SET UserIsDisabled = @UserIsDisabled
          WHERE UserId = @UserId;
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

module.exports = User;
