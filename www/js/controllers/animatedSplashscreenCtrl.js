zonder.controller('animatedSplashscreenCtrl', function($scope, $rootScope, $state, $ionicPlatform, $ionicSlideBoxDelegate) {
	$scope.animateTriangles = false;
	$ionicPlatform.ready(function() {
		$scope.animateTriangles = true;
		$scope.$apply();
	});

	// Called to navigate to the main app
   $scope.toLogin = function() {
   $ionicSlideBoxDelegate.slide(3);
  };

  $scope.toRegister = function() {
    $state.go("register");
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;

  };
});