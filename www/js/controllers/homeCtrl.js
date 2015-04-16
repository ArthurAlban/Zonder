zonder.controller('homeCtrl', function($scope, $state, $window, $ionicSlideBoxDelegate, $rootScope,$ionicSideMenuDelegate) {

	$scope.sliderVote = true;
	$scope.sliderPolls = false;
	$scope.sliderFriends = false;

	$scope.divOpacity = false;

// si on trouve un moment de mettre les valeurs dans la directive
	$scope.$watch(function () {
		return $ionicSideMenuDelegate.getOpenRatio();
	},
	function (ratio) {
		if(ratio == 0){
			$scope.divOpacity = false;
		}
		else{
			$scope.divOpacity = true;
		}
	});

$scope.goToSlide = function(index){
	$ionicSlideBoxDelegate.$getByHandle('homeSlider').slide(index);
};

$scope.slideHasChangedInHomeSlider = function(index) {
		if(index == 0){
			$scope.sliderVote = true;
			$scope.sliderPolls = false;
			$scope.sliderFriends = false;
		}
		if(index == 1){
			$scope.sliderVote = false;
			$scope.sliderPolls = true;
			$scope.sliderFriends = false;
		}
		if(index == 2){
			$scope.sliderVote = false;
			$scope.sliderPolls = false;
			$scope.sliderFriends = true;
		}
	};



});