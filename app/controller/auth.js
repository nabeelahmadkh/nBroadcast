var app = require('../app')

module.exports = {
    isAuthenticated: function (req, res) {
      var user = app.firebase.auth().currentUser;
      if (user !== null) {
        req.user = user;
        console.log("User is ", user)
        return true
      } else {
        console.log("isAuthenticated Function");
        return false
      }
    },
  }