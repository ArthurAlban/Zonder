zonder.controller('mainCtrl', function($scope, $state, $ionicModal) {
	
$ionicModal.fromTemplateUrl('modals/createZonderModal.html', {
  scope: $scope,
  animation: 'slide-in-right'
}).then(function(modal) {
  $scope.createZonderModal = modal;
});

$scope.openCreateZonderModal = function() {
  $scope.createZonderModal.show();
};

$scope.closeCreateZonderModal = function() {
  $scope.createZonderModal.hide();
};

$scope.$on('$destroy', function() {
  $scope.createZonderModal.remove();
});

$scope.question = "";

});