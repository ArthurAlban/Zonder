zonder.controller('registerCtrl', function($scope, $state, $ionicPlatform) {

	$scope.login = function() {
    $state.go("animatedSplashscreen");
  };

});