zonder.controller('registerCtrl', function($scope, $state) {

	$scope.login = function() {
    $state.go("animatedSplashscreen");
  };

});