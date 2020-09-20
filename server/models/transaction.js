const connection = require("../config/connection");
const sql = require("mssql");

class Transaction{
  constructor(transaction) {
    this.id = transaction.id;
    this.name = transaction.name
    this.amount = transaction.amount
    this.isExpense = transaction.isExpense

    if (transaction.note) this.note = transaction.note
    if (transaction.date) this.date = transaction.date

    this.owner = {};
    this.owner.id = transaction.owner.id;
    this.owner.firstName = transaction.owner.firstName;
    this.owner.lastName = transaction.owner.lastName;
    this.owner.username = transaction.owner.username;
    
    this.source = {}
    this.source.id = transaction.source.id
    this.source.name = transaction.source.name

    //category to be added
  }

  static create(transaction, user) {
  
  }

  static getAllSourceTransactions(sourceId) {

  }

  static getSourceTransaction(sourceId, transactionId) {

  }

  static getAllContainerTransactions(containerId) {

  }

  static getContainerTransaction(containerId, transactionId) {
    
  }
}

module.exports = Transaction
