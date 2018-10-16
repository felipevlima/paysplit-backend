module.exports = (sequelize, DataTypes) => {
  const recoveryToken = sequelize.define('recoveryToken', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    token: DataTypes.STRING,
    rejectedAt: DataTypes.DATE
  }, {});
  recoveryToken.associate = function(models) {
    // associations can be defined here
    recoveryToken.belongsTo(models.User)
  };
  return recoveryToken;
};
