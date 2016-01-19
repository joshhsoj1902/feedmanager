'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn(
        'Users',
        'firstName',
        {
            type: Sequelize.STRING
        }
    );
    
//      bar_id: {
//    type: Sequelize.INTEGER,

//    references: {
//      // This is a reference to another model
//      model: Bar,

//      // This is the column name of the referenced model
//      key: 'id',

//      // This declares when to check the foreign key constraint. PostgreSQL only.
//      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
//    }
//  }
    
                        // newUser.google.id    = profile.id;
                    // newUser.google.token = token;
                    // newUser.google.name  = profile.displayName;
                    // newUser.google.email = profile.emails[0].value; // pull the first email
            // u.username = req.body.email;
        // u.password = req.body.password;
        // u.lastname = req.body.lastname;
        // u.firstname = req.body.firstname;
    
    //   return queryInterface.createTable('Users', {
    //   id: {
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: Sequelize.INTEGER
    //   },
    //   username: {
    //     type: Sequelize.STRING
    //   },
    //   url_key: {
    //     type: Sequelize.STRING
    //   },
    //   createdAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE
    //   },
    //   updatedAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE
    //   }
    // });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
