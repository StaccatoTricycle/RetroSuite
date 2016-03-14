var api = {
  PairController(ipAddress) {
    var url = 'http://' + ipAddress + '/pair-controller';
    // console.log(url);
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(result) {
      console.log('blah success')
      console.log(result);
      callback(result._bodyInit);
    })
    .catch(function(err) {
      // console.log(err);
      console.log('errorrrrrrrrr');
    });
  },

  Press(ipAddress, playerID, button, callback) {
    var url = 'http://' + ipAddress + '/player/' + playerID + '/press/' + button;
    return fetch(url, {
      method: 'POST',
      body: null
    });
  },

  Release(ipAddress, playerID, button, callback) {
    var url = 'http://' + ipAddress + '/player/' + playerID + '/release/' + button;
    return fetch(url, {
      method: 'POST',
      body: null
    });
  },

  // Press(ipAddress, playerID, button, callback) {
  //   var url = 'http://' + ipAddress + ':1337/player/' + playerID + '/press/' + button;
  //   // console.log(url);
  //   return fetch(url, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   }).then(function(result) {
  //     callback(result._bodyInit);
  //     console.log(result);
  //     console.log('blah success')

  //   })
  //   .catch(function(err) {
  //     // console.log(err);
  //     console.log('press errorrrrrrrrr', button);
  //   });
  // },

  // Release(ipAddress, playerID, button, callback) {
  //   var url = 'http://' + ipAddress + ':1337/player/' + playerID + '/release/' + button;
  //   // console.log(url);
  //   return fetch(url, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   }).then(function(result) {
  //     callback(result._bodyInit);
  //     console.log(result);
  //   })
  //   .catch(function(err) {
  //     // console.log(err);
  //     console.log('release errorrrrrrrrr', button);
  //   });
  // },

};

module.exports = api;
