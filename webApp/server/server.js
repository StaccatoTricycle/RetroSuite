var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.use(bodyParser.json());
// app.use(express.static(__dirname + '/../client')); // react index.html

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


app.route('/test')
  .get(function(req, res){
    res.send('Hello World');
});


var port = process.env.PORT || 3000;
console.log('server running on port ' + port);

// start listening to requests on port 3000
app.listen(port);

// export our app for testing
module.exports = app;