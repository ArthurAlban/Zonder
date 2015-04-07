zonder.controller('registerCtrl', function($scope, $state, $ionicPlatform, $ionicSlideBoxDelegate) {
	$scope.userData = {};

	$scope.userData.mail = "";
	$scope.userData.password = "";
	$scope.userData.confirmPassword = "";
	$scope.userData.username = "";

	$scope.displayNextButton = true;

	$scope.disableSwipe = function() {
		$ionicSlideBoxDelegate.enableSlide(false);
	};
	
	$scope.nextStepRegister = function(){
		$ionicSlideBoxDelegate.next();
		$scope.displayNextButton = false;
	};

	$scope.previousStepRegister = function(){
		$ionicSlideBoxDelegate.previous();
		$scope.displayNextButton = true;
	};

	$scope.login = function() {
		$state.go("animatedSplashscreen");
	};


});