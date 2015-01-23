var mongoose = require('mongoose');
var Article = require('../models/article.js');
var Schema = mongoose.Schema;

var SequenceSchema = new Schema({
    title: String,
    articles: [{type: Schema.Types.ObjectId, ref: Article.modelName}]
});

module.exports = mongoose.model('Sequence', SequenceSchema);

