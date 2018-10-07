var SequelizeTokenify = require('sequelize-tokenify');


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
    }
  }, {});
  // For token field
 SequelizeTokenify.tokenify(User, {
     field: 'userRecoveryToken'
 });

 // For recovery_token field
 SequelizeTokenify.tokenify(User, {
     field: 'userRecoveryToken'
 });
  User.associate = function(models) {
    // associations can be defined here
    //TODO: test receipt association from the client side
    User.hasMany(models.Receipt, {as: 'Receipt', foreignKey: 'userId'})
    User.hasMany(models.Item, {as: 'Item', foreignKey:'userId'})
  };

  return User;
};
