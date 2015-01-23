# sequence-reader

Practical reader for LessWrong sequences.

## Requirements

- node.js
- mongodb

## Instructions

- run ```git clone git@github.com:lw-js/sequence-reader.git```
- create ```.env``` file according to ```.env.template```
- run ```npm install```
- (optional) run ```node tests/dummy.js``` to fill dummy database data
- run ```npm start```

## API

- GET all sequences at ```/api/sequences```
- GET a sequence specified by ```<id>``` at ```/api/sequence/<id>```
- GET an article specified by ```<id>``` at ```/api/article/<id>```

