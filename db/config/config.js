

module.exports = {
  development: {
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    host: process.env.DBHOST,
    dialect: 'postgres',
  },
  test: {
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    host: process.env.DBHOST,
    dialect: 'postgres',
  },
  production: {
    use_env_variable: process.env.HEROKU_POSTGRESQL_BLUE_URL,
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    host: process.env.DBHOST,
    dialect: 'postgres',
  },
};
