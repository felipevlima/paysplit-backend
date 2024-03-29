const { Receipt, Invoice } = require('../models');

module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Items', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    receipt_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Receipt,
        key: 'id',
      },
    },
    invoice_id: {
      type: DataTypes.UUID,
      references: {
        model: Invoice,
        key: 'id',
      },
    },
    product: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  }, {
    timestamps: true,
  });

  Item.associate = (models) => {
    // associations can be defined here
    Item.belongsTo(models.Receipt, { foreignKey: 'receipt_id' });
    Item.belongsTo(models.Invoice, { foreignKey: 'invoice_id' });
  };

  return Item;
};
