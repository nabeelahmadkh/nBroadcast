var helper = require('../helper/helper')
var app = require('../app')
var sidebar = require('./sidebar')
var postByDate = require('./postByDate')
var end = app.numberOfPosts - 1

// HomePage Controller
exports.homepage = function(request, response){
    // console.log("******** CHECK 1 ********")
    var pageLength = 3;
    var query = request.query.post;
    var key = app.keys[app.numberOfPosts - 1]
    // console.log("******** CHECK 2 ********")
    if (isNaN(end)){
        end = app.numberOfPosts - 1
    }
    // console.log("******** CHECK 3 ********")

    if (!helper.isEmpty(query)){
        if (query == "older"){
            if ((end - pageLength) >= 0){
                key = app.keys[end-pageLength]
                end -= pageLength
            }
            else{
                key = app.keys[0]
                end = 0
            }
        }
        if (query == "newer"){
            if ((end + pageLength) <= (app.numberOfPosts-1)){
                key = app.keys[end + pageLength];
                end += pageLength;
            }
            else{
                end = app.numberOfPosts-1;
                key = app.keys[end];
            }
        }
    }
    // console.log("start and key ", end, key)
    console.log("******** CHECK 4 ********")
    // console.log("keys ", app.keys)
    
    app.postsRef.orderByKey().limitToLast(pageLength).endAt(key).once('value',function(snap){
        // console.log("******** CHECK 4 ********")
        var keys = Object.keys(snap.val());
		var jsonContent = helper.snapshotToArray(snap);
        var length = jsonContent.length;
        var output = {posts: [], sidebar: [], newer: "", older: "", postByDate: [], user: null};
        if (app.firebase.auth().currentUser){
            console.log(' CURRENT ISRE IS IS ', app.firebase.auth().currentUser.displayName)
            output.user = app.firebase.auth().currentUser.displayName;
        }
        
        if (end == app.numberOfPosts-1){
            output.newer = "page-item disabled";
            output.older = "page-item"
        }
        else if (end < pageLength){
            output.newer = "page-item";
            output.older = "page-item disabled";
        }
        else{
            output.newer = "page-item";
            output.older = "page-item";
        }
		
		for(var i = length-1; i >= 0; i --){
            output.posts.push({title: jsonContent[i].title, preview: jsonContent[i].preview, date: jsonContent[i].date, name: jsonContent[i].name, author: jsonContent[i].author, image: jsonContent[i].image, key: jsonContent[i].key, key: keys[i]});
        }
        // console.log("******** CHECK 5 ********")

		lastKey = jsonContent[0].key;
		prestart = jsonContent[length-1].key;

        sidebar.mostVisitedPosts(output);
        output = sidebar.output;

        postByDate.allPostsByDate(output);
        output = postByDate.output;
        // console.log("******** CHECK 6 ********")

        // console.log('OUPUT IS *** ', output)

        response.render('index',output);
	},function(err){
		console.log('Error!!!');
		console.log(err)
		response.status(err)
	});
};