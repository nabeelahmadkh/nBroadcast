var helper = require('../helper/helper')
var app = require('../app')
var postByDate = require('./postByDate')
var sidebar = require('./sidebar')


exports.logoutget = function(request, response){
    console.log("in admin logout ")
    app.firebase.auth().signOut()
        .then(function(){
            var output = {message: 'User Successfully Logged Out', sidebar: [], postByDate: []}
            sidebar.mostVisitedPosts(output)
            output = sidebar.output
            
            postByDate.allPostsByDate(output)
            output = postByDate.output

            response.render('admin', output);
        })
        .catch(function(err){
            var output = {message: err, sidebar: [], postByDate: []}
            sidebar.mostVisitedPosts(output)
            output = sidebar.output
            
            postByDate.allPostsByDate(output)
            output = postByDate.output

            response.render('admin', output);
        })
},function(err){
    console.log("THE ERROR IS ",err);
};