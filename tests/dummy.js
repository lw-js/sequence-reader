var dotenv = require('dotenv');
var mongoose = require('mongoose');
var Article = require('../models/article.js');
var Sequence = require('../models/sequence.js');

dotenv.load();

mongoose.connect(process.env.DATABASE);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'database connection error:'));
db.once('open', function (callback) {
    var article = new Article({
        title: 'Article Title',
        content: 'Article content.'
    });

    article.save(function(err) {
        if(!err){
            var sequence = new Sequence({
                title: 'Sequence Title',
                articles: [article]
            });

            sequence.save(function(err) {
                if(err) return console.log(err);
                else process.exit(code=0);
            });
        }
        else return console.log(err);
    });

});

