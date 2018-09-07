var express = require('express');
var router = express.Router();

// Importing Controller
var search_controller = require('../controller/search');
var category_controller = require('../controller/category');
var homepage_controller = require('../controller/homepage')
var viewpost_controller = require('../controller/viewpost') 
var addnewpost_controller = require('../controller/addnewpost') 

// Creating Routes, Add new Routes below
router.get('/', homepage_controller.homepage);
router.get('/search', search_controller.search_get);
router.get('/category', category_controller.category);
router.get('/viewpost', viewpost_controller.viewpost);
router.get('/addnewdata', addnewpost_controller.addnewpost);
router.post('/addnewdata', addnewpost_controller.postaddnewpost);

// Exporting Router Module to be imported in app.js
module.exports = router;