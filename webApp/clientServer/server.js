var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var redis = require('./redis')();
var config = require('../webpack.config.js');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleWare = require('webpack-hot-middleware');

process.title = 'crowdmu-web';

var compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath})); // get rid of this middleware for production
app.use(webpackHotMiddleWare(compiler));
app.use(bodyParser.json());
app.use(express.static('./dist'));


var url = process.env.CROWDMU_IO_URL || 'http://localhost:3001';

// Serves index.ejs with socket.io URL included as a variable
app.set('view engine', 'ejs');
app.get('/', function(req, res, next){
  res.render(path.resolve(__dirname + './../client/index'), {
    ioURL: url
  });
});

// Serves a still screenshot of the emulator. Useful for testing connection
app.get('/screenshot.png', function(req, res, next) {
  redis.get('crowdmu:frame', function(err, image){
    if (err) return next(err);
    res.writeHead(200, {
      'Content-Type':'image/png',
      'Content-Length': image.length});
    res.end(image);
  });
});

var port = process.env.CROWDMU_PORT || 3000;

// start listening to requests on port 3000
app.listen(port, function (err) {
  if (err) {
    throw err;
  }
  console.log('Server listening on port ', port);
});

// export our app for testing
module.exports = app;
