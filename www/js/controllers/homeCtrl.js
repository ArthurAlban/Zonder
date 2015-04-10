zonder.controller('homeCtrl', function($scope, $state, $window, $ionicSideMenuDelegate, $rootScope) {
	
	$scope.openCloseSideMenu = function(){
		console.log($rootScope.sideMenuIsOpen);
		$ionicSideMenuDelegate.toggleLeft();
		$rootScope.sideMenuIsOpen = !$rootScope.sideMenuIsOpen;
		console.log($rootScope.sideMenuIsOpen);
	};

});