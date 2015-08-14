(function(){
	var config = require("./../../config.json");
	
	var redditHandlerLocal = {
		readRedditSubreddit: function(feedHeader,cbHandlePosts){
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

					default:
						//htmlContent = "<iframe src=\""+post.url+"\"></iframe>";
						
						if (typeof redditData.secure_media_embed.content !== "undefined") {
							//Video
							htmlContent =	decodeURIComponent(htmlEntities.decodeHTML(redditData.secure_media_embed.content));
						}else if(typeof redditData.media_embed.content !== "undefined"){
							//Video
							htmlContent =	decodeURIComponent(htmlEntities.decodeHTML(redditData.media_embed.content));
							htmlContent = htmlContent.replace(/\"\/\//g,"\"http://");
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
					cbHandlePosts(feedHeader,posts);
					});
				}
				
			});
		}
	};
	module.exports = {
			handleRedditFeed: function(feedHeader,callback) {							
				redditHandlerLocal.readRedditSubreddit(feedHeader,callback);
			}
	};
}());