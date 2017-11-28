'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    lasname: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    phone: DataTypes.STRING,
    about: DataTypes.TEXT,
    address: DataTypes.STRING,
    avatar: DataTypes.STRING,
    status: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return user;
};