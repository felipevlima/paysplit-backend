module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoices', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    receipt_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
  },
   created_at: {
    type: DataTypes.DATE
  },
   updated_at: DataTypes.DATE
 }, {
    underscored: true
  })

  Invoice.associate = function(models) {
    // associations can be defined here
    Invoice.belongsTo(models.User)
  };
  return Invoice;
};
