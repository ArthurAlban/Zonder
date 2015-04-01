zonder.controller('animatedSplashscreenCtrl', function($scope, $state, $ionicPlatform) {
	$scope.animateTriangles = false;
	$ionicPlatform.ready(function() {
		setTimeout(function(){
			console.log("animate");
			//console.log("gotooltip");
			//$state.go('tooltip');
			$scope.animateTriangles = true;
			$scope.$apply();
		}, 3000);

	});
});