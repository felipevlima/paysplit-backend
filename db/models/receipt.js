'use strict';
module.exports = (sequelize, DataTypes) => {
  const Receipt = sequelize.define('Receipt', {
    totalPrice: DataTypes.STRING,
    location: DataTypes.STRING
  }, {});
  Receipt.associate = function(models) {
    // associations can be defined here
  };
  return Receipt;
};