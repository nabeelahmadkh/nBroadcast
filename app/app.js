// Code for Nbroadcast Posts REST APIs
// Written by Nabeel Ahmad Khan
// Last edit on 25/12/2017

// Loading Essential Libraries
var express = require('express');
var firebase = require('firebase');
exports.firebase = firebase
var bodyParser = require('body-parser');
var router = require('./routes/routes');
var helper = require('./helper/helper')
var fs = require('fs');

// Loading Configuration from the keys.json file 
var obj = JSON.parse(fs.readFileSync('keys.json', 'utf8'));

// Initializing Parameters for Posts Pagination
var startFirebase = 1;
var endFirebase = 3;
var flag = 1;  
var totalLength = 0;
var lastKey = ""; //Last key saved the last displayed key of the post for enabling PAGINATION
var startKey = "" //First key for doing pagination
var prestart = ""

// Firebase Configuration can be pulled from Firebase Console
var config = {
	apiKey: obj.apiKey,
	authDomain: obj.authDomain,
	databaseURL: obj.databaseURL,
	storageBucket: obj.storageBucket
};

// Initializing Firebase
var defaultApp = firebase.initializeApp(config);
console.log("Firebase Connected");
console.log(defaultApp.name);

// Ref to Firebase Database created
var postsRef = firebase.database().ref('blogPost');
exports.postsRef = postsRef;

// Initializing Express App
var app = express();
app.set('views', './src/views');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Express.static is used for accessing the static files in the code(like css, javascript files).
// This will make files inside "src/views/css" directory accesible by going to localhost:<port>/file-name.css
// All these files can also be declared in a single directory by the name 'public'
app.use(express.static('./src/views/css'));
app.use(express.static('src/views/vendor/bootstrap/css'));
app.use(express.static('src/views/vendor/bootstrap/js'));
app.use(express.static('src/views/vendor/jquery'));
app.get('/search', router);
app.get('/category', router);
app.get('/viewpost', router);
app.get('/', router);
app.get('/addnewdata', router)
app.post('/addnewdata', router)
app.get('/login', router)
app.post('/login', router)

// Initializing Handelbars
var handlebars = require('express-handlebars');
app.engine('.hbs',handlebars({extension: '.hbs'}));
app.set('view engine','.hbs');

// Setting PORT for the App
var port = (process.env.PORT || 3000);
app.listen(port, function(err){
	console.log("server running on port"+port);
});


// This function will run on starting,
// will count the number of keys on Firebase, 
// and export the number of keys and value of key in app package
postsRef.on('value',function(snap){
	var keys = Object.keys(snap.val());
	totalLength = keys.length;
	exports.numberOfPosts = totalLength;
	exports.keys = keys;
});