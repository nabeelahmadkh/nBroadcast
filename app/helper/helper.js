// Contains all the Helper Functions

// Checking for Empty Object
exports.isEmpty = function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj == null) return true;
 
    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length && obj.length > 0)    return false;
    if (obj.length === 0)  return true;
 
    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and toValue enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
 
    return true;
}

// Searching for query in the post tags
exports.searchquery = function searchquery(snapshot, searchQuery){
	// Search Query will search for the keyword in item tags of the post
	// If the tag matches the search term then it will add the post to the return object 
	var returnArr = [];
	snapshot.forEach(function(childSnapshot){
        var item = childSnapshot.val();
        var key = childSnapshot.key;
		var mainStr = item.tags;
		if(mainStr.indexOf(searchQuery) > -1) {
			returnArr.push({content: item.content, date: item.date, title: item.title, preview: item.preview, author: item.author, name: item.name, image: item.image1, key: key});
		}
	});
	return returnArr;
};

// Converting Firebase Snapshot to array
exports.snapshotToArray = function snapshotToArray(snapshot) {
    var returnArr = [];
    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        var key = childSnapshot.key;
		returnArr.push({content: item.content, date: item.date, title: item.title, preview: item.preview, author: item.author, name: item.name, image: item.image1, key: key});
	});
    return returnArr;
};

// Creating Content for the Article from Snapshot
exports.contentJsonToArray = function contentJsonToArray(snapshot){
	var returnArr = [];
	var item = snapshot;
	returnArr.push({para: item.para1}, {para: item.para2}, {para: item.para3});
	return returnArr;
};

// Converting Firebase Snapshot to array
exports.snapshotToKeysArray = function snapshotToKeysArray(snapshot) {
    var returnArr = [];
    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        returnArr.push(item.key);
        //console.log("item added ", item.key, item);
	});
    return returnArr;
};