'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      
      //queryInterface.renameTable('googleAccounts', 'GoogleAccounts')
      //queryInterface.renameTable('Users', 'User')
      
      //queryInterface.renameColumn('Users', 'url_key', 'urlKey')
      
      
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
      //queryInterface.renameTable('GoogleAccount', 'googleAccounts')
      //queryInterface.renameTable('User', 'Users')
      
      //queryInterface.renameColumn('Users', 'urlKey', 'url_key')
      
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
sequelize db:migrate:undo
      Example:
      return queryInterface.dropTable('users');
    */
  }
};
