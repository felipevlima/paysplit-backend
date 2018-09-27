'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    itemName: DataTypes.STRING,
    price: DataTypes.STRING
  }, {});
  Item.associate = function(models) {
    // associations can be defined here
    //Item.belongsTo(models.Users)
    //Item.belongsTo(models.Receipt)
  };
  return Item;
};
