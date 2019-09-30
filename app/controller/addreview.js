var helper = require('../helper/helper')
var app = require('../app')
var authenticate = require('./auth')
var sidebar = require('./sidebar')
var postByDate = require('./postByDate')

// Add New Review post method
exports.addReview = function(req, res){
    console.log("in post option");
    console.log("request ", req.body);
    console.log("name ", req.body.name);
    console.log("comment ", req.body.comment);
    console.log("post ID is ", req.body.postID);
    
    if (req.body.postID != null & req.body.name != null & req.body.comment != null){
        var review = {
            name : req.body.name,
            comment : req.body.comment
        }
    
        var postReference = postsRef.child(req.body.postID);
    
        app.postReference.push().update(newData);
        res.send('Your review is updated.');
        console.log("Review updated in firebase");
    }else{
        // send error response 
    }
},function(err){
    console.log("THE ERROR IS ",err);
};