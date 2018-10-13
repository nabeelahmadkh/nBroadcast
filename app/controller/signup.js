var helper = require('../helper/helper')
var app = require('../app')
var authenticate = require('./auth')
var sidebar = require('./sidebar')
var postByDate = require('./postByDate')

exports.signupget = function(request, response){
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
        
        response.render('signup', output);
    }
},function(err){
    console.log("THE ERROR IS ",err);
};


exports.signuppost = function(request, response){
    var output = {sidebar: [], postByDate: [], message: null}
    sidebar.mostVisitedPosts(output)
    output = sidebar.output

    postByDate.allPostsByDate(output)
    output = postByDate.output
    app.firebase.auth().createUserWithEmailAndPassword(request.body.username, request.body.password)
        .then(function(){
            app.firebase.auth().signInWithEmailAndPassword(request.body.username, request.body.password)
            .then(function(){
                var user = app.firebase.auth().currentUser;
                user.updateProfile({
                  displayName: request.body.firstname,
                }).then(function() {
                  console.log('Display aNAME UPdated')
                  app.firebase.auth().signOut()
                    .then(function(){
                        console.log('Successfully SignOout')
                    })
                    .catch(function(err){
    
                    })
                }).catch(function(error) {
                  // An error happened.
                });                
            });
            // console.log('CURRENT USER EMAIL ID IS ', user.email);
            output.message = 'User Succesfully registered'
            response.render('login', output);
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            

            output.message = errorCode

            response.render('login', output);
        });
    
};