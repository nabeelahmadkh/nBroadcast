// // Creating a base routing path, you can see in the next block we are using /api as our base for the call 
// app.get('/', function(request, response){
// 	//response.send("Welcome to Nbroadcast API");
// 	//response.render('index');
	
// 	var query = request.query.post;

// 	if(!isEmpty(query)){
// 		console.log("IN THE IF CASE OF OLDER QUERIES");
// 		console.log(query);
// 		if (query == "older"){
// 			//if (startFirebase <=3){
// 			if(startFirebase < totalLength){
// 				startFirebase += 3;
// 				//endFirebase += 3
// 				var newer = 'page-item';
// 				if(startFirebase >= totalLength){
// 					var older = 'page-item disabled';
// 				}else{
// 					var older = 'page-item';
// 				}
// 			}
// 		}else{
// 			if (startFirebase > 1){
// 				startFirebase -= 3;
// 				//endFirebase -= 3;
// 				if (startFirebase == 1){
// 					var newer = 'page-item disabled';
// 					var older = 'page-item';
// 				}
// 			}
// 		}
		
// 		if (query == "older"){
// 			//postsRef.orderByChild('asc').startAt(startFirebase).limitToFirst(endFirebase).once('value',function(snap){
// 			postsRef.orderByKey().endAt(lastKey).limitToLast(4).once('value',function(snap){
// 				var jsonContent = snapshotToArray(snap);

// 				console.log("ALL THE POSTS ARE ",snap.val());
// 				var jsonLength = jsonContent.length;
// 				var output = {posts: [],newer: newer, older: older, sidebar: []};
				
// 				var temp = 3
// 				if (jsonLength == 4){
// 					temp = 2;
// 				}
// 				else if(jsonLength == 3){
// 					temp = 2;
// 				}
// 				else if(jsonLength == 2){
// 					temp = 1;
// 				}
// 				else{
// 					temp = 0;
// 				}
// 				//for(var i = 0; i < jsonLength; i ++){
// 				for(var i = temp; i >= 0; i --){
// 					console.log("IN THE FOR LOOP ");
// 					output.posts.push({title: jsonContent[i].title, preview: jsonContent[i].preview, date: jsonContent[i].date, name: jsonContent[i].name, author: jsonContent[i].author, image: jsonContent[i].image, key: jsonContent[i].key});
// 				}
// 				startKey = prestart;
// 				prestart = jsonContent[temp + 1];
// 				lastKey = jsonContent[temp].key;
// 				postsRef.orderByChild('viewed').limitToLast(3).once('value', function(childSnap){
// 					var content = snapshotToArray(childSnap);
// 					var len = content.length;
// 					for(var j = len-1; j >= 0; j--){
// 						output.sidebar.push({title: content[j].title, name: content[j].name, key: content[j].key});
// 					}
// 					console.log("THE OUTPUT RENDERED IS ",output);	
// 					response.render('index',output);
// 				});
// 			},function(err){
// 				console.log(err);
// 				response.status(err);
// 			});
// 		}
// 	}
// 	else{
// 		var newer = 'page-item disabled';
// 		var older = 'page-item';

// 		// passing all the values in the home page
// 		console.log("in the ELSE CASE OF / PATH ")
// 		//postsRef.limitToFirst(3).once('value',function(snap){
// 		// order by child will order the results by the "asc" key. 
// 		postsRef.orderByKey().limitToLast(4).once('value',function(snap){
// 			// printing the data in the console retrieved from the Firebase
// 			console.log("ORIGINAL DATA FROM FIREBASE");
// 			//console.log(snap.val());
// 			var jsonContent = snapshotToArray(snap);

// 			//console.log("ALL THE POSTS ARE ",snap.val());
// 			var length = jsonContent.length;
// 			var output = {posts: [], newer: newer,older: older, sidebar: []};
// 			//for(var i = 0; i < length; i ++){
// 			for(var i = length-1; i > 0; i --){
// 				console.log("IN THE FOR LOOP ");
// 				output.posts.push({title: jsonContent[i].title, preview: jsonContent[i].preview, date: jsonContent[i].date, name: jsonContent[i].name, author: jsonContent[i].author, image: jsonContent[i].image, key: jsonContent[i].key, key: jsonContent[i].key});
// 				console.log("the title is ---  ",jsonContent[i].title);
// 			}
// 			lastKey = jsonContent[0].key;
// 			prestart = jsonContent[length-1].key;
// 			console.log("THE LAST KEY IS ====== ",lastKey);

// 			postsRef.orderByChild('viewed').limitToLast(3).once('value', function(childSnap){
// 				var content = snapshotToArray(childSnap);
// 				var len = content.length;
// 				for(var j = len-1; j >= 0; j--){
// 					output.sidebar.push({title: content[j].title, name: content[j].name, key: content[j].key});
// 				}
// 				console.log("THE OUTPUT RENDERED IS ",output);	
// 				response.render('index',output);
// 			});
			
		
// 		},function(err){
// 			// printing the error in Firebase
// 			console.log('Error!!!');
// 			console.log(err)
// 			response.status(err) // returning the error status to the web page
// 		});
// 	}
// });




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
                var output = {title: childSnap.val().title, content: childSnap.val().content, date: childSnap.val().date, author: childSnap.val().author, sidebar: []};
                //var output = {posts: [], sidebar: []};
                console.log("JSON OUTPUT VALUE");
                //console.log(output.content);
                var testArray = contentJsonToArray(output.content);

                //console.log(testArray);
                console.log(testArray.length);
                var newOutput = {title: childSnap.val().title, content: testArray, date: childSnap.val().date, author: childSnap.val().author};
                //console.log("NEW OUTPUPT  ",output);
                

                // Incrementing the view counter by 1 as someone views the post.
                childPostRef.child('viewed').once('value',function(childSnap){
                    //console.log("THE VALUE OF VIEWED IS ",childSnap.val());
                    var view = childSnap.val() + 1;
                    childPostRef.update({viewed: view});
                    //console.log("THE VIEWED VALUE HAS BEEN UPDATED TO ",view);
                });
                postsRef.orderByChild('viewed').limitToLast(3).once('value', function(childSnap){
                    var content = snapshotToArray(childSnap);
                    var len = content.length;
                    for(var j = len-1; j >= 0; j--){
                        output.sidebar.push({title: content[j].title, name: content[j].name, key: content[j].key});
                    }
                    console.log("THE OUTPUT RENDERED IS ",output);	
                    res.render('post', output);
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


// // Default Path for using postsRouter
// app.use('/',postsRouter); // now books will be accesible through /api/books link, as the bankRouter is using /api as its base
