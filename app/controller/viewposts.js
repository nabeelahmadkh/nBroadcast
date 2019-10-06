var helper = require('../helper/helper')
var app = require('../app')
var postByDate = require('./postByDate')
var sidebar = require('./sidebar')

// ViewPost Controller for Rendering the posts
exports.viewposts = function(req,res){
    var query = req.params.id;
    console.log("request recieved");

    var postsRef = app.postsRef.orderByChild("id").equalTo(query).limitToFirst(1).on("child_added", function(childSnap){
        var comments = childSnap.val().comments !== undefined ? childSnap.val().comments.reverse() : null;
        
        var output = {title: childSnap.val().title, content: childSnap.val().content, date: childSnap.val().date, author: childSnap.val().author, sidebar: [], postByDate: [], user: null, tags: [], postId: query, comments: comments};
        
        if (app.firebase.auth().currentUser){
            output.user = app.firebase.auth().currentUser.displayName;
        }
        
        var testArray = helper.contentJsonToArray(output.content);
        var newOutput = {title: childSnap.val().title, content: testArray, date: childSnap.val().date, author: childSnap.val().author};
        
        // Incrementing the view counter by 1 as someone views the post.
        childPostRef = app.postsRef.child(childSnap.key);
        childPostRef.child('viewed').once('value',function(childSnap){
            var view = childSnap.val() + 1;
            childPostRef.update({viewed: view});
        });

        // Add tags to the output object 
        var tags = childSnap.val().tags.split(", ");
        output.tags = tags


        sidebar.mostVisitedPosts(output)
        output = sidebar.output
        
        postByDate.allPostsByDate(output)
        output = postByDate.output

        console.log("request responded");
        res.render('post', output);
    });
};