var path = require('path');

exports.sitemap = function(request, response){
    response.sendFile(path.resolve(__dirname+'/../../public/sitemap.xml'));
};