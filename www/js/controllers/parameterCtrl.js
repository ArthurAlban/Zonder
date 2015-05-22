zonder.controller('parameterCtrl', function($window, $scope, $state, $ionicSlideBoxDelegate, $ionicModal, $ionicActionSheet, UserService, $ionicPlatform, $cordovaPush) {
	
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
  // $scope.formIsValid = true;
  // $scope.formIsValid2 = true;
  // $scope.closeChangePassModal();
  $scope.oldPasswordPopup = false;
  $scope.newPasswordPopup = false;
  $scope.confirmChangePasswordPopup = false;

  $scope.oldPassValid = true;
  $scope.newPassValid = true;
  $scope.newPassValidDirty = false;
  $scope.repeatPassValid = true;

  $scope.closeChangePassModal();
};

// $scope.checkValidity = function(isValid) {
//   $scope.formIsValid = isValid;
//   $scope.oldPassMsg = false;
//   $scope.newPassMsg = false;
//   $scope.okPassMsg = false;
//   $scope.passEmpty = false;
//   $scope.passNotEqual = false;
// };

// $scope.checkValidity2 = function(isValid2) {
//   $scope.formIsValid2 = isValid2;
//   $scope.oldPassMsg = false;
//   $scope.newPassMsg = false;
//   $scope.okPassMsg = false;
//   $scope.passEmpty = false;
//   $scope.passNotEqual = false;
// };

// $scope.confirmChange = function() {
//   if($scope.checkPass()) {
//     $scope.loadingChangePassword= true;
//     UserService.newPassword($scope.passs.oldPassword, $scope.passs.newPassword, $scope.passs.repeatPassword).then(function(data){
//       if(data.result == "oldPass"){
//         $scope.oldPassMsg = true;

//         $scope.newPassMsg = false;
//         $scope.okPassMsg = false;
//         $scope.passEmpty = false;
//         $scope.passNotEqual = false;

//       } 
//       else if(data.result == "newPass"){
//         $scope.newPassMsg = true;

//         $scope.oldPassMsg = false;
//         $scope.okPassMsg = false;
//         $scope.passEmpty = false;
//         $scope.passNotEqual = false;
//       }
//       else if(data.result == "passChanged"){
//         $scope.okPassMsg = true;

//         $scope.oldPassMsg = false;
//         $scope.newPassMsg = false;
//         $scope.passEmpty = false;
//         $scope.passNotEqual = false;

//         $scope.clearAndClose();
//       }
//       $scope.loadingChangePassword = false;
//     },function(status) {
//       console.log("impossible de changer le mot de pass");
//       $scope.loadingChangePassword = false;
//     });
//   }
// };

$scope.oldPassValid = true;
$scope.newPassValid = true;
$scope.newPassValidDirty = false;
$scope.repeatPassValid = true;


$scope.setOldPassValid = function(){
  $scope.oldPassValid = true;
};

$scope.checkEmptyFields = function(){
  console.log("checkEmptyFields");
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
  console.log("checkIdenticPassword");
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
 console.log("checkChangePassServer");
 console.log("$scope.passs.oldPassword" + $scope.passs.oldPassword);
 console.log("$scope.passs.newPassword" + $scope.passs.newPassword);
 console.log("$scope.passs.repeatPassword" + $scope.passs.repeatPassword);

 UserService.newPassword($scope.passs.oldPassword, $scope.passs.newPassword, $scope.passs.repeatPassword).then(function(data){
  console.log("befort");
  if(data.result == "oldPass"){
    console.log("oldPass");
    $scope.oldPassValid = false;
  } 
  else if(data.result == "newPass"){
    console.log("newPass");
    $scope.newPassValid = false;
  }
  else if(data.result == "passChanged"){
    console.log("passChanged");
    $scope.clearAndClose();
  }
  console.log("aftert");
},function(status) {
  console.log("impossible de changer le mot de pass");
});
};


$scope.checkPasswordIsValid = function(){
  console.log("checkPasswordIsValid");
  var rePass = new RegExp("^[a-zA-Z0-9]{5,50}$");
  if($scope.passs.newPassword.length > 5){
    console.log("aaa");
    if(rePass.test($scope.passs.newPassword)){
      console.log("bbbb");
      $scope.newPassValid = true;
      $scope.newPassValidDirty = true;
    }
    else{
      console.log("cccccc");
      $scope.newPassValid = false;
      $scope.newPassValidDirty = false;
    }
  }
  else{
    console.log("ddddd");
    $scope.newPassValid = false;
    $scope.newPassValidDirty = false;
  }
};

$scope.changePass = function(){
  $scope.checkEmptyFields();
  console.log("1");
  $scope.checkIdenticPassword();
  console.log("2");
  $scope.checkPasswordIsValid();
  console.log("3");
  if(!$scope.oldPassValid || !$scope.newPassValid || !$scope.repeatPassValid){
    console.log("4");
  }
  else{
    console.log("5");
    $scope.checkChangePassServer();
    console.log("6");
  }
};

////////////// log out /////////////////
$scope.logOut = function() {
  if($window.localStorage['isLog'] == "true") {
   $ionicPlatform.ready(function () {
    var options = {};
    $cordovaPush.unregister(options).then(function(result) {
        console.log("tokeneeeee " + $window.localStorage['deviceToken']);

      UserService.unregisterDevice($window.localStorage['deviceToken']).then(function(){
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

          $state.go('animatedSplashscreen');
          

        },function(status) {
          console.log("Logout Impossible");
        });
      }, function(satus){
        console.log("error in unregisterDevice" + msg);
      }); 
    }, function(err) {
      console.log("error in cordovaPush.unregister");
    });
  });
 }
};


});