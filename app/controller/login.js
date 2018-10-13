var helper = require('../helper/helper')
var app = require('../app')
var authenticate = require('./auth')
var sidebar = require('./sidebar')
var postByDate = require('./postByDate')

exports.loginget = function(request, response){
    console.log("in user login ")

    if (authenticate.isAuthenticated(request, response)){
        console.log("IN THE AUTH OF CASE");
        response.redirect('/');
        console.log("IN THE AUTH OF CASE 2");
    }
    else{
        console.log("*** CHECK 0 *****")
        var output = {sidebar: [], postByDate: []}
        sidebar.mostVisitedPosts(output)
        output = sidebar.output
    
        console.log("*** CHECK 1 *****")
        postByDate.allPostsByDate(output)
        output = postByDate.output
        console.log("*** CHECK 2 *****")
        
        response.render('login', output);
    }
},function(err){
    console.log("THE ERROR IS ",err);
};


exports.loginpost = function(request, response){
    
    app.firebase.auth().signInWithEmailAndPassword(request.body.username, request.body.password)
        .then(function(){
            // Authentication Successful
            var output = {sidebar: [], postByDate: []}
            sidebar.mostVisitedPosts(output)
            output = sidebar.output
        
            postByDate.allPostsByDate(output)
            output = postByDate.output

            console.log("authenticated as user ", request.body.username);
            response.redirect('/');
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            var output = {sidebar: [], postByDate: [], message: errorCode}
            sidebar.mostVisitedPosts(output)
            output = sidebar.output
        
            postByDate.allPostsByDate(output)
            output = postByDate.output

            console.log("error code is ", errorCode)
            console.log("error message is ", errorMessage)
            response.render('login', output);
        }
    );
},function(err){
    console.log("THE ERROR IS ",err);
};