var models = require('../../models/index');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
                //console.log(user.url_key);
                
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
 
 
    app.post('/auth/login', passport.authenticate('local'),function(req, res){
        res.json(req.user);
    });
 
     app.get('/auth/currentuser',isAuthenticated,function(req,res){
         res.json(req.user);
     });
    

    
    app.post('/auth/signup',function(req,res){
 
        //var u =  new User();
        
        models.User.create({
                                username: req.body.username,
                                url_key: "NotMonkey"
                                //newUser.local.password = newUser.generateHash(password);
                                }).then(function(user) {
                                    console.log(JSON.stringify(user, null, "    "));
                                    res.json({'alert':'Registration success'});
                                    //return done(null, user);
                            });
        
        // u.username = req.body.email;
        // u.password = req.body.password;
        // u.lastname = req.body.lastname;
        // u.firstname = req.body.firstname;
        // u.email = req.body.email;
 
        // u.save(function(err){
        //     if (err) {
        //         res.json({'alert':'Registration error'});
        //     }else{
        //         res.json({'alert':'Registration success'});
        //     }
        // });
    });
    
    app.get('/auth/logout', function(req, res){
         console.log('logout');
        req.logout();
        res.send(200);
     });
    
};