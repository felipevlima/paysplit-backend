'use strict';
module.exports = (sequelize, DataTypes) => {
  const Receipt = sequelize.define('Receipt', {
    totalPrice: DataTypes.STRING,
    location: DataTypes.STRING
  }, {});
  Receipt.associate = function(models) {
    // associations can be defined here
    //Receipt.hasMany(models.User, {as: 'User', foreignKey: 'userId'})
    Receipt.hasMany(models.Item, {as: 'Item', foreignKey: 'user._id'})
  };
  return Receipt;
};
