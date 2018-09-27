'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Receipt, {as: 'Receipt', foreignKey: 'userId'})
    User.hasMany(models.Item, {as: 'Item', foreignKey:'userId'})
  };
  return User;
};
