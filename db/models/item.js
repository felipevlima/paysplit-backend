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
    },
    invoice_id: {
      type: DataTypes.UUID,
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
  };

  return Item;
};
