var helper = require('../helper/helper')
var app = require('../app')
var postByDate = require('./postByDate')
var sidebar = require('./sidebar')

// Category Controller
exports.about = function(request, response){
	var output = {sidebar: [], postByDate: []}
	sidebar.mostVisitedPosts(output)
	output = sidebar.output
	
	postByDate.allPostsByDate(output)
	output = postByDate.output

	response.render('about', output);
};