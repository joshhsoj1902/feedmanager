(function(){
	
	var rssHandlerLocal = {
		readStandardFeed: function(feedHeader,cbHandlePosts){

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
					cbHandlePosts(feedHeader,posts);
					//feedManagerLocal.handlePosts(feedHeader,posts,callback);	
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
			}

	};
	module.exports = {
		handleRSSFeed: function(feedHeader,callback) {							
				rssHandlerLocal.readStandardFeed(feedHeader,callback);
			}
	};
}());