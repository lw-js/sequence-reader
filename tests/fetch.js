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

        // *******This loop works instead of categorymembers.length. I first tested it by pasting in the above comment,
        // *******and it failed. Then it worked again.
        var count = 0;
        for (var j in response.query.categorymembers)
            if(response.query.categorymembers.hasOwnProperty(j))
                count++;


        for (var i = 0; i < response.query.categorymembers.length ; i++) { //for (var i =0; i < count; i++) {
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
            path: '/mediawiki/api.php?action=query&pageids=' + sequence.pageId + '&redirects&prop=extlinks&format=json'
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
                var extlinks = response.query.pages[Object.keys(response.query.pages)[0]].extlinks;
                if (!extlinks) return;

                // create array on sequence to put links in
                sequence.links = [];

                // *******Here's the second loop. In this case, it only works if the loop is used.
                var count = 0;
                for (var j in extlinks)
                    if(extlinks.hasOwnProperty(j))
                        count++;

                // iterate over all links in received list

                for (var i = 0; i < extlinks.length; i++) { // for (var i=0; i < count; i++) {
                    // check if the link contains 'castify'
                    if (extlinks[i]['*'].indexOf('http://lesswrong.com/lw') == 0){
                        // put link to sequence
                        sequence.links.push(extlinks[i]['*']);
                    }
                }

                if (++sequencesCompleted == sequencesToComplete) {
                    getArticles();

                }
                console.log(sequence.links)
            });
        }).end();
    });
}

// fetches articles from sequence link
getArticles = function() {
    console.log(JSON.stringify(everything, undefined, 4));
}

getSequences();
