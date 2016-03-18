angular.module('main',[])
.controller('mainCtrl', function($scope) {
  $scope.ipAddress = 'filler';
  $scope.ipFound = false;
  $scope.title = 'TITLEEEE';
  $scope.emulator = { playing: false}
  $scope.togglePlaying = function() {
    console.log("CLICKEDDDD")
    $scope.emulator.playing = true;
    console.log($scope.emulator.playing)
    $scope.$apply();
  }

  window.togglePlaying = $scope.togglePlaying;

  // For testing keydown events
  // $('body').on('keydown', function (e) {
  //   console.log('event triggerd: ', e);
  // });

  document.querySelector('body').addEventListener('keydown', function (e) {
    console.log('da event triggurd: ', e);
  });

  chrome.system.network.getNetworkInterfaces(function (ipAddresses) {
    ipAddresses.forEach(function (ipAddress) {
      console.log(ipAddress);
      if (ipAddress.prefixLength <= 28 && ipAddress.name === "en0") {
        $scope.title = 'IP FOUND'

        $scope.ipAddress = ip4 = ipAddress.address;
        var toQ = $scope.ipAddress + ':' + port;
              // console.log('toQ');
              // console.log(toQ);
        if($scope.ipFound === false) {
          new QRCode(document.getElementById('qrcode'), toQ);
        }

        $scope.ipFound = true;

        // force scope to update
        $scope.$apply()
      }
    });

  });
});
