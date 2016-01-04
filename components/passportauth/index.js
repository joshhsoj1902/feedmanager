(function () {

   var  passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy,
        models = require('../../models/index');
    module.exports = {
        "init": function (app) {

            console.log("Passport 1");

                    console.log("Passport 2");

                    passport.use(new LocalStrategy(
                        function (username, password, done) {
                            console.log("username", username);
                            console.log("password", password);
                            
                            //Log that a user was requested
                            models.Log.create({
                                message: username
                                }).then(function(log) {
                                    console.log(JSON.stringify(log, null, "    "));
                            });
                            
                            models.User.find({
                                where: {
                                    username: username
                                }
                            }).then(function(user) {
                                if (!user) {
                                    return done(null, false, { message: 'Incorrect username.' });
                                }
                                
                                console.log(JSON.stringify(user, null, "    "));
							    console.log(user.url_key);
                                
                                //TODO reenable passwords?
                                //if (!user.validPassword(password)) {
                                //  return done(null, false, { message: 'Incorrect password.' });
                                //}
                                return done(null, user);
                            });
                            
                            // users.read(username, function (err, user) {
                            //     if (err) { return done(err); }
                            //     if (!user) {
                            //         return done(null, false, { message: 'Incorrect username.' });
                            //     }
                            //     //TODO reenable passwords?
                            //     //if (!user.validPassword(password)) {
                            //     //  return done(null, false, { message: 'Incorrect password.' });
                            //     //}
                            //     return done(null, user);
                            // });
                        }
                        ));
                    console.log("Passport 3");

                    passport.serializeUser(function (user, done) {
                        done(null, user);
                    });

                    passport.deserializeUser(function (user, done) {
                        done(null, user);
                    });
                    
                    
    // // =========================================================================
    // // LOCAL SIGNUP ============================================================
    // // =========================================================================
    // // we are using named strategies since we have one for login and one for signup
    // // by default, if there was no name, it would just be called 'local'

    // passport.use('local-signup', new LocalStrategy({
    //     // by default, local strategy uses username and password, we will override with email
    //     usernameField : 'email',
    //     passwordField : 'password',
    //     passReqToCallback : true // allows us to pass back the entire request to the callback
    // },
    // function(req, email, password, done) {

    //     // asynchronous
    //     // User.findOne wont fire unless data is sent back
    //     process.nextTick(function() {

    //     // find a user whose email is the same as the forms email
    //     // we are checking to see if the user trying to login already exists
    //     //User.findOne({ 'local.email' :  email }, function(err, user) {
    //     Users.read({ 'local.email' :  email }, function(err, user) {
    //         // if there are any errors, return the error
    //         if (err)
    //             return done(err);

    //         // check to see if theres already a user with that email
    //         if (user) {
    //             return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
    //         } else {

    //             // if there is no user with that email
    //             // create the user
    //             var newUser            = new User();

    //             // set the user's local credentials
    //             newUser.local.email    = email;
    //             newUser.local.password = newUser.generateHash(password);

    //             // save the user
    //             newUser.save(function(err) {
    //                 if (err)
    //                     throw err;
    //                 return done(null, newUser);
    //             });
    //         }

    //     });    

    //     });

    // }));
                    

            return passport;
        }
    };
} ());