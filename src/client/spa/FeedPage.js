// //Reqire the feed module
// var Feed = require('feed');

// //Initiialize feed
// var myFeed = new Feed({
// 	title:			'Hello Feed',
// 	description:	'hello new world',
// 	link:			'http://google.com',
// 	image:			'',
// 	copyright:		'NA',
	
// 	author: {
// 		name:		'Mr Hello',
// 		email:		'',
// 		link:		''
// 	}
// });

// myFeed.category('testing')

// for(var key in posts) {
//     feed.item({
//         title:          posts[key].title,
//         link:           posts[key].url,
//         description:    posts[key].description,
//         date:           posts[key].date
//     });
// }

// var output = myFeed.render('atom-1.0');


define([
	"spa/templates"
	],
	function(templates){
		this.app.get('/rss', function(req, res) {
    
            var Feed = require('feed');
            // Initializing feed object
            var feed = new Feed({
                title:          'My Feed Title',
                description:    'This is my personnal feed!',
                link:           'http://example.com/',
                image:          'http://example.com/logo.png',
                copyright:      'Copyright © 2013 John Doe. All rights reserved',
        
                author: {
                    name:       'John Doe',
                    email:      'john.doe@example.com',
                    link:       'https://example.com/john-doe'
                }
            });
        
                //Create some dummy posts
                var posts = {
                    "posts":[
                        {"id":"0","title":"Post 1","url":"http://google.ca","description":"Google Post","date":"","image":""},
                        {"id":"1","title":"Post 2","url":"http://yahoo.com","description":"Yahoo Post","date":"","image":""}
                    ]
                    // ],
                    // "post2": [
                        // {"id":"2","name":"Yahoo"},
                        // {"id":"3","name":"Facebook"}
                    // ]
                };
        
            for(var key in posts) {
                    feed.item({
                        title:          posts[key].title,
                        link:           posts[key].url,
                        description:    posts[key].description,
                        author: [
                            {
                                name:   'Jane Doe',
                                email:  'janedoe@example.com',
                                link:   'https://example.com/janedoe'
                            },
                            {
                                name:   'Joe Smith',
                                email:  'joesmith@example.com',
                                link:   'https://example.com/joesmith'
                            }
                        ],
                        contributor: [
                            {
                                name:   'Shawn Kemp',
                                email:  'shawnkemp@example.com',
                                link:   'https://example.com/shawnkemp'
                            },
                            {
                                name:   'Reggie Miller',
                                email:  'reggiemiller@example.com',
                                link:   'https://example.com/reggiemiller'
                            }
                        ],
                        date:           posts[key].date,
                        image:          posts[key].image
                    });
                }
            
            // Function requesting the last 5 posts to a database. This is just an
            // example, use the way you prefer to get your posts.
            // Post.findPosts(function(posts, err) {
            //     if(err)
            //         res.send('404 Not found', 404);
            //     else {
            //         for(var key in posts) {
            //             feed.item({
            //                 title:          posts[key].title,
            //                 link:           posts[key].url,
            //                 description:    posts[key].description,
            //                 date:           posts[key].date
            //             });
            //         }
            //         // Setting the appropriate Content-Type
            //         res.set('Content-Type', 'text/xml');
        
            //         // Sending the feed as a response
            //         res.send(feed.render('rss-2.0'));
            //     }
            // });
        });
		//return Menu;
	});




    
