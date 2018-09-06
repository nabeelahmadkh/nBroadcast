var helper = require('../helper/helper')
var app = require('../app')

// Category Controller
exports.category = function(request, response){
	var query = request.query.category;
	if(!helper.isEmpty(query)){
		app.postsRef.orderByChild('category').equalTo(query).once('value',function(snap){
			var jsonContent = helper.snapshotToArray(snap);
			var length = jsonContent.length
			var output = {posts: [], sidebar: []};
			for(var i = 0; i < length; i ++){
				console.log("IN THE FOR LOOP ");
				output.posts.push({title: jsonContent[i].title, preview: jsonContent[i].preview, date: jsonContent[i].date, name: jsonContent[i].name, author: jsonContent[i].author});
			}
			if (length != 0){
				query = query[0].toUpperCase() + query.slice(1);
				query += " posts"
				output.category =  query;
			}else{
				output.category = "No result";
			}

			app.postsRef.orderByChild('viewed').limitToLast(3).once('value', function(childSnap){
				var content = helper.snapshotToArray(childSnap);
				var len = content.length;
				for(var j = len-1; j >= 0; j--){
					output.sidebar.push({title: content[j].title, name: content[j].name, key: content[j].key});
				}
				response.render('categories', output);
			});
		});
	}else{
		app.postsRef.limitToFirst(10).once('value',function(snap){
			console.log(snap.val());
			response.json(snap.val());
		});
	}
};