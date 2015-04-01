zonder.controller('animatedSplashscreenCtrl', function($scope, $state, $ionicPlatform) {
	$scope.animateTriangles = false;
	$scope.animateLogo = false;
	$scope.animateTooltip = false;
	$ionicPlatform.ready(function() {
		$scope.animateTriangles = true;
		$scope.animateLogo = true;
		$scope.$apply();
		setTimeout(function(){
			$scope.animateTooltip = true;
			$scope.$apply();
		}, 600);
	});
});