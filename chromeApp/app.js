angular.module('main',[])
.controller('mainCtrl', function($scope) {
  $scope.ipAddress = 'filler'
  $scope.title = 'TITLEEEE';
  $scope.emulator = { playing: false}
  $scope.togglePlaying = function() {
    console.log("CLICKEDDDD")
    $scope.emulator.playing = true;
    console.log($scope.emulator.playing)
    $scope.$apply();
  }


  // For testing keydown events
  // $('body').on('keydown', function (e) {
  //   console.log('event triggerd: ', e);
  // });

  document.querySelector('body').addEventListener('keydown', function (e) {
    console.log('da event triggurd: ', e);
  });

  chrome.system.network.getNetworkInterfaces(function (ipAddresses) {
    ipAddresses.forEach(function (ipAddress) {
      if (ipAddress.prefixLength === 12) {
        $scope.title = 'IP FOUND'

        $scope.ipAddress = ip4 = ipAddress.address;
        var toQ = ipv4 + ':' + port + '/pair-controller';
              // console.log('toQ');
              // console.log(toQ);
        new QRCode(document.getElementById('qrcode'), toQ);

        // force scope to update
        $scope.$apply()
      }
    });

  });
});
