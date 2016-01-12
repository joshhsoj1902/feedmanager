(function(){
	var feedFilter		= require("./feedFilter.js");
	var rssHandler		= require("./rssHandler.js");
	var redditHandler	= require("./redditHandler.js");
	//var config			= require("./../../config.json");
	
	
	var feedManagerLocal = {
			handlePosts: function(feedHeader,posts,callback){
				posts = feedFilter.filterPosts(feedHeader,posts);
				var feed = feedManagerLocal.buildRSSFeed(feedHeader,posts);
				
				callback(feed);
			},
			buildRSSFeed: function(feedHeader,posts){
					
				var Feed = require('feed');
				// Initializing feed object 
				
				console.log(feedHeader.feedDetails);
								
				var feed = new Feed(feedHeader.feedDetails);

					for(var key in posts) {
					    if (posts.hasOwnProperty(key)){
					        feed.addItem({
								title:			posts[key].title,
								link:			posts[key].url,
								description:	posts[key].description,
					            date:			posts[key].date
							});
						}            
					}
				
					return feed;			
				}

	};
	module.exports = {
		generateFeed: function(req, res) {							
			function sendFeedResponse(feed){
					//var Feed = require('feed');
					// Initializing feed object
					res.set('Content-Type', 'text/xml');
			        // Sending the feed as a response
					
					//console.log(feed);
					
			        res.send(feed.render('atom-1.0'));		
				}
				function processPosts(lFeedHeader,lPosts){
					feedManagerLocal.handlePosts(lFeedHeader,lPosts,sendFeedResponse);
				}
				
				// if (typeof req._passport.session !== 'undefined' && req._passport.session){
				// 	if (req._passport.session.user !== 'undefined') {
				// 		if (req._passport.session.user.url_key !== 'undefined') {
				// 			console.log(req._passport.session.user.url_key);
				// 		}
				// 	}
				// }
				
				var feedHeader = {
						feedDetails: {
							"title":          "Feed Manager",
							"description":    "",
							"link":           "",
							author: {
									"name":       "John Doe",
									"email":      "",
									"link":       ""
								}
							},
							feedType:"",
							feedLimit:0,
							feedUrl:""
							//feedSubReddit:""
							//feedMinScore:"",
							//debug
					};
				
				if(typeof req.query.url !== "undefined"){
					feedHeader.feedUrl = req.query.url;
					feedHeader.feedType="URL";
				}
				
				if (typeof req.query.subreddit !== "undefined") {
					feedHeader.feedType = "REDDIT";
					feedHeader.feedSubReddit = req.query.subreddit;
				}
				
				if (typeof req.query.minScore !== "undefined") {
					feedHeader.feedMinScore = req.query.minScore;
				}
		
				if(typeof req.query.feedLimit !== "undefined"){
					feedHeader.feedLimit = req.query.feedLimit;
				}else{
					feedHeader.feedLimit = 10;
				}
				
				
				if(typeof req.query.debug !== "undefined"){
					feedHeader.debug = true;
					if (feedHeader.debug === true) {
						console.log("DEBUG ON");
					}
				}
				
				
				
				
				var pg = require('pg');
				var conString = "postgres://postgres:admin@localhost/feeds";


		
				
				
						
				
				
				//var server = http.createServer(function(req, res) {
				
				// get a pg client from the connection pool
				pg.connect(conString, function(err, client, done) {
				
					var handleError = function(err) {
					// no error occurred, continue with the request
					if(!err){
						return false;	
					} 
				
					// An error occurred, remove the client from the connection pool.
					// A truthy value passed to done will remove the connection from the pool
					// instead of simply returning it to be reused.
					// In this case, if we have successfully received a client (truthy)
					// then it will be removed from the pool.
					if(client){
						done(client);
					}
					res.writeHead(500, {'content-type': 'text/plain'});
					res.end('An error occurred');
					return true;
					};
				
					// handle an error from the connection
					if(handleError(err)) {return;}
				
					//client.query('INSERT INTO users (username) VALUES ($1)', ['joshhsoj1902'],
					// record the visit
					client.query('INSERT INTO log (message) VALUES ($1)', ['joshhsoj1902'], function(err, result) {
				
					// handle an error from the query
					if(handleError(err)) {return;}
				
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
				});
				//})
				
				
				
				
				
				
				
				
				
				
				if (feedHeader.feedType === "") {
					//Just doing this for now to make testing easier
					feedHeader.feedType="URL";
					feedHeader.feedUrl="http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/topsongs/limit=10/xml";
				}
				switch(feedHeader.feedType){
					case "URL":
						rssHandler.handleRSSFeed(feedHeader,processPosts);
						//feedManagerLocal.readStandardFeed(feedHeader,sendFeedResponse);
						break;
					case "REDDIT":
						redditHandler.handleRedditFeed(feedHeader,processPosts);
						//feedManagerLocal.readRedditSubreddit(feedHeader,sendFeedResponse);
						break;
					default:
						console.log("Unknown feedType: ",feedHeader.feedType);
						break;
					
				}
			}
	};
}());