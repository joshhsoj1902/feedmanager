'use strict';
module.exports = function(sequelize, DataTypes) {
  var Log = sequelize.define('Log', {
    message: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Log;
};