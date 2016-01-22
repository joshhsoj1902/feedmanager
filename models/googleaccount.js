'use strict';
module.exports = function(sequelize, DataTypes) {
  var googleAccount = sequelize.define('GoogleAccount', {
    profileId: DataTypes.STRING,
    token: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    account_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "Users",
            key: "id"
        }
      }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return googleAccount;
};