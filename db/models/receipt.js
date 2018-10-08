'use strict';
module.exports = (sequelize, DataTypes) => {
  const Receipt = sequelize.define('Receipt', {
    merchant: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
    type: DataTypes.DECIMAL,
    allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING
    },
    userToken: {
      type: DataTypes.STRING,
      allowNull: false
    }

  }, {});
  Receipt.associate = function(models) {
    // associations can be defined here
    Receipt.belongsTo(models.User, {foreignKey: 'user.Id'})
    //Receipt.hasMany(models.Item, {as: 'Item', foreignKey: 'user._id'})
  };
  return Receipt;
};
