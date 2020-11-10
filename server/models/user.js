const pool = require("../db");
const bcrypt = require("bcryptjs");
const Currency = require("./currency");

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
          const { rows } = await pool.query(`
            SELECT 
            bpLogin.LoginUsername, 
            bpLogin.LoginPassword,
            bpUser.UserIsDisabled
            FROM bpLogin
            INNER JOIN bpUser
            ON bpUser.UserId = bpLogin.UserId
            WHERE bpLogin.LoginUsername = $1
            AND bpUser.UserIsDisabled = false;
          `, [reqBody.username]);

          if (!rows[0])
            throw {
              status: 404,
              message: "User not found",
            };

          const match = await bcrypt.compare(
            reqBody.password,
            rows[0].loginpassword
          );

          if (!match) throw { statusCode: 400, message: "Wrong credentials" };

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  // canCreateUser
  static canCreateUser(username) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
            SELECT bpLogin.UserId
            FROM bpLogin
            INNER JOIN bpUser
            ON bpUser.UserId = bpLogin.UserId
            WHERE bpLogin.LoginUsername = $1
            AND bpUser.UserIsDisabled = false;
          `, [username]);

          if (rows[0])
            throw {
              status: 409,
              message: "Username taken",
            };

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  // search
  static search(query) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const q = `${query}%`

          const { rows } = await pool.query(`
            SELECT 
            bpLogin.UserId,
            bpLogin.LoginUsername,
            bpUser.UserFirstName,
            bpUser.UserLastName
            FROM bpLogin 
            INNER JOIN bpUser 
            ON bpLogin.UserId = bpUser.UserId
            WHERE bpLogin.LoginUsername LIKE $1
            AND bpUser.UserIsDisabled = false;
          `, [q]);

          if (!rows.length < 0)
            throw {
              status: 500,
              message: "Something went wrong in the DB",
            };

          const users = [];
          
          if (rows.length > 0) {
            rows.forEach((record) => {
              users.push(
                new User({
                  id: record.userid,
                  username: record.loginusername,
                  firstName: record.userfirstname,
                  lastName: record.userlastname,
                })
              );
            });
          }

          resolve(users);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  // create
  static create(reqBody) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const hash = await bcrypt.hash(reqBody.password, 10);
          if (!hash) {
            throw {
              status: 500,
              message: "Something went wrong",
            };
          } else {
            reqBody.password = hash;
          }

          const { rows: newUserId } = await pool.query(`
              INSERT INTO bpUser (UserFirstName, UserLastName, UserIsDisabled, CurrencyId) 
              VALUES ($1, $2, $3, $4) RETURNING UserId;`, 
              [reqBody.firstName,
                reqBody.lastName,
                false,
                reqBody.currency]
            );
      
          const userId = newUserId[0].userid

          await pool.query(
              `INSERT INTO bpLogin (LoginUsername, LoginPassword, UserId)
              VALUES ($1, $2, $3);`,
              [reqBody.username,
                reqBody.password, 
                userId]
            );

          const { rows } = await pool.query(
            `SELECT bpUser.UserId, 
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
            WHERE bpUser.UserId = $1;`, [userId])

          if (!rows[0])
            throw {
              status: 500,
              message: "Failed to save User to database.",
            };

          const record = rows[0];
          const user = {
            id: record.userid,
            username: record.loginusername,
            firstName: record.userfirstname,
            lastName: record.userlastname,
            currency: {
              id: record.currencyid,
              name: record.currencyname,
              code: record.currencycode,
              symbol: record.currencysymbol,
            },
          };

          resolve(new User(user));
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  // readById
  static readById(userId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
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
              WHERE bpUser.UserId = $1
              AND bpUser.UserIsDisabled = false; 
          `, [userId]);

          if (!rows[0] || rows[0].userisdisabled)
            throw {
              status: 404,
              message: "User not found",
            };

          const record = rows[0];
          const user = {
            id: record.userid,
            username: record.loginusername,
            firstName: record.userfirstname,
            lastName: record.userlastname,
            currency: {
              id: record.currencyid,
              name: record.currencyname,
              code: record.currencycode,
              symbol: record.currencysymbol,
            },
          };

          resolve(new User(user));
        } catch (err) {
          console.log(err);
          reject(err);
        }
        // sql.close();
      })();
    });
  }

  // readByUsername
  static readByUsername(username) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
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
            WHERE bpLogin.LoginUsername = $1
            AND bpUser.UserIsDisabled = false; 
          `, [username]);

          if (!rows[0] || rows[0].userisdisabled)
            throw {
              status: 404,
              message: "User not found",
            };

          const record = rows[0];
          const user = {
            id: record.userid,
            username: record.loginusername,
            firstName: record.userfirstname,
            lastName: record.userlastname,
            currency: {
              id: record.currencyid,
              name: record.currencyname,
              code: record.currencycode,
              symbol: record.currencysymbol,
            },
          };

          resolve(new User(user));
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  // update
  update(reqBody, currencyObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if (reqBody.password) {
            const newPassword = await bcrypt.hash(reqBody.password, 10);
            if (!newPassword)
              throw {
                status: 500,
                message: "Something went wrong",
              };

            await pool.query(
                `UPDATE bpLogin SET LoginPassword = $2 WHERE UserId = $1;`,
                [this.id, newPassword]
              );
          }

          if (reqBody.username !== this.username) {
            await pool.query(
                `UPDATE bpLogin SET LoginUsername = $2 WHERE UserId = $1;`,
                [this.id, reqBody.username]
              );

            this.username = reqBody.username;
          }

          if (currencyObj) {
            await pool.query(
                `UPDATE bpUser SET CurrencyId = $1 WHERE UserId = $2;`,
                [currencyObj.id, this.id]
              );

            this.currency = currencyObj;
          }

          await pool.query(
              `UPDATE bpUser SET UserFirstName = $2, UserLastName = $3 WHERE UserId = $1;`,
              [this.id, reqBody.firstName, reqBody.lastName]
            );

          this.firstName = reqBody.firstName;
          this.lastName = reqBody.lastName;

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
          await pool.query(`
              UPDATE bpUser
              SET UserIsDisabled = true
              WHERE UserId = $1;
          `, [userId]);

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }
}

module.exports = User;
