zonder.controller('parameterCtrl', function($scope, $state, $ionicSlideBoxDelegate,$ionicModal) {
	
	$scope.sliderPollsProfile = true;
	$scope.sliderFriendsProfile = false;


$scope.goToSlide = function(index){
	$ionicSlideBoxDelegate.$getByHandle('profileSlider').slide(index);
};

$scope.slideHasChangedInProfileSlider = function(index) {
		if(index == 0){
			$scope.sliderPollsProfile = true;
			$scope.sliderFriendsProfile = false;
		}
		if(index == 1){
			$scope.sliderPollsProfile = false;
			$scope.sliderFriendsProfile = true;
		}
	};


$ionicModal.fromTemplateUrl('modals/profileModal.html', {
  scope: $scope,
  animation: 'slide-in-right'
}).then(function(modal) {
  $scope.profileModal = modal;
});

$scope.openProfileModal = function() {
  $scope.profileModal.show();
};

$scope.closeProfileModal = function() {
  $scope.profileModal.hide();
};

$scope.$on('$destroy', function() {
  $scope.profileModal.remove();
});

$scope.$on('modal.hidden', function() {
});

$scope.$on('modal.removed', function() {
});

});