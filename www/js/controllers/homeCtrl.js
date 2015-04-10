zonder.controller('homeCtrl', function($scope, $state, $window, $ionicSlideBoxDelegate) {

	$scope.sliderVote = true;
	$scope.sliderPolls = false;
	$scope.sliderFriends = false;

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