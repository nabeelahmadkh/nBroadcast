var helper = require('../helper/helper')
var app = require('../app')
var postByDate = require('./postByDate')
var sidebar = require('./sidebar')

// ViewPost Controller for Rendering the posts 
exports.viewpost = function(req,res){
    var query = req.query.post;

    if (!helper.isEmpty(query)){
        console.log("query is ", query);
        childPostRef = app.postsRef.child(query)
        childPostRef.once('value',function(childSnap){
            if(!helper.isEmpty(childSnap.val())){
                var comments = childSnap.val().comments !== undefined ? childSnap.val().comments.reverse() : null;
                
                var output = {title: childSnap.val().title, content: childSnap.val().content, date: childSnap.val().date, author: childSnap.val().author, sidebar: [], postByDate: [], user: null, tags: [], postId: query, comments: comments};

                if (app.firebase.auth().currentUser){
                    console.log(' CURRENT ISRE IS IS ', app.firebase.auth().currentUser.displayName)
                    output.user = app.firebase.auth().currentUser.displayName;
                }
                
                var testArray = helper.contentJsonToArray(output.content);
                var newOutput = {title: childSnap.val().title, content: testArray, date: childSnap.val().date, author: childSnap.val().author};

                // Incrementing the view counter by 1 as someone views the post.
                childPostRef.child('viewed').once('value',function(childSnap){
                    var view = childSnap.val() + 1;
                    childPostRef.update({viewed: view});
                });

                // Add tags to the output object 
                console.log("\n TAGS ARE : ", childSnap.val().tags);
                var tags = childSnap.val().tags.split(", ");
                console.log("\n TAGS ARRAY IS ", tags);
                output.tags = tags


                sidebar.mostVisitedPosts(output)
                output = sidebar.output
                
                postByDate.allPostsByDate(output)
                output = postByDate.output

                console.log("Output is ", output);
                res.render('post', output);
            }
            else{
                console.log("IN THE CHILD SNAP TEST CASE 222");
                app.postsRef.once('value',function(snap){
                    res.json(snap.val());
                },function(err){
                    res.status(err)
                });
            }
        },function(err){
            console.log(err);
            res.status(err);
        });
    }
    else{
        app.postsRef.once('value',function(snap){
            res.send("Web Page not available");
        },function(err){
            console.log('Error!!!');
            console.log(err)
            res.status(err)
        });
    }
};