'use strict';
module.exports = function(sequelize, DataTypes) {
  var wall = sequelize.define('wall', {
    name: DataTypes.STRING,
    text: DataTypes.TEXT,
    autor_id: DataTypes.INTEGER,
    date: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return wall;
};