var SequelizeTokenify = require('sequelize-tokenify');


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userRecoveryToken: {
      type: DataTypes.STRING,
      unique: true
    },
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    underscored: true
  });
  // For token field
 SequelizeTokenify.tokenify(User, {
     field: 'userRecoveryToken'
 });

  User.associate = function(models) {
    // associations can be defined here
    //User.hasMany(models.recoveryToken)
    User.hasMany(models.Receipt)
    User.hasMany(models.Item)
    //User.hasMany(models.Invoice)
  };

  return User;
};
