  var ipv4;
  var http = require('http');
  var url = require('url');
  var port = 1337;
  var host = '0.0.0.0';
  try {
    if (!router) {
      var router = require('./router.js');
    }
  } catch (err) {}

  http.createServer(function (req, res) {

    router(req, res);

  }).listen(port, host);
  console.log('Server running at ' + host + ':' + port + '/');
