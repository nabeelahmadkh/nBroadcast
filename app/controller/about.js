var helper = require('../helper/helper')
var app = require('../app')
var postByDate = require('./postByDate')
var sidebar = require('./sidebar')

// Category Controller
exports.about = function(request, response){
	var output = {sidebar: [], postByDate: [], user: null}

	if (app.firebase.auth().currentUser){
		console.log(' CURRENT ISRE IS IS ', app.firebase.auth().currentUser.displayName)
		output.user = app.firebase.auth().currentUser.displayName;
	}

	sidebar.mostVisitedPosts(output)
	output = sidebar.output
	
	postByDate.allPostsByDate(output)
	output = postByDate.output

	response.render('about', output);
};