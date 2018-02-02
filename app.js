//import { json } from '../../../Library/Caches/typescript/2.6/node_modules/@types/body-parser';

// import { print } from 'util';

// Code for Nbroadcast Posts REST APIs
// Written by Nabeel Ahmad Khan
// Last edit on 25/12/2017


var express = require('express');
var firebase = require('firebase');
var startFirebase = 1;
var endFirebase = 3;
var flag = 1;
var totalLength = 0;
var lastKey = ""; //Last key saved the last displayed key of the post for enabling PAGINATION
var startKey = "" //First key for doing pagination 
var prestart = ""




// Firebase Configuration can be pulled from Firebase Console
var config = {
	apiKey: "AIzaSyC-d8dYJrCubsmFdYn2FKDcq1jhwA9PE3I",
	authDomain: "blogproject-f3538.firebaseapp.com",
	databaseURL: "https://blogproject-f3538.firebaseio.com",
	storageBucket: "blogproject-f3538.appspot.com"
};

// Initializing Firebase App
var defaultApp = firebase.initializeApp(config);
console.log("Firebase Connected");
console.log(defaultApp.name);

// Function for checking wheather the object has a value or not.
function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj == null) return true;
 
    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length && obj.length > 0)    return false;
    if (obj.length === 0)  return true;
 
    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and toValue enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
 
    return true;
}

// To convert Firebase JSON Object to array
function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        //item.key = childSnapshot.key;
		//console.log("ITEM CONTENT");			
		//console.log(item.content);
		returnArr.push({content: item.content, date: item.date, title: item.title, preview: item.preview, author: item.author, name: item.name, image: item.image1, key: item.key});
		console.log(" SNAPSHOT KEY IS ",item.key);
		//console.log("SNAPSHOT ARRAY  ")
		//console.log(returnArr)
	});

    return returnArr;
};

function searchquery(snapshot, searchQuery){
	var returnArr = [];
	console.log("IN THE SEARCHQUERY FUNCTION");
	snapshot.forEach(function(childSnapshot){
		console.log("IN THE FOR LOOP ",searchQuery);
		//console.log(childSnapshot.val());
		var item = childSnapshot.val();
		var mainStr = item.tags;
		//var buf = Buffer.from(mainStr);
		console.log("MAINSTRING & SUBSTRING ARE ",mainStr, searchQuery);
		if(mainStr.indexOf(searchQuery) > -1) {
			//console.log("SEARCHED ITEM ",item);
			returnArr.push({content: item.content, date: item.date, title: item.title, preview: item.preview, author: item.author, name: item.name, image: item.image1});

		}
	});
	return returnArr;
};

function contentJsonToArray(snapshot){
	var returnArr = [];
	//console.log(snapshot.val());
	console.log(snapshot);

	var item = snapshot;

	returnArr.push({para: item.para1}, {para: item.para2}, {para: item.para3});

	return returnArr;
};
 
// Ref to Firebase Database created
var postsRef = firebase.database().ref('blogPost');

var app = express();
app.set('views', './src/views');

// Express.static is used for accessing the static files in the code(like css, javascript files).
// This will make files inside "src/views/css" directory accesible by going to localhost:<port>/file-name.css
// All these files can also be declared in a single directory by the name 'public'
app.use(express.static('./src/views/css'));
app.use(express.static('src/views/vendor/bootstrap/css'));
app.use(express.static('src/views/vendor/bootstrap/js'));
app.use(express.static('src/views/vendor/jquery'));



var handlebars = require('express-handlebars');
app.engine('.hbs',handlebars({extension: '.hbs'}));

app.set('view engine','.hbs');

var port = (process.env.PORT || 3000);

postsRef.on('value',function(snap){
	//console.log("ALL THE POSTS ARE ",snap.val());
	var jsonContent = snapshotToArray(snap);
	totalLength = jsonContent.length;
	console.log("TOTAL LENGTH IS ",totalLength);
});

// Create a Router 
var postsRouter = express.Router();
postsRouter.route('/allposts') // books route
	.get(function(req,res){
		//var responseJson = {hello: "Welcome to API"};
		//res.json(responseJson);

		// listenign to value event of FireBase which will get all the data from the Firebase Database
		// and displaying the response intially.
		
		var query = req.query.post; // this will contain a query send from the browser. by using <server-address>/allposts?post=search_term

		// If the user search for a post in the browser then If case will run
		if (!isEmpty(query)){
			childPostRef = postsRef.child(query)
			console.log("in the IF CASE")
			console.log(query)
			childPostRef.once('value',function(childSnap){
				//console.log(childSnap.val());
				//res.json(childSnap.val());
				//var jsonContent = snapshotToArray(childSnap);
				if(!isEmpty(childSnap.val())){
					console.log("IN THE CHILD SNAP TEST CASE 111");
					var output = {title: childSnap.val().title, content: childSnap.val().content, date: childSnap.val().date, author: childSnap.val().author};
					
					console.log("JSON OUTPUT VALUE");
					//console.log(output.content);
					var testArray = contentJsonToArray(output.content);

					//console.log(testArray);
					console.log(testArray.length);
					var newOutput = {title: childSnap.val().title, content: testArray, date: childSnap.val().date, author: childSnap.val().author};
					//console.log("NEW OUTPUPT  ",output);
					res.render('post', output);

					// Incrementing the view counter by 1 as someone views the post.
					childPostRef.child('viewed').once('value',function(childSnap){
						//console.log("THE VALUE OF VIEWED IS ",childSnap.val());
						var view = childSnap.val() + 1;
						childPostRef.update({viewed: view});
						//console.log("THE VIEWED VALUE HAS BEEN UPDATED TO ",view);
					});
				}
				else{
					console.log("IN THE CHILD SNAP TEST CASE 222");
					postsRef.once('value',function(snap){
						// printing the data in the console retrieved from the Firebase
						//console.log(snap.val());
						res.json(snap.val());
					},function(err){
						// printing the error in Firebase
						console.log('Error!!!');
						console.log(err)
						res.status(err) // returning the error status to the web page
					});
				}
			},function(err){
				console.log(err);
				res.status(err);
			});
		}
		// This will run when the user runs <server-address>/allposts/
		else{
		// Firebase Function for getting the value and returning it in the response.
		// 'value' is the event that listens to any change in the Firebase Database 
			console.log("in the ELSE CASE")
			postsRef.once('value',function(snap){
				// printing the data in the console retrieved from the Firebase
				//console.log(snap.val());
				res.send("Web Page not available");
			},function(err){
				// printing the error in Firebase
				console.log('Error!!!');
				console.log(err)
				res.status(err) // returning the error status to the web page
			});
		}	
	});



// Creating a base routing path, you can see in the next block we are using /api as our base for the call 
app.get('/', function(request, response){
	//response.send("Welcome to Nbroadcast API");
	//response.render('index');
	
	var query = request.query.post;

	if(!isEmpty(query)){
		console.log("IN THE IF CASE OF OLDER QUERIES");
		console.log(query);
		if (query == "older"){
			//if (startFirebase <=3){
			if(startFirebase < totalLength){
				startFirebase += 3;
				//endFirebase += 3
				var newer = 'page-item';
				if(startFirebase >= totalLength){
					var older = 'page-item disabled';
				}else{
					var older = 'page-item';
				}
			}
		}else{
			if (startFirebase > 1){
				startFirebase -= 3;
				//endFirebase -= 3;
				if (startFirebase == 1){
					var newer = 'page-item disabled';
					var older = 'page-item';
				}
			}
		}
		
		if (query == "older"){
			//postsRef.orderByChild('asc').startAt(startFirebase).limitToFirst(endFirebase).once('value',function(snap){
			postsRef.orderByKey().endAt(lastKey).limitToLast(4).once('value',function(snap){
				var jsonContent = snapshotToArray(snap);

				console.log("ALL THE POSTS ARE ",snap.val());
				var jsonLength = jsonContent.length;
				var output = {posts: [],newer: newer, older: older, sidebar: []};
				
				var temp = 3
				if (jsonLength == 4){
					temp = 2;
				}
				else if(jsonLength == 3){
					temp = 2;
				}
				else if(jsonLength == 2){
					temp = 1;
				}
				else{
					temp = 0;
				}
				//for(var i = 0; i < jsonLength; i ++){
				for(var i = temp; i >= 0; i --){
					console.log("IN THE FOR LOOP ");
					output.posts.push({title: jsonContent[i].title, preview: jsonContent[i].preview, date: jsonContent[i].date, name: jsonContent[i].name, author: jsonContent[i].author, image: jsonContent[i].image, key: jsonContent[i].key});
				}
				startKey = prestart;
				prestart = jsonContent[temp + 1];
				lastKey = jsonContent[temp].key;
				postsRef.orderByChild('viewed').limitToLast(3).once('value', function(childSnap){
					var content = snapshotToArray(childSnap);
					var len = content.length;
					for(var j = len-1; j >= 0; j--){
						output.sidebar.push({title: content[j].title, name: content[j].name, key: content[j].key});
					}
					console.log("THE OUTPUT RENDERED IS ",output);	
					response.render('index',output);
				});
			},function(err){
				console.log(err);
				response.status(err);
			});
		}
	}
	else{
		var newer = 'page-item disabled';
		var older = 'page-item';

		// passing all the values in the home page
		console.log("in the ELSE CASE OF / PATH ")
		//postsRef.limitToFirst(3).once('value',function(snap){
		// order by child will order the results by the "asc" key. 
		postsRef.orderByKey().limitToLast(4).once('value',function(snap){
			// printing the data in the console retrieved from the Firebase
			console.log("ORIGINAL DATA FROM FIREBASE");
			//console.log(snap.val());
			var jsonContent = snapshotToArray(snap);

			//console.log("ALL THE POSTS ARE ",snap.val());
			var length = jsonContent.length;
			var output = {posts: [], newer: newer,older: older, sidebar: []};
			//for(var i = 0; i < length; i ++){
			for(var i = length-1; i > 0; i --){
				console.log("IN THE FOR LOOP ");
				output.posts.push({title: jsonContent[i].title, preview: jsonContent[i].preview, date: jsonContent[i].date, name: jsonContent[i].name, author: jsonContent[i].author, image: jsonContent[i].image, key: jsonContent[i].key, key: jsonContent[i].key});
				console.log("the title is ---  ",jsonContent[i].title);
			}
			lastKey = jsonContent[0].key;
			prestart = jsonContent[length-1].key;
			console.log("THE LAST KEY IS ====== ",lastKey);

			postsRef.orderByChild('viewed').limitToLast(3).once('value', function(childSnap){
				var content = snapshotToArray(childSnap);
				var len = content.length;
				for(var j = len-1; j >= 0; j--){
					output.sidebar.push({title: content[j].title, name: content[j].name, key: content[j].key});
				}
				console.log("THE OUTPUT RENDERED IS ",output);	
				response.render('index',output);
			});
			
		
		},function(err){
			// printing the error in Firebase
			console.log('Error!!!');
			console.log(err)
			response.status(err) // returning the error status to the web page
		});
	}
});

app.get('/search',function(request, response){
	console.log("IN THE SEARCH FUNCTION");
	var query = request.query.searchquery;
	console.log("SEARCH QUERY IS ",query);
	if(!isEmpty(query)){
		postsRef.once('value',function(snap){
			console.log("ALL THE POSTS ARE ",snap.val());
			var jsonContent = searchquery(snap, query);
			var length = jsonContent.length;
			var testOutput = {posts: []};
			for(var i = 0; i < length; i ++){
				console.log("IN THE FOR LOOP ");
				testOutput.posts.push({title: jsonContent[i].title, preview: jsonContent[i].preview, date: jsonContent[i].date, name: jsonContent[i].name, author: jsonContent[i].author});
			}
			testOutput.category = "Search results for '"+query+"' are:";
			response.render("searchresults",testOutput);
		});
	}
	else{
		response.render('errorpage');
	}
});


app.get('/category', function(request, response){
	var query = request.query.category;
	if(!isEmpty(query)){
		postsRef.orderByChild('category').equalTo(query).once('value',function(snap){
			//console.log(snap.val());
			var jsonContent = snapshotToArray(snap);
			var length = jsonContent.length
			console.log("LENGTH OF JSONCONTENT IS ",length);
			var testOutput = {posts: []};
			for(var i = 0; i < length; i ++){
				console.log("IN THE FOR LOOP ");
				testOutput.posts.push({title: jsonContent[i].title, preview: jsonContent[i].preview, date: jsonContent[i].date, name: jsonContent[i].name, author: jsonContent[i].author});
			}
			if (length != 0){
				query = query[0].toUpperCase() + query.slice(1);
				query += " posts"
				testOutput.category =  query;
			}else{
				testOutput.category = "No result";
			}
			console.log("TEST OUTPUT IS EQUAL TO ",testOutput);
			// var output = {posts:[
			// 						{title: jsonContent[0].title, preview: jsonContent[0].preview, date: jsonContent[0].date, name: jsonContent[0].name, author: jsonContent[0].author}, 
			// 						{title: jsonContent[1].title, preview: jsonContent[1].preview, date: jsonContent[1].date, name: jsonContent[1].name, author: jsonContent[1].author},
			// 						{title: jsonContent[2].title, preview: jsonContent[2].preview, date: jsonContent[2].date, name: jsonContent[2].name, author: jsonContent[2].author}
			// 						//{title: jsonContent[3].title, preview: jsonContent[3].preview, date: jsonContent[3].date, name: jsonContent[3].name, author: jsonContent[3].author},
			// 						//{title: jsonContent[4].title, preview: jsonContent[4].preview, date: jsonContent[4].date, name: jsonContent[4].name, author: jsonContent[4].author}
			// 					],
			// 				category: query
			// 			 };
			response.render('categories', testOutput);
		});
	}else{
		postsRef.limitToFirst(10).once('value',function(snap){
			console.log(snap.val());
			response.json(snap.val());
		});
	}
});

// Default Path for using postsRouter
app.use('/',postsRouter); // now books will be accesible through /api/books link, as the bankRouter is using /api as its base


app.listen(port, function(err){
	console.log("server running on port"+port);
});