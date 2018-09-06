// Code for Nbroadcast Posts REST APIs
// Written by Nabeel Ahmad Khan
// Last edit on 25/12/2017

// Loading Essential Libraries
var express = require('express');
var firebase = require('firebase');
var router = require('./routes/routes');
var helper = require('./helper/helper')

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
	apiKey: "AIzaSyC-d8dYJrCubsmFdYn2FKDcq1jhwA9PE3I",
	authDomain: "blogproject-f3538.firebaseapp.com",
	databaseURL: "https://blogproject-f3538.firebaseio.com",
	storageBucket: "blogproject-f3538.appspot.com"
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

// Express.static is used for accessing the static files in the code(like css, javascript files).
// This will make files inside "src/views/css" directory accesible by going to localhost:<port>/file-name.css
// All these files can also be declared in a single directory by the name 'public'
app.use(express.static('./src/views/css'));
app.use(express.static('src/views/vendor/bootstrap/css'));
app.use(express.static('src/views/vendor/bootstrap/js'));
app.use(express.static('src/views/vendor/jquery'));
app.get('/search', router);
app.get('/category', router);
app.get('/', router);

// Initializing Handelbars
var handlebars = require('express-handlebars');
app.engine('.hbs',handlebars({extension: '.hbs'}));
app.set('view engine','.hbs');

// Setting PORT for the App
var port = (process.env.PORT || 3000);
app.listen(port, function(err){
	console.log("server running on port"+port);
});

// Create a Router 
var postsRouter = express.Router();

////////////////////////////////////////////////////////////////// 
// HELPER FUNCTIONS///////////////////////////////////////////////
// Function for checking wheather the object has a value or not.
function contentJsonToArray(snapshot){
	var returnArr = [];
	var item = snapshot;
	returnArr.push({para: item.para1}, {para: item.para2}, {para: item.para3});
	return returnArr;
};
////////////////////////////////////////////////////////////////// 
 

// This function will run on starting, 
// will count the number of posts on Firebase, 
// and display there Key 
postsRef.on('value',function(snap){
	var jsonContent = helper.snapshotToArray(snap);
	totalLength = jsonContent.length;
	console.log("TOTAL LENGTH IS ",totalLength);
});



