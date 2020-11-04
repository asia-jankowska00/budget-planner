const connection = require("../config/connection");
const sql = require("mssql");

class Transaction {
  constructor(transaction) {
    this.id = transaction.id;
    this.name = transaction.name;
    this.amount = transaction.amount;
    this.isExpense = transaction.isExpense;
    this.date = transaction.date;

    if (transaction.note) this.note = transaction.note;

    this.user = {};
    this.user.id = transaction.user.id;
    this.user.firstName = transaction.user.firstName;
    this.user.lastName = transaction.user.lastName;
    this.user.username = transaction.user.username;

    if (transaction.source) {
      this.source = {};
      this.source.id = transaction.source.id;
      this.source.name = transaction.source.name;

      if (transaction.source.currency) {
        this.currency = {};
        this.currency.id = transaction.source.currency.id;
        this.currency.name = transaction.source.currency.name;
        this.currency.code = transaction.source.currency.code;
        this.currency.symbol = transaction.source.currency.symbol;
      }
    }

    if (transaction.container){
      this.container = {};
      this.container.id = transaction.container.id;
      this.container.name = transaction.container.name;

      if(transaction.container.category){
        this.category = {};
        this.category.id = transaction.container.category.id;
        this.category.name = transaction.container.category.name;
      }
    }

    //category to be added for container context
  }

  static create(transactionObj, user) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool.request()
            .input('TransactionName', sql.NVarChar, transactionObj.name)
            .input('TransactionDate', sql.Date, transactionObj.date)
            .input('TransactionAmount', sql.Money, transactionObj.amount)
            .input('TransactionIsExpense', sql.Bit, transactionObj.isExpense)
            .input('TransactionNote', sql.NVarChar, transactionObj.note)
            .input('UserId', sql.Int, user.id)
            .input('ContainerId', sql.Int, transactionObj.containerId)
            .input('SourceId', sql.Int, transactionObj.sourceId)
            .input('CategoryId', sql.Int, transactionObj.categoryId)
            .query(`
            INSERT INTO bpTransaction (TransactionName, TransactionDate, TransactionAmount, TransactionIsExpense, TransactionNote, UserId, SourceId)
            VALUES (@TransactionName, @TransactionDate, @TransactionAmount, @TransactionIsExpense, @TransactionNote, @UserId, @SourceId)

            INSERT INTO bpContainerTransaction (ContainerId, TransactionId, CategoryId)
            VALUES (@ContainerId, IDENT_CURRENT('bpTransaction'), @CategoryId);

            IF @TransactionIsExpense = 1
              UPDATE bpSource 
              SET SourceAmount = (SELECT SourceAmount FROM bpSource WHERE SourceId = @SourceId) - @TransactionAmount
              WHERE SourceId = @SourceId;
            ELSE
              UPDATE bpSource 
              SET SourceAmount = (SELECT SourceAmount FROM bpSource WHERE SourceId = @SourceId) + @TransactionAmount
              WHERE SourceId = @SourceId;

            SELECT bpTransaction.TransactionId, TransactionName, TransactionDate, TransactionAmount, TransactionIsExpense, TransactionNote, bpTransaction.UserId, ContainerId, bpTransaction.SourceId, SourceName, CategoryId
            FROM bpTransaction
            INNER JOIN bpContainerTransaction
            ON bpTransaction.TransactionId = bpContainerTransaction.TransactionId
            INNER JOIN bpSource
            ON bpTransaction.SourceId = bpSource.SourceId
            WHERE bpTransaction.TransactionId = IDENT_CURRENT('bpTransaction')
          `)

          if (!result.recordset[0])
            throw {
              status: 500,
              message: 'Failed to save Transaction to database'
            };

          const record = result.recordset[0];

          const newTransaction = new Transaction({
            id: record.TransactionId,
            name: record.TransactionName,
            date: record.TransactionDate,
            amount: record.TransactionAmount,
            isExpense: record.TransactionIsExpense,
            note: record.TransactionNote,
            user: {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName
            },
            source: {
              id: record.SourceId,
              name: record.SourceName
            },
            category: record.CategoryId
          })

          resolve(newTransaction);

        } catch (err) {
          console.log(err);
          reject(err);
        }
        //sql.close();
      })()
    })
  }

  static getTransactionSource(transactionId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("TransactionId", sql.Int, transactionId).query(`
              SELECT SourceId
              FROM bpTransaction
              AND TransactionId = @TransactionId
            `);

          if (result.recordset.length <= 0)
            throw { status: 404, message: "No transactions found" };

          if (result.recordset.length > 1)
            throw { status: 500, message: "Something is wrong in the DB" };

          const record = result.recordset[0];

          resolve(record.SourceId)
        } catch (err) {
          console.log(err);
          reject(err);
        }
        // sql.close();
      })();
    });
  }

  static getAllSourceTransactions(sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("SourceId", sql.Int, sourceId).query(`
              SELECT
              TransactionId, TransactionName, TransactionDate, 
              TransactionAmount, TransactionIsExpense, TransactionNote,  
              bpTransaction.UserId, UserFirstName, UserLastName, LoginUsername
              FROM bpTransaction
              INNER JOIN bpSource
              ON bpTransaction.SourceId = bpSource.SourceId
              INNER JOIN bpUser
              ON bpTransaction.UserId = bpUser.UserId
              INNER JOIN bpLogin
              ON bpTransaction.UserId = bpLogin.UserId 
              WHERE bpTransaction.SourceId = @SourceId 
              ORDER BY TransactionDate DESC
            `);

          if (result.recordset.length < 0)
            throw { status: 404, message: "No transactions found" };

          const transactions = [];
          if (result.recordset.length > 1) {
            result.recordset.forEach((record) => {
              const transactionObj = {
                id: record.TransactionId,
                name: record.TransactionName,
                amount: record.TransactionAmount,
                isExpense: record.TransactionIsExpense,
                date: record.TransactionDate,
                note: record.TransactionNote,
                user: {
                  id: record.UserId,
                  username: record.LoginUsername,
                  firstName: record.UserFirstName,
                  lastName: record.UserLastName
                }
              }

              transactions.push(new Transaction(transactionObj));
            });
          }

          resolve(transactions);
        } catch (err) {
          console.log(err);
          reject(err);
        }
        // sql.close();
      })();
    });
  }

  static getSourceTransaction(sourceId, transactionId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("SourceId", sql.Int, sourceId)
            .input("TransactionId", sql.Int, transactionId).query(`
              SELECT
              TransactionId, TransactionName, TransactionDate, 
              TransactionAmount, TransactionIsExpense, TransactionNote,  
              bpTransaction.UserId, UserFirstName, UserLastName, LoginUsername
              FROM bpTransaction
              INNER JOIN bpSource
              ON bpTransaction.SourceId = bpSource.SourceId
              INNER JOIN bpUser
              ON bpTransaction.UserId = bpUser.UserId
              INNER JOIN bpLogin
              ON bpTransaction.UserId = bpLogin.UserId 
              WHERE bpTransaction.SourceId = @SourceId 
              AND bpTransaction.TransactionId = @TransactionId
            `);

          if (result.recordset.length <= 0)
            throw { status: 404, message: "Transaction not found" };

          if (result.recordset.length > 1)
            throw { status: 500, message: "Something is wrong in the DB" };

          const record = result.recordset[0];

          resolve(new Transaction({
            id: record.TransactionId,
            name: record.TransactionName,
            amount: record.TransactionAmount,
            isExpense: record.TransactionIsExpense,
            date: record.TransactionDate,
            note: record.TransactionNote,
            user: {
              id: record.UserId,
              username: record.LoginUsername,
              firstName: record.UserFirstName,
              lastName: record.UserLastName
            }
          }))
        } catch (err) {
          console.log(err);
          reject(err);
        }
        // sql.close();
      })();
    });
  }

  static getAllContainerTransactions(containerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool.request()
            .input('ContainerId', sql.Int, containerId)
            .query(`
          SELECT
          bpTransaction.TransactionId,
          TransactionName,
          TransactionDate,
          TransactionAmount,
          TransactionIsExpense,
          TransactionNote,
          bpTransaction.SourceId,
          bpTransaction.UserId,
          SourceName,
          UserFirstName, UserLastName, LoginUsername
          FROM bpTransaction
          INNER JOIN bpContainerTransaction
          ON bpContainerTransaction.TransactionId = bpTransaction.TransactionId
          INNER JOIN bpSource
          ON bpSource.SourceId = bpTransaction.SourceId
          INNER JOIN bpUser
          ON bpTransaction.UserId = bpUser.UserId
          INNER JOIN bpLogin
          ON bpTransaction.UserId = bpLogin.UserId 
          WHERE bpContainerTransaction.ContainerId = @ContainerId
          ORDER BY TransactionDate DESC
          `);

          if (result.recordset < 0)
            throw { status: 404, message: "No transactions found." };

          const transactions = [];
          if (result.recordset.length > 0) {
            result.recordset.forEach((record) => {
              const transactionObj = {
                id: record.TransactionId,
                name: record.TransactionName,
                amount: record.TransactionAmount,
                isExpense: record.TransactionIsExpense,
                date: record.TransactionDate,
                note: record.TransactionNote,
                user: {
                  id: record.UserId,
                  username: record.LoginUsername,
                  firstName: record.UserFirstName,
                  lastName: record.UserLastName
                },
                source: {
                  id: record.SourceId,
                  name: record.SourceName
                }
              }

              transactions.push(new Transaction(transactionObj))
            })
          }
          resolve(transactions);
        } catch (err) {
          console.log(err);
          reject(err);
        }
        // sql.close();
      })();
    });
  }

  static getContainerTransaction(containerId, transactionId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool.request()
            .input('ContainerId', sql.Int, containerId)
            .input('TransactionId', sql.Int, transactionId)
            .query(`
          SELECT
          bpTransaction.TransactionId,
          TransactionName,
          TransactionDate,
          TransactionAmount,
          TransactionIsExpense,
          TransactionNote,
          bpTransaction.SourceId,
          bpTransaction.UserId,
          SourceName,
          UserFirstName, UserLastName, LoginUsername
          FROM bpTransaction
          INNER JOIN bpContainerTransaction
          ON bpContainerTransaction.TransactionId = bpTransaction.TransactionId
          INNER JOIN bpSource
          ON bpSource.SourceId = bpTransaction.SourceId
          INNER JOIN bpUser
          ON bpTransaction.UserId = bpUser.UserId
          INNER JOIN bpLogin
          ON bpTransaction.UserId = bpLogin.UserId 
          WHERE bpContainerTransaction.ContainerId = @ContainerId
          AND bpTransaction.TransactionId = @TransactionId;
          `);

          if (result.recordset.length <= 0)
            throw { status: 404, message: "Transaction not found" };

          if (result.recordset.length > 1)
            throw { status: 500, message: "Something is wrong in the DB" };

          const record = result.recordset[0];
          const transaction = new Transaction({
            id: record.TransactionId,
            name: record.TransactionName,
            amount: record.TransactionAmount,
            isExpense: record.TransactionIsExpense,
            date: record.TransactionDate,
            note: record.TransactionNote,
            user: {
              id: record.UserId,
              username: record.LoginUsername,
              firstName: record.UserFirstName,
              lastName: record.UserLastName
            },
            source: {
              id: record.SourceId,
              name: record.SourceName
            }
          })

          resolve(transaction)

          resolve(transaction);
        } catch (err) {
          console.log(err);
          reject(err);
        }

        // sql.close();
      })();
    });
  }

  static deleteFromSource(transactionId, sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          const result = await pool.request()
            .input('TransactionId', sql.Int, transactionId)
            .input('SourceId', sql.Int, sourceId)
            .query(`
            DELETE FROM bpContainerTransaction
            WHERE TransactionId = @TransactionId;

            UPDATE bpSource 
            SET bpSource.SourceAmount = CASE 
                    WHEN bpTransaction.TransactionIsExpense = 1 THEN (SELECT SourceAmount FROM bpSource WHERE SourceId = @SourceId) + bpTransaction.TransactionAmount
                    ELSE (SELECT SourceAmount FROM bpSource WHERE SourceId = @SourceId) - bpTransaction.TransactionAmount
                  END
            FROM bpSource
            INNER JOIN bpTransaction
              ON bpSource.SourceId = bpTransaction.SourceId
            WHERE bpTransaction.SourceId = @SourceId;

            DELETE FROM bpNotification
            WHERE TransactionId = @TransactionId;
  
            DELETE FROM bpTransaction
            WHERE TransactionId = @TransactionId;
          `)
          //   .query(`
          //   DELETE FROM bpContainerTransaction
          //   WHERE TransactionId = @TransactionId;

          //   SELECT bpTransaction.TransactionIsExpense,
          //   CASE
          //   WHEN bpTransaction.TransactionIsExpense = 1 THEN
          //     UPDATE bpSource 
          //     SET SourceAmount = (SELECT SourceAmount FROM bpSource WHERE SourceId = @SourceId) + bpTransaction.TransactionAmount
          //     FROM bpSource
          //     INNER JOIN bpTransaction
          //     ON bpTransaction.SourceId = @SourceId
          //     WHERE bpSource.TransactionId = @TransactionId
          //   ELSE
          //     UPDATE bpSource 
          //     SET SourceAmount = (SELECT SourceAmount FROM bpSource WHERE SourceId = @SourceId) - bpTransaction.TransactionAmount
          //     FROM bpSource
          //     INNER JOIN bpTransaction
          //     ON bpTransaction.SourceId = @SourceId
          //     WHERE bpSource.TransactionId = @TransactionId
          //   END AS NewField
          //   FROM bpTransaction 
          //   WHERE TransactionId = @TransactionId;

          //   DELETE FROM bpNotification
          //   WHERE TransactionId = @TransactionId;

          //   DELETE FROM bpTransaction
          //   WHERE TransactionId = @TransactionId;
          // `)

          resolve();

        } catch (err) {
          console.log(err);
          reject(err);
        }
        //sql.close();
      })()
    })
  }

  static deleteFromContainer(transactionId, containerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool.request()
            .input('TransactionId', sql.Int, transactionId)
            .input('ContainerId', sql.Int, containerId)
            .query(`
            DELETE FROM bpContainerTransaction
            WHERE TransactionId = @TransactionId AND ContainerId = @ContainerId;
          `)

          resolve();

        } catch (err) {
          console.log(err);
          reject(err);
        }
        //sql.close();
      })()
    })
  }
}

module.exports = Transaction;
