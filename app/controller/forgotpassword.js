var helper = require('../helper/helper')
var app = require('../app')
var authenticate = require('./auth')
var sidebar = require('./sidebar')
var postByDate = require('./postByDate')

exports.forgotpaswordget = function(request, response){
    console.log("in forgot password ")
    var emailAddress = "user@example.com";
    var output = {sidebar: [], postByDate: []}
    sidebar.mostVisitedPosts(output)
    output = sidebar.output

    postByDate.allPostsByDate(output)
    output = postByDate.output

    response.render('forgotpassword', output)
    
},function(err){
    console.log("THE ERROR IS ",err);
};


exports.forgotpaswordpost = function(request, response){
    
    var auth = app.firebase.auth();
    console.log('EMAIL ID IS ', request.body.username)
    var emailAddress = request.body.username;
    var output = {sidebar: [], message: "",postByDate: []}
    
    sidebar.mostVisitedPosts(output)
    output = sidebar.output

    postByDate.allPostsByDate(output)
    output = postByDate.output

    auth.sendPasswordResetEmail(emailAddress).then(function() {    
        output.message = "Reset Link is Successfully sent to your Email ID. Kindly reset your id by going to that link"
        response.render('admin', output)
    }).catch(function(error) {
        output.message = error
        response.render('admin', output)
    });
},function(err){
    console.log("THE ERROR IS ",err);
};