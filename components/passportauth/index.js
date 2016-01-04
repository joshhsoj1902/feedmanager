(function () {
    var Users = require("../users/index.js"),
        config = require("./../../config.json"),
        dbs = require("../../libs/connectDbs.js"),
        passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy,
        middlewarize = require("../../libs/APICreator.js");
    module.exports = {
        "init": function (app) {

            console.log("Passport 1");



            dbs.connect(config.dbs, function (errs, clients) {
                var db;
                if (errs) {
                    for (db in errs) {
                        console.log("Error: db[" + db + "] " + errs[db]);
                    }
                } else {

                    var users = Users.init(clients["feedDB"]);


                    console.log("Passport 2");

                    passport.use(new LocalStrategy(
                        function (username, password, done) {
                            console.log("username", username);
                            console.log("password", password);
                            //User.findOne({ username: username }, function(err, user) {
                            //  if (err) { return done(err); }
                            //  if (!user) {
                            //    return done(null, false, { message: 'Incorrect username.' });
                            //  }
                            //  if (!user.validPassword(password)) {
                            //    return done(null, false, { message: 'Incorrect password.' });
                            //  }
          
          
                            users.read(username, function (err, user) {
                                if (err) { return done(err); }
                                if (!user) {
                                    return done(null, false, { message: 'Incorrect username.' });
                                }
                                //TODO reenable passwords?
                                //if (!user.validPassword(password)) {
                                //  return done(null, false, { message: 'Incorrect password.' });
                                //}
                                return done(null, user);
                            });
                        }
                        ));
                    console.log("Passport 3");

                    passport.serializeUser(function (user, done) {
                        done(null, user);
                    });

                    passport.deserializeUser(function (user, done) {
                        done(null, user);
                    });
                    console.log("Passport 4");



                    console.log("Passport 5");

                    users.api = middlewarize.createAPI(users);

                    console.log("Passport 6");



                    console.log("Passport 7");


                }
            });


            return passport;

        }




    };
} ());