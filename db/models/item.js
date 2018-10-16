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
    invoice_id: {
      type: DataTypes.UUID,
    },
    product: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  }, {
    underscored: true
  });
  Item.associate = function(models) {
    // associations can be defined here
    Item.belongsTo(models.Receipt, {foreignKey: 'receipt_id'})
    //Item.belongsTo(models.Invoice)

  };
  return Item;
};
