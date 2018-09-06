var express = require('express');
var router = express.Router();

// Importing Controller
var search_controller = require('../controller/search');
var category_controller = require('../controller/category');
var homepage_controller = require('../controller/homepage')


// Creating Routes, Add new Routes below
router.get('/', homepage_controller.homepage);
router.get('/search', search_controller.search_get);
router.get('/category', category_controller.category);

// Exporting Router Module to be imported in app.js
module.exports = router;