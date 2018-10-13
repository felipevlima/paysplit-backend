'use strict';
module.exports = (sequelize, DataTypes) => {
  const Receipt = sequelize.define('Receipt', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
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
    },
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE

  }, {
    underscored: true
  });
  Receipt.associate = function(models) {
    // associations can be defined here
    Receipt.belongsTo(models.User, {
    foreignKey: 'user_id'
   })
    Receipt.hasMany(models.Item)
  };
  return Receipt;
};
