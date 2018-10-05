var express = require('express');
var router = express.Router();

// Importing Controller
var search_controller = require('../controller/search');
var category_controller = require('../controller/category');
var homepage_controller = require('../controller/homepage');
var viewpost_controller = require('../controller/viewpost');
var addnewpost_controller = require('../controller/addnewpost');
var admin_controller = require('../controller/admin');
var logout_controller = require('../controller/logout');
var forgot_controller = require('../controller/forgotpassword')
var about_controller = require('../controller/about');
var login_controller = require('../controller/login');

// Creating Routes, Add new Routes below
router.get('/', homepage_controller.homepage);
router.get('/search', search_controller.search_get);
router.get('/category', category_controller.category);
router.get('/viewpost', viewpost_controller.viewpost);
router.get('/addnewdata', addnewpost_controller.addnewpost);
router.post('/addnewdata', addnewpost_controller.postaddnewpost);
router.get('/admin', admin_controller.adminget);
router.post('/admin', admin_controller.adminpost);
router.get('/logout', logout_controller.logoutget);
router.get('/forgotpassword', forgot_controller.forgotpaswordget);
router.post('/forgotpassword', forgot_controller.forgotpaswordpost);
router.get('/about', about_controller.about);
router.get('/login', login_controller.loginget);

// Exporting Router Module to be imported in app.js
module.exports = router;