var helper = require('../helper/helper')
var app = require('../app')
var authenticate = require('./auth')
var sidebar = require('./sidebar')
var postByDate = require('./postByDate')


exports.adminget = function(request, response){
    if (authenticate.isAuthenticated(request, response) && app.currentUser == 'nabeelahmadkh@gmail.com'){
        response.redirect('/addnewdata');
    }
    else{
        console.log("in admin login ")
        var output = {sidebar: [], postByDate: []}
        sidebar.mostVisitedPosts(output)
        output = sidebar.output
        
        postByDate.allPostsByDate(output)
        output = postByDate.output
        
        response.render('admin', output);
    }
},function(err){
    console.log("THE ERROR IS ",err);
};


exports.adminpost = function(request, response){
    if (request.body.username == 'nabeelahmadkh@gmail.com'){
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
            
            var output = {sidebar: [], message: errorCode}
            output = sidebar.mostVisitedPosts(output)
            output = sidebar.output

            postByDate.allPostsByDate(output)
            output = postByDate.output

            console.log("error code is ", errorCode)
            console.log("error message is ", errorMessage)
            response.render('admin', output);
        });
    }
    else{
        
        var output = {sidebar: [], message: 'Wrong Username'}
        output = sidebar.mostVisitedPosts(output)
        output = sidebar.output

        postByDate.allPostsByDate(output)
        output = postByDate.output
        response.render('admin', output);
    }  
},function(err){
    console.log("THE ERROR IS ",err);
};