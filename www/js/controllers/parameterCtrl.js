zonder.controller('parameterCtrl', function($window, $scope, $rootScope, $state, $ionicSlideBoxDelegate, $ionicModal, $ionicActionSheet, UserService, $ionicPlatform, $cordovaPush, $ionicLoading) {
	
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
  animation: 'slide-in-right',
  backdropClickToClose: false
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
   console.log("hidden profile modal");
});

$scope.$on('modal.removed', function() {
   console.log("hidden profile modal");
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
$scope.openChangePassModal = function() {
$ionicModal.fromTemplateUrl('modals/changePassword.html', {
  scope: $scope,
  animation: 'slide-in-right', 
  backdropClickToClose: false
}).then(function(modal) {
  $scope.changePassModal = modal;
   $scope.changePassModal.show();
});
};

$scope.closeChangePassModal = function() {
  console.log("remove changePass modal");
    $scope.changePassModal.remove();
    $scope.clearAndClose();
     console.log("remove changePass modal");
  };

// $scope.openChangePassModal = function() {
//   $scope.changePassModal.show();
// };

// $scope.closeChangePassModal = function() {
//   $scope.changePassModal.hide();
// };

$scope.$on('$destroy', function() {
  $scope.changePassModal.remove();
});

$scope.$on('modal.hidden', function() {
});

$scope.$on('modal.removed', function() {
});

$scope.oldPasswordPopup = false;
$scope.newPasswordPopup = false;
$scope.confirmChangePasswordPopup = false;

$scope.displayOldPasswordPopup = function(){
  $scope.oldPasswordPopup = true;
};

$scope.displayNewPasswordPopup = function(){
  $scope.newPasswordPopup = true;
};

$scope.displayConfirmChangePasswordPopup = function(){
  $scope.confirmChangePasswordPopup = true;
};

$scope.closepopups = function(){
  $scope.oldPasswordPopup = false;
  $scope.newPasswordPopup = false;
  $scope.confirmChangePasswordPopup = false;
};

$scope.passs = {};
$scope.passs.oldPassword = "";
$scope.passs.newPassword = "";
$scope.passs.repeatPassword = "";

// $scope.oldPassMsg = false;
// $scope.newPassMsg = false;
// $scope.okPassMsg = false;
// $scope.passEmpty = false;
// $scope.passNotEqual = false;

// $scope.formIsValid = true;
// $scope.formIsValid2 = true;

// $scope.loadingChangePassword = false;

// $scope.checkPass = function() {
//   if($scope.passs.newPassword != $scope.passs.repeatPassword) {
//     $scope.passNotEqual = true;
//     return false;
//   }

//   if( $scope.passs.newPassword == "" || $scope.passs.repeatPassword == "")  {
//     $scope.passEmpty = true;
//     return false;
//   }

//   return true;
// };

// $scope.hideAll = function(){
//   $scope.oldPassMsg = false;
//   $scope.newPassMsg = false;
//   $scope.okPassMsg = false;
//   $scope.passEmpty = false;
//   $scope.passNotEqual = false;
// };

$scope.clearAndClose = function() {
  //$scope.hideAll();
  $scope.passs = {};
  $scope.passs.oldPassword = "";
  $scope.passs.newPassword = "";
  $scope.passs.repeatPassword = "";

  $scope.oldPasswordPopup = false;
  $scope.newPasswordPopup = false;
  $scope.confirmChangePasswordPopup = false;

  $scope.oldPassValid = true;
  $scope.newPassValid = true;
  $scope.newPassValidDirty = false;
  $scope.repeatPassValid = true;

  // $scope.closeChangePassModal();
};

$scope.oldPassValid = true;
$scope.newPassValid = true;
$scope.newPassValidDirty = false;
$scope.repeatPassValid = true;


$scope.setOldPassValid = function(){
  $scope.oldPassValid = true;
};

$scope.checkEmptyFields = function(){
  if($scope.passs.oldPassword == ""){
    $scope.oldPassValid = false;
  }
  if($scope.passs.newPassword == ""){
    $scope.newPassValid = false;
  }
  if($scope.passs.repeatPassword == ""){
    $scope.repeatPassValid = false;
  }
};

$scope.checkIdenticPassword = function(){
  if($scope.passs.newPassword.length > 5 && $scope.passs.repeatPassword.length > 5){
    if($scope.passs.newPassword == $scope.passs.repeatPassword){
      $scope.repeatPassValid = true;
    }
    else{
      $scope.repeatPassValid = false;
    }
  }
  else {
    $scope.repeatPassValid = false;
  }
};

$scope.checkChangePassServer = function(){
 UserService.newPassword($scope.passs.oldPassword, $scope.passs.newPassword, $scope.passs.repeatPassword).then(function(data){
  if(data.result == "oldPass"){
    window.setTimeout(function(){
      console.log("oldPass");
      $scope.loadingChangePass.hide();
      $scope.oldPassValid = false;
    }, 500);
  } 
  else if(data.result == "newPass"){
   window.setTimeout(function(){
    console.log("newPass");
    $scope.loadingChangePass.hide();
    $scope.newPassValid = false;
  }, 500);
 }
 else if(data.result == "passChanged"){
  window.setTimeout(function(){
    console.log("passChanged");
    $scope.loadingChangePass.hide();
    $scope.closeChangePassModal();
  }, 500);
}
},function(status) {
 window.setTimeout(function(){
   $scope.loadingChangePass.hide();
 }, 500);
 console.log("impossible de changer le mot de pass");
});
};


$scope.checkPasswordIsValid = function(){
  var rePass = new RegExp("^[a-zA-Z0-9]{5,50}$");
  if($scope.passs.newPassword.length > 5){
    if(rePass.test($scope.passs.newPassword)){
      $scope.newPassValid = true;
      $scope.newPassValidDirty = true;
    }
    else{
      $scope.newPassValid = false;
      $scope.newPassValidDirty = false;
    }
  }
  else{
    $scope.newPassValid = false;
    $scope.newPassValidDirty = false;
  }
};

$scope.changePass = function(){
  console.log("testchange pass");
  $scope.checkEmptyFields();
  $scope.checkIdenticPassword();
  $scope.checkPasswordIsValid();
  if(!$scope.oldPassValid || !$scope.newPassValid || !$scope.repeatPassValid){
  }
  else{
   $scope.loadingChangePass = $ionicLoading.show({
    template:'<ion-spinner class="spinnerLoading" icon="spiral"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true
  });
   $scope.checkChangePassServer();
 }
};

////////////// log out /////////////////
$scope.logOut = function() {
  if($window.localStorage['isLog'] == "true") {
   $ionicPlatform.ready(function () {
    var options = {};
    // $cordovaPush.unregister(options).then(function(result) {
        // console.log("tokeneeeee " + $window.localStorage['deviceToken']);

      // UserService.unregisterDevice($window.localStorage['deviceToken']).then(function(){

        UserService.logOut().then(function() {

          $window.localStorage['token'] = "";
          $window.localStorage['isLog'] = "false";
          $window.localStorage['pseudo'] = "";
          $window.localStorage['email'] = "";
          $window.localStorage['gender'] = "";
          $window.localStorage['photo'] = "";
          $window.localStorage['notifFriends'] = "";
          $window.localStorage['notifPolls'] = "";
          $window.localStorage['deviceToken'] = "";
          $rootScope.loadingLogIn = false;
          $state.go('animatedSplashscreen');
          

        },function(status) {
          console.log("Logout Impossible");
        });

    //   }, function(satus){
    //     console.log("error in unregisterDevice" + msg);
    //   }); 
    // }, function(err) {
    //   console.log("error in cordovaPush.unregister");
    // });
});
}
};



});