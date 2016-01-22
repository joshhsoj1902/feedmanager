var models = require('../../models/index');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var config = require('../../config.json');

module.exports = function(app) {
    
    
    app.use(passport.initialize());
 
    app.use(passport.session());
 
 
    passport.use(new LocalStrategy(
        function (username, password, done) {
            console.log("username", username);
            console.log("password", password);
            
            //Log that a user was requested
            models.Log.create({
                message: username
                }).then(function(log) {
                    //console.log(JSON.stringify(log, null, "    "));
            });
            
            models.User.find({
                where: {
                    username: username
                }
            }).then(function(user) {
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                
                console.log("Login",JSON.stringify(user, null, "    "));
                
                //TODO reenable passwords?
                //if (!user.validPassword(password)) {
                //  return done(null, false, { message: 'Incorrect password.' });
                //}
                
                return done(null, user);
            });
        }
 
    ));
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
 
    passport.deserializeUser(function(id, done) {
        models.User.findById(id).then(function(user) {
            console.log("deserializeUser",JSON.stringify(user, null, "    "));
             done(null, user);
        });
    });
 
    function isAuthenticated(req,res,next){
        if(req.isAuthenticated()) 
        {
            return next();
        }
         res.status(401).end();
    }
 
 
    // app.post('/auth/login', passport.authenticate('local'),function(req, res){
    //     res.json(req.user);
    // });
 
     app.get('/auth/currentuser',isAuthenticated,function(req,res){
         res.json(req.user);
     });
    

    
    // app.post('/auth/signup',function(req,res){
 
    //     //var u =  new User();
        
    //     models.User.create({
    //                             username: req.body.username,
    //                             urlKey: "NotMonkey"
    //                             //newUser.local.password = newUser.generateHash(password);
    //                             }).then(function(user) {
    //                                 console.log(JSON.stringify(user, null, "    "));
    //                                 res.json({'alert':'Registration success'});
    //                                 //return done(null, user);
    //                         });
    // });
    
    app.get('/auth/logout', function(req, res){
         console.log('logout');
        req.logout();
        res.send(200);
     });
     
            
    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : config.googleAuth.clientID,
        clientSecret    : config.googleAuth.clientSecret,
        callbackURL     : config.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {
        console.log("Google auth ");
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            
            models.GoogleAccount.find({
                where: {
                    profileId: profile.id
                }
            }).then(function(googleAccount){
                console.log(JSON.stringify(googleAccount, null, "    "));
                if (!googleAccount) {
                    console.log("Google user doesn't exist ",profile.id);
                    
                    
                    // if the user isnt in our database, create a new user
                    models.User.create({
                        username: profile.emails[0].value,
                        urlKey: "NotMonkeyG"
                        }).then(function(user) {
                            console.log(JSON.stringify(user, null, "    "));
                            models.GoogleAccount.create({
                                profileId:  profile.id,
                                token:      token,
                                name:       profile.displayName,
                                email:      profile.emails[0].value,
                                account_id: user.id
                            }).then(function(googleAccount){
                                return done(null, user);
                            });
                            //res.json({'alert':'Registration success'});
                            
                            // newUser.google.id    = profile.id;
                    // newUser.google.token = token;
                    // newUser.google.name  = profile.displayName;
                    // newUser.google.email = profile.emails[0].value; // pull the first email
                            
                            
                    });
                } else {
                    models.User.find({
                        where: {
                        id: googleAccount.account_id 
                        }
                    }).then(function(user){
                        return done(null, user);
                    });
                }
            });
            
            // models.User.find({
            //     where: {
            //         username: profile.id
            //     }
            // }).then(function(user) {
            //     if (!user) {
            //         //return done(null, false, { message: 'Incorrect username.' });
            //         console.log("Google user doesn't exist ",profile.id);
                    
                    
            //         // if the user isnt in our database, create a new user
            //         models.User.create({
            //             username: profile.id,
            //             urlKey: "NotMonkeyG"
                        
                        
                        
            //             //newUser.local.password = newUser.generateHash(password);
            //             }).then(function(user) {
            //                 console.log(JSON.stringify(user, null, "    "));
            //                 //res.json({'alert':'Registration success'});
            //                 return done(null, user);
            //         });
                    
            //         // set all of the relevant information
            //         // newUser.google.id    = profile.id;
            //         // newUser.google.token = token;
            //         // newUser.google.name  = profile.displayName;
            //         // newUser.google.email = profile.emails[0].value; // pull the first email

           
                    
            //     }
                
            //     console.log("Google Login",JSON.stringify(user, null, "    "));
            //     //console.log(user.url_key);
                
            //     //TODO reenable passwords?
            //     //if (!user.validPassword(password)) {
            //     //  return done(null, false, { message: 'Incorrect password.' });
            //     //}
                
            //     return done(null, user);
            // });
        });
    }));
    
    
    //     app.post('/auth/login', passport.authenticate('local'),function(req, res){
    //     res.json(req.user);
    // });
    
    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                     successRedirect : '/profile',
                     failureRedirect : '/'
             }));
            
            
            
    //          app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // // the callback after google has authenticated the user
    // app.get('/auth/google/callback',
    //         passport.authenticate('google', {
    //                 successRedirect : '/profile',
    //                 failureRedirect : '/'
    //         }));
    
};