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
				}
				
				
				
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