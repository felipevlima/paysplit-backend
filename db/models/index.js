const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
// const config = require(__dirname + '/../config/config.js')[env];


let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env.HEROKU_POSTGRESQL_BLUE_URL, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {
  User: sequelize.import('./user.js'),
  Receipt: sequelize.import('./receipt.js'),
  Item: sequelize.import('./item.js'),
  Invoice: sequelize.import('./invoice.js'),
  recoveryToken: sequelize.import('./recoverytoken.js'),
};

// Object.keys(db).forEach((key) => {
//   if ('associate' in db[key]) {
//     db[key].associate(db);
//   }
// });

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
