var api = {
  PairController(ipAddress) {
    var url = 'http://' + ipAddress + ':1337/pair-controller';
    console.log(url);
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(result) {
      console.log('blah success')
      console.log(result);
      callback(result);
    })
    .catch(function(err) {
      console.log(err);
      console.log('errorrrrrrrrr');
    });
  },

  Press(ipAddress, playerID, button, callback) {
    var url = 'http://' + ipAddress + ':1337/player/' + playerID + '/press/' + button;
    console.log(url);
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(result) {
      callback();
      console.log(result);
      console.log('blah success')

    })
    .catch(function(err) {
      console.log(err);
      console.log('errorrrrrrrrr');
    });
  },

  Release(ipAddress, playerID, button, callback) {
    var url = 'http://' + ipAddress + ':1337/player/' + playerID + '/release/' + button;
    console.log(url);

    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(result) {
      callback();
      console.log(result);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

};

module.exports = api;
