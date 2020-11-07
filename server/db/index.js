const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    port: process.env.PORT,
  });
module.exports = {
  query: (text, params) => pool.query(text, params),
};