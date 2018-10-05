var helper = require('../helper/helper')
var app = require('../app')
var authenticate = require('./auth')


exports.adminget = function(request, response){
    console.log("in admin login ")
    
    app.postsRef.orderByChild('viewed').limitToLast(3).once('value', function(childSnap){
        var content = helper.snapshotToArray(childSnap);
        var len = content.length;

        // Adding Popular Posts
        var output = {sidebar: []};
        for(var j = len-1; j >= 0; j--){
            output.sidebar.push({title: content[j].title, name: content[j].name, key: content[j].key});
        }
        response.render('admin', output);
    });
},function(err){
    console.log("THE ERROR IS ",err);
};


exports.adminpost = function(request, response){
    app.firebase.auth().signInWithEmailAndPassword(request.body.username, request.body.password)
        .then(function(){
            // Authentication Successful
            console.log("authenticated as user ", request.body.username);
            response.redirect('/addnewdata')
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            console.log("error code is ", errorCode)
            console.log("error message is ", errorMessage)
            response.render('admin');
        }
    );

      
      //response.render('addPosts', output); 
},function(err){
    console.log("THE ERROR IS ",err);
};