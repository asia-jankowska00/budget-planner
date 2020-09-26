const connectionString = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  database: process.env.DATABASE,
  pool: {
    idleTimeoutMillis: 30000,
  },
};

module.exports = connectionString;
