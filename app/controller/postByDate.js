var helper = require('../helper/helper')
var app = require('../app')
var authenticate = require('./auth')

exports.allPostsByDate = function(output){
    app.postsRef.once('value', function(snapshot){
        snapshot.forEach(function(childSnap){
            var item = childSnap.val();
            var key = childSnap.key;
            
            date = item.date.split(' ')
            year = date[3]
            month = date[2]
            day = date[1]
            yearFound = false
            for (i =0; i <output.postByDate.length; i++){
                if (output.postByDate[i].year == year){
                    yearFound = true
                    monthFound = false
                    for (j=0; j < output.postByDate[i].month.length; j++){
                        if (output.postByDate[i].month[j].name == month){
                            monthFound = true
                            output.postByDate[i].month[j].post.push({
                                name: item.title,
                                key: key
                            })
                        }
                    }
                    if (!monthFound){
                        // output.postByDate[i].month = []
                        output.postByDate[i].month.push({
                            name: month,
                            post: [
                                    {
                                        name: item.title,
                                        key: key
                                    }
                                  ]
                        });
                    }
                }
            }
            if(!yearFound){
                output.postByDate.push({
                    year: year,
                    month:[
                            {
                                name: month,
                                post: [
                                        {
                                            name: item.title,
                                            key: key
                                        }
                                      ]
                            }
                          ],
                })
            }
            
        });
        // console.log('\noutput is ', output.postByDate);
        // console.log('\nlast output is  ', output.postByDate[3].month)
        exports.output = output;
    });
}

