const connection = require("../config/connection");
const sql = require("mssql");

class Transaction{
  constructor(transaction) {
    this.id = transaction.id;
    this.name = transaction.name
    this.amount = transaction.amount
    this.isExpense = transaction.isExpense
    this.date = transaction.date

    if (transaction.note) this.note = transaction.note

    this.user = {};
    this.user.id = transaction.user.id;
    this.user.firstName = transaction.user.firstName;
    this.user.lastName = transaction.user.lastName;
    this.user.username = transaction.user.username;
    
    if (transaction.source) {
      this.source = {}
      this.source.id = transaction.source.id
      this.source.name = transaction.source.name
    }

    //category to be added for container context
  }

  static create(transaction, user) {
  
  }

  static getAllSourceTransactions(sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool.request()
            .input("SourceId", sql.Int, sourceId)
            .query(`
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
        sql.close();
      })();
    });
  }

  static getSourceTransaction(sourceId, transactionId) {

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
          `)

          if (result.recordset < 0)
          throw {status: 404 , message: 'No transactions found.'}

          const transactions = [];
          if(result.recordset.length > 1){
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
        sql.close();
      })()
    })
  }

  static getContainerTransaction(containerId, transactionId) {
    return new Promise ((resolve, reject) => {
      (async ()=>{
        try {
          const pool = await sql.connect(connection);
          const result = await pool.request()
          .input('ContainerId', sql.Int, containerId)
          .input('TransactionId', sql.Int, transactionId)
          .query(`
          
          `)

          if (!result.recordset[0]) { throw {status: 500, message: "Failed to get category"}}

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
              }
          })

          resolve(transaction)

        } catch (err) {
          console.log(err);
          reject(err);
        }

      sql.close();
      })()
    })
  }
}

module.exports = Transaction
