var config = require("./config.json"),
	express = require("express"),
	bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
	favicon = require('serve-favicon'),
	errorHandler = require("errorhandler"),
	morgan = require('morgan'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	routes = require("./routes.js"),
	dbs = require("./libs/connectDbs.js"),
    feedManager = require("./components/feed/feedManager.js"),
    passportauth = require("./components/passportauth/index.js"),
    passport = require('passport-google-oauth'),
    //everyauth = require('everyauth'),
	app = express();

config.server.port = process.env.PORT || config.server.port;
config.server.public_dir = process.env.PUBLIC_DIR || config.server.public_dir;

console.log("App Starting");





// everyauth.google
//   .appId('900424338743-2pii74fqtkcunqti52t0n9ct12sjp0nn.apps.googleusercontent.com') //CLIENT ID
//   .appSecret('Rh3A6Gy8SN8Kd6hlZjlPuaLk') //SECRET
//   .scope('https://www.google.com/m8/feeds') // What you want access to 
//   .handleAuthCallbackError( function (req, res) {
//     // If a user denies your app, Google will redirect the user to 
//     // /auth/facebook/callback?error=access_denied 
//     // This configurable route handler defines how you want to respond to 
//     // that. 
//     // If you do not configure this, everyauth renders a default fallback 
//     // view notifying the user that their authentication failed and why. 
//   })
//   .findOrCreateUser( function (session, accessToken, accessTokenExtra, googleUserMetadata) {
//       console.log("findOrCreateUser");
//     // find or create user logic goes here 
//     // Return a user or Promise that promises a user 
//     // Promises are created via 
//     //     var promise = this.Promise(); 
//   })
//   .redirectPath('/');


//app.configure(function(){

	//app.use(favicon);
	app.use(morgan('dev')); // Log with Morgan

	//causes runtime errors for me...
	//app.use(methodOverride);
	
	app.use(express["static"](config.server.public_dir));
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
        extended: true
     }));

	app.use(bodyParser.text()); // Allows bodyParser to look at raw text
	app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // Parse application/vnd.api+json
	
	//app.use(cookieParser);


	app.use(session({ 
	   secret: 'keyboard dogs',
       name: 'feed_manager_cookie',
       //store: sessionStore, // connect-mongo session store
       proxy: true,
       resave: true,
       saveUninitialized: true
	 }));
	
	//Come back to passport once express is working
	passport = passportauth.init(app);
    app.use(passport.initialize());
    app.use(passport.session());
	
	//app.use(app.router);

  

//});  

//var env = process.env.NODE_ENV || 'development';
var env = 'development';
if ('development' === env) {
   app.use(errorHandler({
        dumpException: true,
        showStack: true
    }));
}

    dbs.connect(config.dbs, function(errs, clients){
	var db;
	if(errs){
		for(db in errs){
			console.log("Error: db[" + db + "] " + errs[db]);
		}
	}else{
		
		
        //passportauth.init(app,clients);

	}
	});



		routes.load(app);
    

    
		app.listen(config.server.port);
		console.log("App listening on port: " + config.server.port);


      app.post('/login',
        passport.authenticate('local', { successRedirect: '/',
                                       failureRedirect: '/login',
                                       failureFlash: true })
      );

app.get('/rss',function(req, res) {
    feedManager.generateFeed(req,res);
});
