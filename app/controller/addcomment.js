var helper = require('../helper/helper')
var app = require('../app')
var authenticate = require('./auth')
var sidebar = require('./sidebar')
var postByDate = require('./postByDate')

exports.addcomment = function(req, res){

    if (!helper.isEmpty(req.body)){
        var comment = req.body.comment;
        var name = req.body.name;
        
        childPostRef = app.postsRef.child(req.body.postId);
        childPostRef.once('value',function(childSnap){
            var comments = null;
            if (!helper.isEmpty(childSnap.val().comments)){
                var comment = [
                    {
                        "name" : req.body.name,
                        "value" : req.body.comment
                    }
                ];
                comments = childSnap.val().comments.concat(comment);
            }else{
                comments = [{
                                "name" : req.body.name,
                                "value" : req.body.comment
                            }];
            }
            childPostRef.update({
                "comments" : comments
            }, function(error){
                if (error){
                    res.json({
                        'error': true
                    })
                }else{
                    res.json({
                        'success': true
                    })
                }
            });
        });
    }
}