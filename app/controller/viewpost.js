var helper = require('../helper/helper')
var app = require('../app')
var postByDate = require('./postByDate')
var sidebar = require('./sidebar')

// ViewPost Controller for Rendering the posts 
exports.viewpost = function(req,res){
    var query = req.query.post; 

    if (!helper.isEmpty(query)){
        childPostRef = app.postsRef.child(query)
        childPostRef.once('value',function(childSnap){
            if(!helper.isEmpty(childSnap.val())){
                var output = {title: childSnap.val().title, content: childSnap.val().content, date: childSnap.val().date, author: childSnap.val().author, sidebar: [], postByDate: []};
                var testArray = helper.contentJsonToArray(output.content);
                var newOutput = {title: childSnap.val().title, content: testArray, date: childSnap.val().date, author: childSnap.val().author};

                // Incrementing the view counter by 1 as someone views the post.
                childPostRef.child('viewed').once('value',function(childSnap){
                    var view = childSnap.val() + 1;
                    childPostRef.update({viewed: view});
                });

                sidebar.mostVisitedPosts(output)
                output = sidebar.output
                
                postByDate.allPostsByDate(output)
                output = postByDate.output

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