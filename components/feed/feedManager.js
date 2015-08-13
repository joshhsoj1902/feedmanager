(function(){
	var feedFilter = require("./feedFilter.js");
	var config = require("./../../config.json");
	
	var feedManagerLocal = {
		readRedditSubreddit: function(feedHeader,callback){
			var Rawjs = require('raw.js');
			var reddit = new Rawjs("User-Agent: webapp:me.joshbryans:v0.1 (by /u/joshhsoj1902)");
			
			var htmlEntities = require('entities');
			
			var posts = [];
			
			//todo: Move these details into the database
			//reddit.setupOAuth2("AcpADATX7mS_Gw", "oLApqeMArfaBTfmvwNjjOGfE9S4");
			reddit.setupOAuth2(config.reddit.app_id, config.reddit.app_secret);
			
			function buildRedditDescription(redditData){
				var htmlDescription = "";
				
				var htmlContent = "";
				var htmlSubmitted = "";
				var htmlComments = "";
				
				htmlSubmitted = "<p>" +
					"Submitted by " +
					"<a href=\"https://reddit.com/u/" + redditData.author + "\">" + redditData.author + "</a>" +
					" to " +
					"<a href=\"https://reddit.com/r/" + redditData.subreddit + "\">" + redditData.subreddit + "</a>" +
					"</p>";
				htmlComments = "<p>" +
					"<a href=\"https://reddit.com/" + redditData.permalink + "\"> Comments(" + redditData.num_comments + ") </a>" +
					"</p>";
				
				switch(redditData.post_hint){
					case "image":
						htmlContent = "<img src="+redditData.url+" width=\"75%\">";
						break;
					case "link":
						htmlContent = "<a href=\"https://reddit.com/" + redditData.permalink + "\">" + redditData.permalink + " </a>";
						break;
					case "rich:video":
						//console.log("========RICH VIDEO=========");
						//console.log("Step 1: " + post.media_embed.content);
						//console.log("Step 2: " + htmlEntities1.decode(post.media_embed.content));
						//console.log("Step 3: " + htmlEntities2.decode(post.media_embed.content));
						//console.log("Step 4: " + htmlEntities3.decodeXML(post.media_embed.content));
						//console.log("Step 5: " + htmlEntities3.decodeHTML(post.media_embed.content));
						//console.log("Step 6: " + decodeURI(htmlEntities3.decodeHTML(post.media_embed.content)));
						//console.log("Step 7: " + decodeURIComponent(htmlEntities3.decodeHTML(post.media_embed.content)));
						
						htmlContent =	decodeURIComponent(htmlEntities.decodeHTML(redditData.secure_media_embed.content));
						
						//htmlContent = post.secure_media.oembed;
						//console.log("oEmbed: "+post.secure_media.oembed);
						//console.log("--------RICH VIDEO----------");
						break;
					default:
						//htmlContent = "<iframe src=\""+post.url+"\"></iframe>";
						
						if (typeof redditData.secure_media_embed !== "undefined") {
							//If reddit gave us this section we can embed it!
							htmlContent =	decodeURIComponent(htmlEntities.decodeHTML(redditData.secure_media_embed.content));
						} else {
							htmlContent = "<p>" +
							"Post Hint: " + redditData.post_hint +
							"</br>" +
							"<a href=\"https://reddit.com/" + redditData.permalink + "\">" + redditData.permalink + " </a>" +
							"</br>" +
							"<a href=\"" + redditData.url + "\">" + redditData.url + " </a>" +
							"</p>";
						}
					
						//htmlContent = post.url;
						break;
				}
				
				htmlDescription="<div>" +
					htmlSubmitted +
					htmlComments +
					"</br>" +
					"<p>Score: "+redditData.score+"</p>" +
					htmlContent +
					"</div>";
					
				if (feedHeader.debug === true) {
					htmlDescription = htmlDescription +
					"<div>" +
					"<p>" +
					"Post Hint: " + redditData.post_hint +
					"</p>" +
					"<p>" +
					JSON.stringify(redditData, null, 2) + 
					"</p></div>";
				}
				
				
				return htmlDescription;
			}
			
			//TODO: change this to be webapp authenticated instead of script authenticated (NEED DB) http://www.reddit.com/r/rawjs/wiki/documentation
			
			reddit.auth({"username": config.reddit.bot_username, "password": config.reddit.bot_password}, function(err, response) {
				if(err) {
					console.log("Unable to authenticate user: " + err);
				} else {
					console.log("AUTHENTICATED");
					
					feedHeader.feedDetails.title		= "/r/"+feedHeader.feedSubReddit+"(Top:day)";
					//feedHeader.feedDetails.description	= meta.description;
					feedHeader.feedDetails.link			= "https://www.reddit.com/r/"+ feedHeader.feedSubReddit;
					//feedHeader.feedDetails.xmlurl			= meta.xmlurl;
					feedHeader.feedDetails.date			= new Date();
					//feedHeader.feedDetails.pubdate		= meta.pubdate;
					//feedHeader.feedDetails.author.name	= meta.author;
					//feedHeader.feedDetails.language		= meta.language;
					//feedHeader.feedDetails.image			= meta.image;
					feedHeader.feedDetails.favicon		= "reddit.com/favicon.ico";
					//feedHeader.feedDetails.copyright		= meta.copyright;
					//feedHeader.feedDetails.generator		= meta.generator;
					//feedHeader.feedDetails.categories		= meta.categories;
					
					var options = ({
						r:feedHeader.feedSubReddit,
						t:"day",
						limit:100
					});
					
					console.log(options);
					reddit.top(options,function(err,response){
						//console.log(response);
						console.log(response.children[1]);
						
						for(var key in response.children) {
							if (response.children.hasOwnProperty(key)){
								var outputPost = {
									"title":		response.children[key].data.title,
									"url":			"https://www.reddit.com" + response.children[key].data.permalink,
									"description":  buildRedditDescription(response.children[key].data),
									"date":			new Date(response.children[key].data.created_utc*1000),
									"image":		response.children[key].data.thumbnail,
									"author":		response.children[key].data.author,
									"score":		response.children[key].data.score
							};
							posts.push(outputPost);
						}
					                
					}
					feedManagerLocal.handlePosts(feedHeader,posts,callback);
					});
				}
				
			});
		},
		readStandardFeed: function(feedHeader,callback){

				var FeedParser = require('feedparser');
				var request = require('request');
				
				var feedReq = request(feedHeader.feedUrl);
				var feedparser = new FeedParser();
				
				feedReq.on('error', function (error) {
				  // handle any request errors
				});
				feedReq.on('response', function (feedRes) {
				var stream = this;
				
				if (feedRes.statusCode !== 200) {
					return this.emit('error', new Error('Bad status code'));
					}
					stream.pipe(feedparser);
				});
				
				
				feedparser.on('error', function(error) {
				  // always handle errors
				});
				
				var posts = [];
				
				feedparser.on('end',function(){
					feedManagerLocal.handlePosts(feedHeader,posts,callback);	
				});
			
				console.log("Parsing");
				feedparser.on('readable', function() {	
				    var post;
					
					var meta = this.meta;
					
					feedHeader.feedDetails.title		= meta.title;
					feedHeader.feedDetails.description	= meta.description;
					feedHeader.feedDetails.link			= meta.link;
					feedHeader.feedDetails.xmlurl		= meta.xmlurl;
					feedHeader.feedDetails.date			= meta.date;
					feedHeader.feedDetails.pubdate		= meta.pubdate;
					feedHeader.feedDetails.author.name	= meta.author;
					feedHeader.feedDetails.language		= meta.language;
					feedHeader.feedDetails.image		= meta.image;
					feedHeader.feedDetails.favicon		= meta.favicon;
					feedHeader.feedDetails.copyright	= meta.copyright;
					feedHeader.feedDetails.generator	= meta.generator;
					feedHeader.feedDetails.categories	= meta.categories;
					
					
					while (post = this.read()) {
											
						var outputPost = {
				         "title":		post.title,
				         "url":			post.link,
				         "description":	post.description,
				         "date":		post.pubdate,
				         "image":		post.image
						 };
						posts.push(outputPost);
						}
					});
			},
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
							feedLimit:"",
							feedUrl:""
							//feedSubReddit:""
							//feedMinScore:"",
							//debug
					};

				//console.log(req.query.testing);
				//console.log(req.query.test);
				
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
						feedManagerLocal.readStandardFeed(feedHeader,sendFeedResponse);
						break;
					case "REDDIT":
						feedManagerLocal.readRedditSubreddit(feedHeader,sendFeedResponse);
						break;
					default:
						console.log("Unknown feedType: ",feedHeader.feedType);
						break;
					
				}
			}
	};
}());