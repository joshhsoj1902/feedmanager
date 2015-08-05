(function(){
	var feedFilter = {
		filterByScore: function(posts,minScore){
			var key = 0;
			while (key < posts.length) {
				if (posts.hasOwnProperty(key)){
					if (posts[key].score < minScore){
						console.log("Remove " + "("+ posts[key].score+")"+ posts[key].title);
						posts.splice(key,1);
						continue;
					}
			    }
				key++;
			}
			return posts;
		},
		limitNumberOfResults: function(posts,limit){
			
			posts.splice(limit,posts.length);
			return posts;
		}
	};
	module.exports = {
		filterPosts: function(feedHeader,posts) {
			console.log(feedHeader.feedMinScore);
			if (feedHeader.feedMinScore > 0) {
				posts = feedFilter.filterByScore(posts,feedHeader.feedMinScore);
			}
			
			
			
									
			if(typeof feedHeader.feedLimit !== "undefined" && feedHeader.feedLimit > 0){
				posts = feedFilter.limitNumberOfResults(posts,feedHeader.feedLimit);
			}
			else{
				//temporary 10 feed limit
				posts = feedFilter.limitNumberOfResults(posts,10);
			}
			return posts;
		}
	};
	}());