module.exports = (sequelize, DataTypes) => {
  const RecoveryToken = sequelize.define('recoveryToken', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    token: DataTypes.STRING,
    rejectedAt: DataTypes.DATE,
  }, {
    timestamps: true,
  });

  RecoveryToken.associate = (models) => {
    // associations can be defined here
    RecoveryToken.belongsTo(models.User);
  };

  return RecoveryToken;
};
