'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Items', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    receipt_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    itemName: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    createdAt: {
      type: DataTypes.DATE
    },
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    underscored: true
  });
  Item.associate = function(models) {
    // associations can be defined here
    //Item.belongsTo(models.Users, {foreignKey: 'userId'})
    Item.belongsTo(models.Receipt, {
    foreignKey: 'receipt_id'
   })
  };
  return Item;
};
