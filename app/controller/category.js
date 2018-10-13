var helper = require('../helper/helper')
var app = require('../app')
var sidebar = require('./sidebar')
var postByDate = require('./postByDate')

// Category Controller
exports.category = function(request, response){
	var query = request.query.category;
	if(!helper.isEmpty(query)){
		app.postsRef.orderByChild('category').equalTo(query).once('value',function(snap){
			var jsonContent = helper.snapshotToArray(snap);
			var length = jsonContent.length
			var output = {posts: [], sidebar: [], postByDate: [], user: null};
			for(var i = 0; i < length; i ++){
				console.log("IN THE FOR LOOP ");
				output.posts.push({title: jsonContent[i].title, preview: jsonContent[i].preview, date: jsonContent[i].date, name: jsonContent[i].name, author: jsonContent[i].author, key: jsonContent[i].key});
			}

			if (app.firebase.auth().currentUser){
				console.log(' CURRENT ISRE IS IS ', app.firebase.auth().currentUser.displayName)
				output.user = app.firebase.auth().currentUser.displayName;
			}
			
			if (length != 0){
				query = query[0].toUpperCase() + query.slice(1);
				query += " posts"
				output.category =  query;
			}else{
				output.category = "No result";
			}

			sidebar.mostVisitedPosts(output);
			output = sidebar.output
			postByDate.allPostsByDate(output)
			output = postByDate.output

			response.render('categories', output);
		});
	}else{
		app.postsRef.limitToFirst(10).once('value',function(snap){
			console.log(snap.val());
			response.json(snap.val());
		});
	}
};