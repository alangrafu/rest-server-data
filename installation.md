# Installation

* In `client/lodspeakr/static/js/editor.js` change

```
var baseUri = 'http://alia/gov';
var serverUri = 'http://alia:4567';
var dataProxyUri = 'http://alia:8000';
```

to your servername

* Install rvm
* In `server/` run `rvm gemset import default.gem`
    * Compile sparql-client and install it manually if necessary
* In `server/registerServer.rb` change to the servername

```
set :public_folder, 'tmp'
set :baseUri, 'http://alia/gov'
set :sparqlEndpoint, 'http://alia:3030/gov/query'
set :sparqlUpdateEndpoint, 'http://alia:3030/gov/data'
```
