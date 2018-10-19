require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: 'checkplease',
    host: process.env.DBHOST,
    dialect: 'postgres',
  },
  test: {
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: 'checkplease',
    host: process.env.DBHOST,
    dialect: 'postgres',
  },
  production: {
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: 'checkplease',
    host: process.env.DBHOST,
    dialect: 'postgres',
  },
};