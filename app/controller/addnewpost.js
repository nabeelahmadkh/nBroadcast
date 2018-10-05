var helper = require('../helper/helper')
var app = require('../app')
var authenticate = require('./auth')
var sidebar = require('./sidebar')

// Add New Post Controller get method
exports.addnewpost = function(request, response){
    console.log('authenticated user is ', authenticate.isAuthenticated(request, response))
    // console.log("Request.url is ", request.url)
    // console.log("session authenticated ", request.session)
    if (authenticate.isAuthenticated(request, response)){
        console.log("in the if case  ")
        // var user = app.firebase.auth().currentUser;
        var user = app.currentUser
        var output = {admin: user, sidebar: []}
        console.log("in the if case  CHECK 2", output)
        sidebar.mostVisitedPosts(output)
        output = sidebar.output
        console.log("in the if case  CHECK 6", output)
        response.render('addPosts', output);
    }
    else{
        console.log("in the else case ")
        var output = {sidebar: []}
        response.redirect('/admin');
    }
    //response.render('addPosts');
},function(err){
    console.log("THE ERROR IS ",err);
}

// Add New Post Controller post method
exports.postaddnewpost = function(req, res){
    res.send('Your post has been updated in the database');
    console.log("in post option");
    console.log("request ", req.body);
    console.log("name ", req.body.name);
    console.log("title ", req.body.title);

    var newData = {
        title: req.body.title,
        name: req.body.name,
        date: req.body.date,
        author: req.body.author,
        category: req.body.category,
        image1: req.body.image,
        preview: req.body.preview,
        tags: req.body.tags,
        viewed: 0,
        content: req.body.content
    }
    app.postsRef.push().set(newData);
    console.log("The post is updated in firebase")
},function(err){
    console.log("THE ERROR IS ",err);
};