// Code for entering the blogs in the Firebase Database.
// 

var express = require('express');
var firebase = require('firebase');
var bodyParser = require('body-parser');

var config = {
	apiKey: "AIzaSyC-d8dYJrCubsmFdYn2FKDcq1jhwA9PE3I",
	authDomain: "blogproject-f3538.firebaseapp.com",
	databaseURL: "https://blogproject-f3538.firebaseio.com",
	storageBucket: "blogproject-f3538.appspot.com"
};

// Initializing Firebase App
var defaultApp = firebase.initializeApp(config);
var postsRef = firebase.database().ref('blogPost');



var app = express();
app.set('views', './src/views');
var port = (process.env.PORT || 3000);
var router = express.Router(); 
app.use(express.static('./src/views/'));
var handlebars = require('express-handlebars');
app.engine('.hbs',handlebars({extension: '.hbs'}));
app.set('view engine','.hbs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


// Default Path for using postsRouter 
app.use('/',router); // now books will be accesible through /api/books link, as the bankRouter is using /api as its base


app.listen(port, function(err){
	console.log("server running on port"+port);
});


router.route('/form')
    .get(function(request, response){
        console.log("Welcome to the home page");
        response.render('addPosts');
    },function(err){
        console.log("THE ERROR IS ",err);
    })

    // Will receive a post request when the user submits a post.
    .post(function(req, res){
        //console.log("the request is ",req);
        console.log("THE POST NAME IS ",req.body);
        console.log("Submit Post has been initiated");
        res.send('Your post has been updated in the database');

        //var key = postsRef.push().key();
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
        
        postsRef.push().set(newData);
        console.log("THE POST IS ADDED TO THE FIREBASE DATABASE ");

    },function(err){
        console.log("THE ERROR IS ",err);
    });