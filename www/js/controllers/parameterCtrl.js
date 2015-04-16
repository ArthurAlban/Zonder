zonder.controller('parameterCtrl', function($scope, $state, $ionicSlideBoxDelegate, $ionicModal, $ionicActionSheet) {
	
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

/// profile modal ///////////

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


$scope.showActionSheetParameters = function() {
  $ionicActionSheet.show({
    buttons: [
    { text: 'Change password'},
    ],
    cancelText: 'Cancel',
    cancel: function() {
    },
    buttonClicked: function(index) {
      if(index == 0){
      	$scope.openChangePassModal();
      }
      if(index == 1){
      	return true;
      }
      return true;
    }
  });
};
//////////////////////// Change Pass Modal ////////////////////////////////


$ionicModal.fromTemplateUrl('modals/changePassword.html', {
  scope: $scope,
  animation: 'slide-in-right'
}).then(function(modal) {
  $scope.changePassModal = modal;
});

$scope.openChangePassModal = function() {
  $scope.changePassModal.show();
};

$scope.closeChangePassModal = function() {
  $scope.changePassModal.hide();
};

$scope.$on('$destroy', function() {
  $scope.changePassModal.remove();
});

$scope.$on('modal.hidden', function() {
});

$scope.$on('modal.removed', function() {
});

$scope.passs = {};
$scope.passs.oldPassword = "";
$scope.passs.newPassword = "";
$scope.passs.repeatPassword = "";

$scope.oldPassMsg = false;
$scope.newPassMsg = false;
$scope.okPassMsg = false;
$scope.passEmpty = false;
$scope.passNotEqual = false;

$scope.formIsValid = true;
$scope.formIsValid2 = true;

$scope.loadingChangePassword = false;

$scope.checkPass = function() {
  if($scope.passs.newPassword != $scope.passs.repeatPassword) {
    $scope.passNotEqual = true;
    return false;
  }

  if( $scope.passs.newPassword == "" || $scope.passs.repeatPassword == "")  {
    $scope.passEmpty = true;
    return false;
  }

  return true;
};

$scope.hideAll = function(){
  $scope.oldPassMsg = false;
  $scope.newPassMsg = false;
  $scope.okPassMsg = false;
  $scope.passEmpty = false;
  $scope.passNotEqual = false;
};

$scope.clearAndClose = function() {
  $scope.hideAll();
  $scope.passs = {};
  $scope.passs.oldPassword = "";
  $scope.passs.newPassword = "";
  $scope.passs.repeatPassword = "";
  $scope.formIsValid = true;
  $scope.formIsValid2 = true;
  $scope.closeChangePassModal();

};

$scope.checkValidity = function(isValid) {
  $scope.formIsValid = isValid;
  $scope.oldPassMsg = false;
  $scope.newPassMsg = false;
  $scope.okPassMsg = false;
  $scope.passEmpty = false;
  $scope.passNotEqual = false;
};

$scope.checkValidity2 = function(isValid2) {
  $scope.formIsValid2 = isValid2;
  $scope.oldPassMsg = false;
  $scope.newPassMsg = false;
  $scope.okPassMsg = false;
  $scope.passEmpty = false;
  $scope.passNotEqual = false;
};

$scope.confirmChange = function() {
  if($scope.checkPass()) {
    $scope.loadingChangePassword= true;
    UserService.newPassword($scope.passs.oldPassword, $scope.passs.newPassword, $scope.passs.repeatPassword).then(function(data){
      if(data.result == "oldPass"){
        $scope.oldPassMsg = true;

        $scope.newPassMsg = false;
        $scope.okPassMsg = false;
        $scope.passEmpty = false;
        $scope.passNotEqual = false;

      } 
      else if(data.result == "newPass"){
        $scope.newPassMsg = true;

        $scope.oldPassMsg = false;
        $scope.okPassMsg = false;
        $scope.passEmpty = false;
        $scope.passNotEqual = false;
      }
      else if(data.result == "passChanged"){
        $scope.okPassMsg = true;

        $scope.oldPassMsg = false;
        $scope.newPassMsg = false;
        $scope.passEmpty = false;
        $scope.passNotEqual = false;

        $scope.clearAndClose();
      }
      $scope.loadingChangePassword= false;
    },function(status) {
      console.log("impossible de changer le mot de pass");
      $scope.loadingChangePassword= false;
    });
  }
};

});