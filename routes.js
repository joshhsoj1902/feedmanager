// (function() {
// 	var simple = require("./components/simple/routes.js"),
// 		dummy = require("./components/dummy/index.js"),
// 		RestfulAuth = require("./components/restfulauth/index.js");

// 	module.exports = {
// 		load: function(app) {
// 			//var users = Users.init(dbs["sampleUsers"])
// 				//restfulauth = RestfulAuth.init(users);

// 			//users.api = middlewarize.createAPI(users);

// 			//app.post("/api/auth", [restfulauth], dummy.ok);
// 			//app.post("/createUser", users.api.create);
// 			//app.get("/createUser", users.api.create);
// 			//app.get("/readUser", users.api.read);
// 			//app.get("/updateUser", users.api.update);
// 			//app.get("/deleteUser", users.api.del);
// 			//app.get("/listUsers", users.api.list);
// 			app.get("/hello", simple.helloWorld);
// 		}
// 	};
// }());

module.exports = {
  load:function(app) {

  app.get("*", function(req,res) {
    //load the single view file and angular witll handle the page changes on the front-end.
    res.sendfile('./public/index.html');
  });
  
//   //https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
//   app.post('/api/profile',function(req,res){
    
//   })
}
};