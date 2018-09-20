var helper = require('../helper/helper')
var app = require('../app')
var authenticate = require('./auth')


exports.loginget = function(request, response){
    console.log("in login ")
    response.render('login');
},function(err){
    console.log("THE ERROR IS ",err);
};


exports.loginpost = function(request, response){
    app.firebase.auth().signInWithEmailAndPassword(request.body.username, request.body.password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log("error code is ", errorCode)
        console.log("error message is ", errorMessage)
        response.render('login');
      });

      // Authentication Successful
      console.log("authenticated as user ", request.body.username);
      response.render('addPosts');      
},function(err){
    console.log("THE ERROR IS ",err);
};