var helper = require('../helper/helper')
var app = require('../app')

// Search Controller
exports.search_get = function(request, response){
	var query = request.query.searchquery;
	console.log("in the search callback");
	if(!helper.isEmpty(query)){
		app.postsRef.once('value',function(snap){
			var jsonContent = helper.searchquery(snap, query);
			var length = jsonContent.length;
			var output = {posts: [], sidebar: []};
			for(var i = 0; i < length; i ++){
				//console.log("IN THE FOR LOOP ");
				output.posts.push({title: jsonContent[i].title, preview: jsonContent[i].preview, date: jsonContent[i].date, name: jsonContent[i].name, author: jsonContent[i].author});
			}
			output.category = "Search results for '"+query+"' are:";
			app.postsRef.orderByChild('viewed').limitToLast(3).once('value', function(childSnap){
				var content = helper.snapshotToArray(childSnap);
				var len = content.length;
				for(var j = len-1; j >= 0; j--){
					output.sidebar.push({title: content[j].title, name: content[j].name, key: content[j].key});
				}
				response.render("searchresults",output);
			});
		});
	}
	else{
		response.render('errorpage');
	}
};