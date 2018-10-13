var helper = require('../helper/helper')
var app = require('../app')
var authenticate = require('./auth')

exports.mostVisitedPosts = function(output){
    app.postsRef.orderByChild('viewed').limitToLast(5).once('value', function(childSnap){
        // console.log("in the if case  CHECK 3", output)
        var content = helper.snapshotToArray(childSnap);
        var len = content.length;
        // console.log("in the if case  CHECK 4", output)
        
        // Adding Popular Posts
        for(var j = len-1; j >= 0; j--){
            output.sidebar.push({title: content[j].title, name: content[j].name, key: content[j].key});
        }
        // console.log("in the if case  CHECK 5", output)
        exports.output = output;
        return
    });
}