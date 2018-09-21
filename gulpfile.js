var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('default', function(){
    nodemon({
        script: 'app/app.js',
        ext: 'js',
        env: {
            PORT:(process.env.PORT || 3000)
        },
        ignore: ['./node_modules/**']
    })
    .on('restart',function(){
        console.log('Restarting');
    });
});

gulp.task('adddata', function(){
    nodemon({
        script: 'app/AddData.js',
        ext: 'js',
        env: {
            PORT:3000
        },
        ignore: ['./node_modules/**']
    })
    .on('restart',function(){
        console.log('Restarting');
    });
});