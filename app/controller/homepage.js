var helper = require('../helper/helper')
var app = require('../app')
var start = 1

// HomePage Controller
exports.homepage = function(request, response){
    var pageLength = 2;
    var query = request.query.post;
    var key = app.keys[0]

    if (!helper.isEmpty(query)){
        if (query == "older"){
            if ((start + pageLength) > app.numberOfPosts){
                key = app.keys[start-1];
            }
            else{
                start += pageLength;
                key = app.keys[start-1];
            }
        }
        if (query == "newer"){
            if (start == 1){
                key = app.keys[start-1];
            }
            else{
                start -= pageLength;
                key = app.keys[start-1];
            }
        }
    }
    console.log("start and key ", start, key)
    console.log("keys ", app.keys)
    
    app.postsRef.orderByKey().limitToFirst(pageLength).startAt(key).once('value',function(snap){
        var keys = Object.keys(snap.val());
		var jsonContent = helper.snapshotToArray(snap);
		var length = jsonContent.length;
		var output = {posts: [], sidebar: []};
		
		for(var i = length-1; i >= 0; i --){
            output.posts.push({title: jsonContent[i].title, preview: jsonContent[i].preview, date: jsonContent[i].date, name: jsonContent[i].name, author: jsonContent[i].author, image: jsonContent[i].image, key: jsonContent[i].key, key: keys[i]});
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
		console.log('Error!!!');
		console.log(err)
		response.status(err)
	});
};