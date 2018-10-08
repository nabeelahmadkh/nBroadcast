var helper = require('../helper/helper')
var app = require('../app')
var authenticate = require('./auth')
var sidebar = require('./sidebar')
var postByDate = require('./postByDate')

exports.loginget = function(request, response){
    console.log("in admin login ")
    var output = {sidebar: [], postByDate: []}
    sidebar.mostVisitedPosts(output)
    output = sidebar.output

    postByDate.allPostsByDate(output)
    output = postByDate.output
    
    response.render('login', output);
},function(err){
    console.log("THE ERROR IS ",err);
};


exports.loginpost = function(request, response){
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