var helper = require('../helper/helper')
var app = require('../app')
// var authenticate = require('./auth')


exports.logoutget = function(request, response){
    console.log("in admin logout ")
    app.firebase.auth().signOut()
        .then(function(){
            var output = {message: 'User Successfully Logged Out', sidebar: []}
            app.postsRef.orderByChild('viewed').limitToLast(3).once('value', function(childSnap){
                var content = helper.snapshotToArray(childSnap);
                var len = content.length;
        
                // Adding Popular Posts
                for(var j = len-1; j >= 0; j--){
                    output.sidebar.push({title: content[j].title, name: content[j].name, key: content[j].key});
                }
                response.render('admin', output);
            });
        })
        .catch(function(err){
            var output = {message: err, sidebar: []}
            app.postsRef.orderByChild('viewed').limitToLast(3).once('value', function(childSnap){
                var content = helper.snapshotToArray(childSnap);
                var len = content.length;
        
                // Adding Popular Posts
                for(var j = len-1; j >= 0; j--){
                    output.sidebar.push({title: content[j].title, name: content[j].name, key: content[j].key});
                }
                response.render('admin', output);
            });
        })
},function(err){
    console.log("THE ERROR IS ",err);
};