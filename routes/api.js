var express = require('express');
var router = express.Router();
var Article = require('../models/article.js');
var Sequence = require('../models/sequence.js');

router.get('/sequences', function(req, res) {
    Sequence.find(function(err, sequences) {
        if (err) res.send(err);
        res.json(sequences);
    });
});

router.get('/sequence/:id', function(req, res) {
    Sequence.findById(req.params.id, function(err, sequence) {
        if (err) res.send(err);
        res.json(sequence);
    });
});

router.get('/article/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        if (err) res.send(err);
        res.json(article);
    });
});

module.exports = router;

