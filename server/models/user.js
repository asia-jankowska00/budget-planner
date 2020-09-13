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

          if (!result.recordset[0])
            throw {
              message: "User not found",
            };

          const dbRecord = {
            username: result.recordset[0].LoginUsername,
          };

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
  static search(query) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const input = query;

          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("Query", sql.NVarChar, input).query(`
              SELECT 
              bpLogin.UserId,
              bpLogin.LoginUsername,
              bpUser.UserFirstName,
              bpUser.UserLastName
              FROM bpLogin 
              INNER JOIN bpUser 
              ON bpLogin.UserId = bpUser.UserId
              WHERE 
              bpLogin.LoginUsername LIKE '%' + @Query + '%' 
              OR 
              bpUser.UserFirstName LIKE '%' + @Query + '%'
              OR 
              bpUser.UserLastName LIKE '%' + @Query + '%';
          `);

          console.log(result);

          if (!result.recordset[0])
            throw {
              message: "User not found",
            };

          const dbRecord = [];

          result.recordset.forEach((record) => {
            const user = {
              id: record.UserId,
              username: record.LoginUsername,
              firstName: record.UserFirstName,
              lastName: record.UserLastName,
            };

            dbRecord.push(user);
          });

          resolve(dbRecord);
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

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
            .input("CurrencyId", sql.Int, input.currency)
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

  // update
  update(reqBody) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const input = reqBody;
          const key = Object.keys(input)[0];

          const pool = await sql.connect(connection);

          if (key === "password") {
            const newPassword = await bcrypt.hash(input[key], 10);
            if (!newPassword) throw { message: "Something went wrong" };

            await pool
              .request()
              .input("UserId", sql.NVarChar, this.id)
              .input("LoginPassword", sql.NVarChar, newPassword).query(`
                    UPDATE bpLogin
                    SET 
                    LoginPassword = @LoginPassword
                    WHERE UserId = @UserId;
                  `);
          } else {
            this[key] = input[key];

            await pool
              .request()
              .input("UserId", sql.Int, this.id)
              .input("LoginUsername", sql.NVarChar, this.username)
              .input("UserFirstName", sql.NVarChar, this.firstName)
              .input("UserLastName", sql.NVarChar, this.lastName)
              .input("UserIsDisabled", sql.NVarChar, this.isDisabled)
              .input("CurrencyId", sql.Int, this.currency.id).query(`
                UPDATE bpUser
                SET UserFirstName = @UserFirstName,
                UserLastName = @UserLastName,
                UserIsDisabled = @UserIsDisabled,
                CurrencyId = @CurrencyId
                WHERE UserId = @UserId;
  
                UPDATE bpLogin
                SET LoginUsername = @LoginUsername
                WHERE UserId = @UserId;
              `);
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
