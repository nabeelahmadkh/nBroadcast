var helper = require('../helper/helper')
var app = require('../app')
var postByDate = require('./postByDate')
var sidebar = require('./sidebar')

// Search Controller
exports.search_get = function(request, response){
	var query = request.query.searchquery;
	console.log("in the search callback");
	if(!helper.isEmpty(query)){
		app.postsRef.once('value',function(snap){
			var jsonContent = helper.searchquery(snap, query);
			var length = jsonContent.length;
			// var keys = snap.key;
			var output = {posts: [], sidebar: [], postByDate: [], user: null};

			if (app.firebase.auth().currentUser){
				console.log(' CURRENT ISRE IS IS ', app.firebase.auth().currentUser.displayName)
				output.user = app.firebase.auth().currentUser.displayName;
			}
			
			console.log(' keys are ', jsonContent)
			// console.log('lenth is ', length)
			for(var i = length-1; i >= 0; i --){
				//console.log("IN THE FOR LOOP ");
				output.posts.push({title: jsonContent[i].title, preview: jsonContent[i].preview, date: jsonContent[i].date, name: jsonContent[i].name, author: jsonContent[i].author, key: jsonContent[i].key});
			}
			output.category = "Search results for '"+query+"' are:";
			
			sidebar.mostVisitedPosts(output)
			output = sidebar.output
			
			postByDate.allPostsByDate(output)
			output = postByDate.output
			
			response.render("searchresults",output);
		});
	}
	else{
		response.render('errorpage');
	}
};