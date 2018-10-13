var helper = require('../helper/helper')
var app = require('../app')
var authenticate = require('./auth')
var sidebar = require('./sidebar')
var postByDate = require('./postByDate')


exports.loginwithgoogleget = function(request, response){
    response.render('loginwithgoogle');
},function(err){
    console.log("THE ERROR IS ",err);
};

exports.loginwithgooglepost = function(request, response){
    id_token = request.body.token;
    console.log('TOKEN IS ', id_token);
    // Build Firebase credential with the Google ID token.
    var credential = app.firebase.auth.GoogleAuthProvider.credential(id_token);

    // Sign in with credential from the Google user.
    app.firebase.auth().signInAndRetrieveDataWithCredential(credential)
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        })
        .then(function(){
            response.redirect('/');
        })
}