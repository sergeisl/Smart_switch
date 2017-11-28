'use strict';
module.exports = function(sequelize, DataTypes) {
  var device = sequelize.define('device', {
    id_device: DataTypes.STRING,
    name: DataTypes.STRING,
    token: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    autor_id: DataTypes.INTEGER,
    pin: DataTypes.INTEGER,
    column: DataTypes.INTEGER,
    row: DataTypes.INTEGER,
    text: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return device;
};