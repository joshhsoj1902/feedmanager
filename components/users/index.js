(function() {
	var userModel = require("./models/user");

	module.exports = {
		init: function(db) {
			return {
				create: function(user, cb) {
					userModel.validate(user, function(err, usr) {
						var user;
						if (err) {
							cb(err);
						} else {
							user = userModel.normalize(usr);
							if (db.kv(user.id)) {
								cb(["User already exists"]);
							} else {
								db.kv(user.id, user, cb);
							}
						}
					});
				},
				read: function(username, cb){
					
					
					db.query('INSERT INTO log (message) VALUES ($1)', [username], function(err, result) {
				
					// handle an error from the query
					//if(handleError(err)) {return;}
					console.log("JB2: calllback");
					// get the total number of visits today (including the current visit)
					// client.query('SELECT COUNT(date) AS count FROM visit', function(err, result) {
				
					// 	// handle an error from the query
					// 	if(handleError(err)) return;
				
					// 	// return the client to the connection pool for other requests to reuse
					// 	done();
					// 	res.writeHead(200, {'content-type': 'text/plain'});
					// 	res.end('You are visitor number ' + result.rows[0].count);
					// });
					});
					
					var query = db.query("SELECT url_key FROM users WHERE username = $1",[username]);
					query.on("row", function (row, result) {
						result.addRow(row);
					});
					query.on("end", function (result) {
						if (result.rowCount = 1) {
							var user = result.rows[0];
							console.log(JSON.stringify(result.rows, null, "    "));
							console.log(user.url_key);
							
							cb(undefined, user);
						} else if (result.rowCount > 1) {
							cb(["User not found [Reason 2]"]);
						} else {
							cb(["User not found"]);
						}
						
					});
					
					// var usr = db.kv(user.id);
					// if(!usr){
					// 	cb(["User not found"]);
					// }else{
					// 	cb(undefined, usr);
					// }
				},
				update: function(user, cb){
					userModel.validateUpdate(user, function(err, usr){
						var user;
						if(err){
							cb(err);
						}else{
							user = userModel.normalize(usr);
							if(user.id !== usr.oldId){
								if(db.kv(user.id)){
									cb(["User already exists"]);
								}else{
									db.del(usr.oldId, function(err){
										if(err){
											cb(err);
										}else{
											db.kv(user.id, user, cb);
										}
									});
								}
							}else{
								db.kv(user.id, user, cb);
							}
						}
					});
				},
				del: function(user, cb){
					user.id = user.id.toLowerCase();
					db.del(user.id, cb);
				},
				list: function(cb) {
					var users = db.getDb(),
						user,
						usersList = [];
					for (user in users) {
						usersList.push({
							id: users[user].id,
							username: users[user].username
						});
					}
					cb(undefined, usersList);
				},
				getPrivateKey: function(publicKey, cb){
					var user = db.kv(publicKey);
					if(user){
						cb(undefined, user.password);	
					}else{
						cb(["User don't exists"]);
					}
					
				}
			};
		}
	};
}());