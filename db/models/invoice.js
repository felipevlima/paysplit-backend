module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoices', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    receipt_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    recipient: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  }, {
    timestamps: true,
  });

  Invoice.associate = (models) => {
    // associations can be defined here
    Invoice.belongsTo(models.Item);
  };
  
  return Invoice;
};
