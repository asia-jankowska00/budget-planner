const connection = require("../config/connection");
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const Currency = require('./currency');

class User {
  constructor(user) {
    this.id = user.id;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;

    if (user.isDisabled !== undefined && user.isDisabled !== null) {
      this.isDisabled = user.isDisabled;
    }

    if (user.currency) {
      this.currency = {};
      this.currency.id = user.currency.id;
      this.currency.name = user.currency.name;
      this.currency.code = user.currency.code;
      this.currency.symbol = user.currency.symbol;
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
            SELECT 
            bpLogin.LoginUsername, 
            bpLogin.LoginPassword,
            bpUser.UserIsDisabled
            FROM bpLogin
            INNER JOIN bpUser
            ON bpUser.UserId = bpLogin.UserId
            WHERE bpLogin.LoginUsername = @LoginUsername
            AND
            NOT bpUser.UserIsDisabled = 1;
            `);

          if (!result.recordset[0])
            throw {
              status: 404,
              message: "User not found",
            };

          const match = await bcrypt.compare(
            input.password,
            result.recordset[0].LoginPassword
          );

          if (!match) throw { statusCode: 400, message: "Wrong credentials" };

          resolve();
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
              SELECT bpLogin.UserId
              FROM bpLogin
              INNER JOIN bpUser
              ON bpUser.UserId = bpLogin.UserId
              WHERE bpLogin.LoginUsername = @LoginUsername
              AND NOT bpUser.UserIsDisabled = 1;
          `);

          if (result.recordset[0])
            throw {
              status: 409,
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
              bpLogin.LoginUsername LIKE @Query + '%' 
              OR 
              bpUser.UserFirstName LIKE @Query + '%'
              OR 
              bpUser.UserLastName LIKE @Query + '%'
              AND NOT bpUser.UserIsDisabled = 1;
          `);

          if (!result.recordset[0])
            throw {
              status: 404,
              message: "User not found",
            };

          const dbRecords = [];

          result.recordset.forEach((record) => {
            dbRecords.push(new User({
              id: record.UserId,
              username: record.LoginUsername,
              firstName: record.UserFirstName,
              lastName: record.UserLastName,
            }))
          });

          resolve(dbRecords);
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

          const hash = await bcrypt.hash(input.password, 10);
          if (!hash) {
            throw {
              status: 500,
              message: "Something went wrong",
            };
          } else {
            input.password = hash;
          }

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
              bpCurrency.CurrencyCode,
              bpCurrency.CurrencySymbol
              FROM bpUser
              INNER JOIN bpLogin 
              ON bpUser.UserId = bpLogin.UserId  
              INNER JOIN bpCurrency 
              ON bpUser.CurrencyId = bpCurrency.CurrencyId  
              WHERE bpUser.UserId = IDENT_CURRENT('bpUser');`
            );

          if (!result.recordset[0])
            throw {
              status: 500,
              message: "Failed to save User to database.",
            };

          const record = result.recordset[0];
          const dbRecord = {
            id: record.UserId,
            username: record.LoginUsername,
            firstName: record.UserFirstName,
            lastName: record.UserLastName,
            currency: {
              id: record.CurrencyId,
              name: record.CurrencyName,
              code: record.CurrencyCode,
              symbol: record.CurrencySymbol
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
              bpUser.CurrencyId,
              bpCurrency.CurrencyName,
              bpCurrency.CurrencyCode,
              bpCurrency.CurrencySymbol
              FROM bpUser
              INNER JOIN bpLogin 
              ON bpUser.UserId = bpLogin.UserId  
              INNER JOIN bpCurrency 
              ON bpUser.CurrencyId = bpCurrency.CurrencyId  
              WHERE bpUser.UserId = @UserId
              AND NOT bpUser.UserIsDisabled = 1; 
          `);

          if (!result.recordset[0] || result.recordset[0].UserIsDisabled)
            throw {
              status: 404,
              message: "User not found",
            };

          const record = result.recordset[0];
          const dbRecord = {
            id: record.UserId,
            username: record.LoginUsername,
            firstName: record.UserFirstName,
            lastName: record.UserLastName,
            currency: {
              id: record.CurrencyId,
              name: record.CurrencyName,
              code: record.CurrencyCode,
              symbol: record.CurrencySymbol
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
              bpCurrency.CurrencyCode,
              bpCurrency.CurrencySymbol
              FROM bpLogin
              INNER JOIN bpUser 
              ON bpLogin.UserId = bpUser.UserId  
              INNER JOIN bpCurrency 
              ON bpUser.CurrencyId = bpCurrency.CurrencyId  
              WHERE bpLogin.LoginUsername = @LoginUsername
              AND NOT bpUser.UserIsDisabled = 1; 
          `);

          if (!result.recordset[0] || result.recordset[0].UserIsDisabled)
            throw {
              status: 404,
              message: "User not found",
            };

          const record = result.recordset[0];
          const dbRecord = {
            id: record.UserId,
            username: record.LoginUsername,
            firstName: record.UserFirstName,
            lastName: record.UserLastName,
            currency: {
              id: record.CurrencyId,
              name: record.CurrencyName,
              code: record.CurrencyCode,
              symbol: record.CurrencySymbol
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

          if (key === "password") {
            const newPassword = await bcrypt.hash(input[key], 10);
            if (!newPassword)
              throw {
                status: 500,
                message: "Something went wrong",
              };

            const pool = await sql.connect(connection);
            await pool
              .request()
              .input("UserId", sql.NVarChar, this.id)
              .input("LoginPassword", sql.NVarChar, newPassword).query(`
                    UPDATE bpLogin
                    SET 
                    LoginPassword = @LoginPassword
                    WHERE UserId = @UserId;
                  `);

            resolve();
            sql.close();
          } else if (key === "currencyId") {
            const currency = await Currency.readById(input[key]);
            if (!currency) {
              throw {
                status: 400,
                message: 'Invalid data'
              }
            }

            this.currency = currency;

            const pool = await sql.connect(connection);
            await pool
              .request()
              .input("CurrencyId", sql.Int, this.currency.id)
              .input("UserId", sql.Int, this.id)
              .query(`UPDATE bpUser SET CurrencyId = @CurrencyId WHERE UserId = @UserId;`);

            sql.close();
          } else {
            if (this[key] !== undefined && this[key] !== null) {
              this[key] = input[key];

              const pool = await sql.connect(connection);
              await pool
                .request()
                .input("UserId", sql.Int, this.id)
                .input("UserFirstName", sql.NVarChar, this.firstName)
                .input("UserLastName", sql.NVarChar, this.lastName)
                .input("LoginUsername", sql.NVarChar, this.username)
                .query(`
                    UPDATE bpUser
                    SET UserFirstName = @UserFirstName,
                    UserLastName = @UserLastName
                    WHERE UserId = @UserId;

                    UPDATE bpLogin
                    SET LoginUsername = @LoginUsername
                    WHERE UserId = @UserId;
                  `);
  
              sql.close();
            } else {
              throw {
                status: 400,
                message: 'Invalid data'
              }
            }
          }
          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
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

             SELECT * FROM bpUser WHERE UserId = @UserId;
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
