const pool = require("../db");

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
          const { rows: transactionId } = await pool.query(`
            INSERT INTO bpTransaction 
            (TransactionName, TransactionDate, TransactionAmount, TransactionIsExpense, TransactionNote, UserId, SourceId)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING TransactionId;
          `, [transactionObj.name, transactionObj.date, transactionObj.amount, 
            transactionObj.isExpense, transactionObj.note, user.id, transactionObj.sourceId])

          const TransactionId = transactionId[0].transactionid;

          await pool.query(`
            INSERT INTO bpContainerTransaction (ContainerId, TransactionId, CategoryId)
            VALUES ($1, $2, $3);
          `, [transactionObj.containerId, TransactionId, transactionObj.categoryId])

          await pool.query(`
            UPDATE bpSource 
            SET SourceAmount = CASE 
              WHEN $1 = true THEN (SELECT SourceAmount FROM bpSource WHERE SourceId = $2) + $3
              ELSE (SELECT SourceAmount FROM bpSource WHERE SourceId = $2) - $3
              END
            FROM bpTransaction
              WHERE bpTransaction.SourceId = $2;
          `, [transactionObj.isExpense, transactionObj.sourceId, transactionObj.amount])

          const { rows } = await pool.query(`
            SELECT 
            bpTransaction.TransactionId, TransactionName, TransactionDate, TransactionAmount, TransactionIsExpense, TransactionNote, 
            bpTransaction.UserId, ContainerId, bpTransaction.SourceId, SourceName, CategoryId
            FROM bpTransaction
            INNER JOIN bpContainerTransaction
            ON bpTransaction.TransactionId = bpContainerTransaction.TransactionId
            INNER JOIN bpSource
            ON bpTransaction.SourceId = bpSource.SourceId
            WHERE bpTransaction.TransactionId = $1;
          `, [TransactionId])

          if (!rows[0])
            throw {
              status: 500,
              message: 'Failed to save Transaction to database'
            };

          const record = rows[0];
 
          const newTransaction = new Transaction({
            id: record.transactionid,
            name: record.transactionname,
            amount: record.transactionamount,
            isExpense: record.transactionisexpense,
            date: record.transactiondate,
            note: record.transactionnote,
            user: {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName
            },
            source: {
              id: record.sourceid,
              name: record.sourcename
            },
            category: record.categoryid
          })

          resolve(newTransaction);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })()
    })
  }

  static getTransactionSource(transactionId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
            SELECT SourceId
            FROM bpTransaction
            WHERE TransactionId = $1
          `, [transactionId]);

          if (rows.length <= 0)
            throw { status: 404, message: "No transactions found" };

          if (rows.length > 1)
            throw { status: 500, message: "Something is wrong in the DB" };

          const record = rows[0];

          resolve(record.sourceid)
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  static getAllSourceTransactions(sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
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
            WHERE bpTransaction.SourceId = $1 
            ORDER BY TransactionDate DESC;
          `, [sourceId]);

          if (rows.length < 0)
            throw { status: 404, message: "No transactions found" };

          const transactions = [];
          if (rows.length > 1) {
            rows.forEach((record) => {
              const transactionObj = {
                id: record.transactionid,
                name: record.transactionname,
                amount: record.transactionamount,
                isExpense: record.transactionisexpense,
                date: record.transactiondate,
                note: record.transactionnote,
                user: {
                  id: record.userid,
                  username: record.loginusername,
                  firstName: record.userfirstname,
                  lastName: record.userlastname
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
      })();
    });
  }

  static getSourceTransaction(sourceId, transactionId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
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
            WHERE bpTransaction.SourceId = $1 
            AND bpTransaction.TransactionId = $2;
          `, [sourceId, transactionId]);

          if (rows.length <= 0)
            throw { status: 404, message: "Transaction not found" };

          if (rows.length > 1)
            throw { status: 500, message: "Something is wrong in the DB" };

          const record = rows[0];

          resolve(new Transaction({
            id: record.transactionid,
            name: record.transactionname,
            amount: record.transactionamount,
            isExpense: record.transactionisexpense,
            date: record.transactiondate,
            note: record.transactionnote,
            user: {
              id: record.userid,
              username: record.loginusername,
              firstName: record.userfirstname,
              lastName: record.userlastname
            }
          }))
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  static getAllContainerTransactions(containerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
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
            WHERE bpContainerTransaction.ContainerId = $1
            ORDER BY TransactionDate DESC;
          `, [containerId]);

          if (rows.length < 0)
            throw { status: 404, message: "No transactions found." };

 

          const transactions = [];
          if (rows.length > 0) {
            rows.forEach((record) => {
              const transactionObj = {
                id: record.transactionid,
                name: record.transactionname,
                amount: record.transactionamount,
                isExpense: record.transactionisexpense,
                date: record.transactiondate,
                note: record.transactionnote,
                user: {
                  id: record.userid,
                  username: record.loginusername,
                  firstName: record.userfirstname,
                  lastName: record.userlastname
                },
                source: {
                  id: record.sourceid,
                  name: record.sourcename
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
      })();
    });
  }

  static getContainerTransaction(containerId, transactionId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
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
            WHERE bpContainerTransaction.ContainerId = $1
            AND bpTransaction.TransactionId = $2;
          `, [containerId, transactionId]);

          if (rows.length <= 0)
            throw { status: 404, message: "Transaction not found" };

          if (rows.length > 1)
            throw { status: 500, message: "Something is wrong in the DB" };

          const record = rows[0];
          const transaction = new Transaction({
            id: record.transactionid,
            name: record.transactionname,
            amount: record.transactionamount,
            isExpense: record.transactionisexpense,
            date: record.transactiondate,
            note: record.transactionnote,
            user: {
              id: record.userid,
              username: record.loginusername,
              firstName: record.userfirstname,
              lastName: record.userlastname
            },
            source: {
              id: record.sourceid,
              name: record.sourcename
            }
          })

          resolve(transaction);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  update(transactionObj, owner) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const keys = Object.keys(transactionObj);

          // ADD SOURCE AMOUNT UPDATING LOGIC

          keys.forEach((key) => {
            this[key] = transactionObj[key];
          });

          const { rows } = await pool.query(`
            UPDATE bpTransaction
            SET TransactionName = $2, 
            TransactionDate = $3,
            TransactionAmount = $4,
            TransactionIsExpense = $5,
            TransactionNote = $6
            WHERE TransactionId = $1 AND UserId = $7
            RETURNING TransactionId;
          `, [this.id, this.name, this.date, this.amount, this.isExpense, this.note, owner.id]);

          await pool.query(`
            UPDATE bpSource 
            SET SourceAmount = CASE 
              WHEN $1 = true THEN (SELECT SourceAmount FROM bpSource WHERE SourceId = $2) + $3
              ELSE (SELECT SourceAmount FROM bpSource WHERE SourceId = $2) - $3
              END
            FROM bpTransaction
              WHERE bpTransaction.SourceId = $2;
        `, [this.isExpense, this.sourceId, this.amount])

          if (!rows[0]) {
            throw {
              status: 500,
              message: "Failed to update transaction",
            };
          }

          if (rows.length != 1) {
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

  static deleteFromSource(transactionId, sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await pool.query(`
            DELETE FROM bpContainerTransaction
            WHERE TransactionId = $1;
          `, [transactionId])

          await pool.query(`
            UPDATE bpSource 
            SET SourceAmount = CASE 
              WHEN bpTransaction.TransactionIsExpense = true THEN (SELECT SourceAmount FROM bpSource WHERE SourceId = $1) + bpTransaction.TransactionAmount
              ELSE (SELECT SourceAmount FROM bpSource WHERE SourceId = $1) - bpTransaction.TransactionAmount
              END
            FROM bpTransaction
              WHERE bpTransaction.SourceId = $1;
          `, [sourceId])

          await pool.query(`
            DELETE FROM bpNotification
            WHERE TransactionId = $1;
          `, [transactionId])

          await pool.query(`
            DELETE FROM bpTransaction
            WHERE TransactionId = $1;
          `, [transactionId])

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })()
    })
  }

  static deleteFromContainer(transactionId, containerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await pool.query(`
            DELETE FROM bpContainerTransaction
            WHERE TransactionId = $1 AND ContainerId = $2;
          `, [transactionId, containerId])

          const { rows } = await pool.query(`
            SELECT * FROM bpContainerTransaction
            WHERE TransactionId = $1 AND ContainerId = $2;
          `, [transactionId, containerId])

          if (rows[0]) throw { message: "Failed to delete" }

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })()
    })
  }
}

module.exports = Transaction;
