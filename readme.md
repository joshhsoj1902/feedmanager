## Feed Manager

A solution for turning subreddits into RSS feeds!

Currently it can republish a pre existing rss feed, or it can publish a subreddit as an rss feed. 

Example:
To view the Worldnews subreddit, but only return the top 3 results and make sure that those top 3 all scored a minimum of 3400 points use the following:
  /rss?subreddit=worldnews&minScore=3400&feedLimit=3

The front end is currently being worked on. At the moment it supports signing in using google accounts and then linking that account to a reddit account. The next phase will be allowing some sort of accountID to be passed into the feed requester so that it can get data from reddit based on that account. 


