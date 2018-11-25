const { Receipt } = require('./receipt');

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
      references: {
        model: Receipt,
        key: 'id',
      },
    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
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
    Invoice.hasMany(models.Item, { foreignKey: 'id' });
  };

  return Invoice;
};
