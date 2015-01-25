// for interfacing with http protocol
var http = require('http');

// where all fetched data will be kept
var everything = {};

// for fetching initial sequences list from wiki
getSequences = function() {
    var options = {
        host: 'wiki.lesswrong.com',
        path: '/mediawiki/api.php?action=query&list=categorymembers&cmtitle=Category:Sequences&cmlimit=500&format=json'
    }

    http.request(options, onGetSequencesResponse).end();
}

// on establishing http connection of sequences list
onGetSequencesResponse = function(message) {
    // where entire response content will be kept
    var body = '';

    // on data chunk, append it to already existing content
    message.on('data', function(chunk) {
        body += chunk;
    });

    // on http response completion
    message.on('end', function() {
        // parse the entire response content as JSON
        var response = JSON.parse(body);

        // initialize array to put sequences in
        everything.sequences = [];

        // iterate over all the sequences in parsed JSON response
        // for test purposes, iterate only for one instead ' response.query.categorymembers.length'
        for (var i = 0; i < 1 ; i++) {
            // add Object containing pageId and title for every sequence to array
            everything.sequences.push({
                pageId: response.query.categorymembers[i].pageid,
                title: response.query.categorymembers[i].title
            });
        }

        // go fetch links from each sequence
        getLinks();
    });
}

// fetches external links from each sequences
getLinks = function() {

    // for how many sequences to fetch links
    var sequencesToComplete = everything.sequences.length;

    // how many sequences links have been fetched for
    var sequencesCompleted = 0;

    // iterate over sequences to fetch links asynchronously
    everything.sequences.forEach(function(sequence) {

        // set options for fetching the external links
        var options = {
            host: 'wiki.lesswrong.com',
            path: '/mediawiki/api.php?action=query&pageids=' + sequence.pageId + '&prop=extlinks&format=json'
        }

        // fetch the external links
        http.request(options, function(message) {
            // where entire response content will be
            var body = '';

            // on data chunk, append it to already existing content
            message.on('data', function(chunk){
                body += chunk;
            });

            // on http response completion
            message.on('end', function(){
                // parse the entire response content as JSON
                var response = JSON.parse(body);

                // create array on sequence to put links in
                sequence.links = [];

                // iterate over all links in received list
                for (var i = 0; i < response.query.pages[sequence.pageId].extlinks.length; i++) {
                    // check if the link contains 'castify'
                    if (response.query.pages[sequence.pageId].extlinks[i]['*'].indexOf('castify') == -1){
                        // put link to sequence
                        sequence.links.push(response.query.pages[sequence.pageId].extlinks[i]['*']);
                    }
                }

                if (++sequencesCompleted == sequencesToComplete) {
                    getArticles();
                }
            });
        }).end();
    });
}

// fetches articles from sequence link
getArticles = function() {
    console.log(JSON.stringify(everything, undefined, 4));
}

getSequences();

