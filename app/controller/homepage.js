var helper = require('../helper/helper')
var app = require('../app')

// HomePage Controller
exports.homepage = function(request, response){
	app.postsRef.orderByKey().limitToLast(3).once('value',function(snap){
		var jsonContent = helper.snapshotToArray(snap);
		var length = jsonContent.length;
		var output = {posts: [], sidebar: []};
		
		for(var i = length-1; i >= 0; i --){
			output.posts.push({title: jsonContent[i].title, preview: jsonContent[i].preview, date: jsonContent[i].date, name: jsonContent[i].name, author: jsonContent[i].author, image: jsonContent[i].image, key: jsonContent[i].key, key: jsonContent[i].key});
		}

		lastKey = jsonContent[0].key;
		prestart = jsonContent[length-1].key;

		app.postsRef.orderByChild('viewed').limitToLast(3).once('value', function(childSnap){
			var content = helper.snapshotToArray(childSnap);
			var len = content.length;
			for(var j = len-1; j >= 0; j--){
				output.sidebar.push({title: content[j].title, name: content[j].name, key: content[j].key});
			}
			response.render('index',output);
		});
	},function(err){
		// printing the error in Firebase
		console.log('Error!!!');
		console.log(err)
		response.status(err)
	});
};