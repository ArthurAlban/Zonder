zonder.controller('animatedSplashscreenCtrl', function($window, $scope, $rootScope, $state, $ionicPlatform, $ionicSlideBoxDelegate, UserService, $ionicModal, $ionicActionSheet, $cordovaCamera, $cordovaPush, $cordovaKeyboard) {
  $scope.animateTriangles = false;
  $ionicPlatform.ready(function() {
    $scope.animateTriangles = true;
    $scope.$apply();
  });

	// Called to navigate to the main app
 $scope.toLogin = function() {
   $ionicSlideBoxDelegate.$getByHandle('toolTipSlider').slide(3);
 };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

  //////////////////////// Login slider ////////////////////////////////

  $scope.displayMailError = false;
  $scope.loadingLogin = false;
  $scope.user = new Array();
  $scope.user.mail = "";
  $scope.user.pass = "";

  $scope.setDisplayMailErrorFalse = function(){
    $scope.displayMailError = false;
  };

/*
  $scope.unregisterFromApp = function(){
   $ionicPlatform.ready(function () {
   $cordovaPush.unregister().then(function(result) {
      // Success!
      console.log("unregisterSSSS " + result);
    }, function(err) {
      // Error
    });
 }, function(err){
  console.log("err");
 });

 };
 */
 $scope.login = function (mail, password) {
  if(mail !== undefined && password !== undefined) {
      // $rootScope.loadingIndicator = $ionicLoading.show({
      //   template: "<div class='loadingTest'></div>",
      //   animation: 'fade-in',
      //   showBackdrop: true,
      //   maxWidth: 600,
      //   showDelay: 500
      // });
UserService.logIn(mail, password).then(function(d){
  $window.localStorage['isLog'] = "true";
  $window.localStorage['token'] = d.token;
  // $scope.displayMailError = false;
  $ionicPlatform.ready(function() {
    // $cordovaPush.register({badge: true, sound: true, alert: true}).then(function(result) {
    //   $window.localStorage['deviceToken'] = result;
    //   UserService.registerDevice({device: result}).then(function(){

       UserService.getUserInfoForLocalStorage().then(function(data){

        $window.localStorage['pseudo'] = data.pseudo;
        $window.localStorage['email'] = data.email;
        $window.localStorage['gender'] = data.gender;
        $window.localStorage['photo'] = data.photo;
        if(data.notifFriends) {
          $window.localStorage['notifFriends'] = "true";
        }
        else {
          $window.localStorage['notifFriends'] = "false";
        }           
        if(data.notifPolls) {
          $window.localStorage['notifPolls'] = "true";
        }
        else {
          $window.localStorage['notifPolls'] = "false";
        }
        $scope.toHome();
        //$rootScope.loadingIndicator.hide();
      }, function(m){

      });

  //    }, function (err) {
  //     //registerDevice
  //     console.log(err);
  //   });

  //   }, function(message){
  //   //registerCordova
  //   console.log(message);
  // });

});

},function(status) {
  console.log("impossible de se loguer");
      //$scope.displayMailError = true;
      // $window.setTimeout(function() { 
      //   $scope.displayMailError = false;
      //   $scope.$apply();
      // }, 3000);
});


}

};

$scope.validLogin = function() {
  var reMail = new RegExp("^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-z]{2,4})$");
  var rePass = new RegExp("^[a-zA-Z0-9]{5,50}$");
  if(reMail.test($scope.user.mail) && rePass.test($scope.user.pass)) {
   // $scope.userData = angular.copy(user);
   $scope.login($scope.user.mail, $scope.user.pass);
 }
 else{
  $scope.displayMailError = true;
}

};  

$scope.isUnchanged = function (user){
  return angular.equals(user, $scope.userData);
};

$scope.toHome = function(){
  console.log("toHome");
  $state.go('home');
  console.log("toHome2");
};

///////////// forgot pass /////////////////
$scope.mailForgotPasswordPopup = false;

$scope.displayMailForgotPasswordPopup = function(){
  $scope.mailForgotPasswordPopup = true;
}
$ionicModal.fromTemplateUrl('modals/forgotPassword.html', {
  scope: $scope,
  animation: 'slide-in-right'
}).then(function(modal) {
  $scope.forgotPassword = modal;
});

$scope.openForgotPasswordModal = function() {
  $scope.forgotPassword.show();
};

$scope.closeForgotPasswordModal = function() {
  $scope.forgotPassword.hide();
  $scope.clearForgotPasswordModal();
};

$scope.$on('$destroy', function() {
  $scope.forgotPassword.remove();
});

$scope.$on('modal.hidden', function() {
});

$scope.$on('modal.removed', function() {
});

$scope.clearForgotPasswordModal = function(){
  $scope.data.mail = "";
  $scope.displayMailerror = false;
};

$scope.data = new Array();
$scope.data.mail = "";

$scope.displayMailerror = false;

$scope.setDisplayMailErrorFalse = function(){
  $scope.displayMailerror = false;
};

$scope.sendNewPassword = function(){
  var mail = $scope.data.mail;
  UserService.checkEmail(mail).then(function(data){
    if(data.result == "notFound")  {
      $scope.displayMailerror = true;
    }
    if(data.result == "found"){ 
      UserService.resetPassword(mail).then(function(data){
        $scope.closeForgotPasswordModal();
      }, function(msg){
        $scope.displayMailerror = true;
        console.log("msg " + msg);
      });
    }
  },function(status) {
    $scope.displayMailerror = true;
    console.log("impossible de vérifier l'email");
  });
};


////////////////// register   //////////////////////


//popup booleans
$scope.mailPopup = false;
$scope.passwordPopup = false;
$scope.pseudoPopup = false;
$scope.passwordIdenticalPopup = false;

$scope.displayMailPopup = function(){
  $scope.mailPopup = true;
};

$scope.displayPasswordPopup = function(){
  $scope.passwordPopup = true;
};

$scope.displayPseudoPopup = function(){
  $scope.pseudoPopup = true;
};

$scope.displayPasswordIdenticalPopup = function(){
  $scope.passwordIdenticalPopup = true;
};

//Methde appellée par la directive popup pour fermer la popup affichée
$scope.closepopups = function() {
  $scope.mailPopup = false;
  $scope.passwordPopup = false;
  $scope.pseudoPopup = false;
  $scope.mailForgotPasswordPopup = false;
  $scope.passwordIdenticalPopup = false;
};

$ionicModal.fromTemplateUrl('modals/registerModal.html', {
  scope: $scope,
  animation: 'slide-in-right'
}).then(function(modal) {
  $scope.registerModal = modal;
});

$scope.openRegisterModal = function() {
  $scope.registerModal.show();
};

$scope.closeRegisterModal = function() {
  $scope.clearRegisterModal();
  $scope.registerModal.hide();
};

$scope.$on('$destroy', function() {
  $scope.registerModal.remove();
});

$scope.$on('modal.hidden', function() {
});

$scope.$on('modal.removed', function() {
});

$scope.clearRegisterModal = function(){
  $scope.userData.email = "";
  $scope.userData.password = "";
  $scope.userData.confirmPassword = "";
  $scope.userData.pseudo = "";
  $scope.userData.photo = "img/camera.png";
  $scope.userData.isMale = false;
  $scope.userData.isFemale = false;
  $scope.userInfo.password = "";
  $scope.userInfo.email = "";
  $scope.userInfo.pseudo = "";
  $scope.userInfo.gender = "";
  $scope.userInfo.photo = "";
  $scope.mailIsValid = true;
  $scope.identicPasswords = true;
  $scope.pseudoIsValid = true;
  $scope.genderIsValid = true;
  $scope.photoHasChanged = false;
  $scope.passwordIsValid = true;
  $scope.passwordIsValidDirty = false;

  $scope.displayNextButton = true;
  $ionicSlideBoxDelegate.$getByHandle('registerSlider').slide(0);
};

//Pour serveur pas possible de new Array() route signup
$scope.userInfo = {};
$scope.userData = new Array();
$scope.userData.email = "";
$scope.userData.password = "";
$scope.userData.confirmPassword = "";
$scope.userData.pseudo = "";
$scope.userData.photo = "img/camera.png";
$scope.userData.isMale = false;
$scope.userData.isFemale = false;

$scope.mailIsValid = true;
$scope.identicPasswords = true;
$scope.pseudoIsValid = true;
$scope.genderIsValid = true;
$scope.photoHasChanged = false;
$scope.passwordIsValid = true;
$scope.passwordIsValidDirty = false;

$scope.displayNextButton = true;


$scope.disableSwipe = function() {
  $ionicSlideBoxDelegate.$getByHandle('registerSlider').enableSlide(false);
};

$scope.slideHasChangedInRegister = function(index){
  if(index == 0){
    $scope.disableSwipe();
    $scope.displayNextButton = true;
  }
};

$scope.nextStepRegister = function(){
  console.log("test");
  $scope.checkFirstStep();
  if($scope.firstStepValid){
    $ionicSlideBoxDelegate.$getByHandle('registerSlider').next();
    $scope.displayNextButton = false;
    $ionicSlideBoxDelegate.$getByHandle('registerSlider').enableSlide(true);
    $cordovaKeyboard.close();
  }
};

$scope.checkEmail = function(){
  if($scope.userData.email){
    if($scope.userData.email.length){
      var reMail = new RegExp("^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-z]{2,4})$");
      if(reMail.test($scope.userData.email)){
        UserService.checkEmail($scope.userData.email).then(function(data){
          if(data.result == "notFound")  {
            $scope.mailIsValid = true;
          }
          if(data.result == "found"){
            $scope.mailIsValid = false;
          }
        },function(status) {
          console.log("impossible de vérifier l'email");
          $scope.mailIsValid = false;
        });
      }
      else{
        $scope.mailIsValid = false;
      }
    }
    else {
      $scope.mailIsValid = false;
    }
  }
  else {
    $scope.mailIsValid = false;
  }
};

$scope.checkPasswords = function(){
  if($scope.userData.password && $scope.userData.confirmPassword){
    if(($scope.userData.password.length > 5) && ($scope.userData.confirmPassword.length > 5)) {
      if($scope.userData.password == $scope.userData.confirmPassword) {
        $scope.identicPasswords = true;
      }
      else {
        $scope.identicPasswords = false;
      }
    }
    else {
      $scope.identicPasswords = false;
    }
  }
  else{
    $scope.identicPasswords = false;
  }
};

$scope.checkPasswordIsValid = function(){
  var rePass = new RegExp("^[a-zA-Z0-9]{5,50}$");
  if($scope.userData.password.length > 5){
    if(rePass.test($scope.userData.password)){
      $scope.passwordIsValid = true;
      $scope.passwordIsValidDirty = true;
    }
    else{
      $scope.passwordIsValid = false;
      $scope.passwordIsValidDirty = false;
    }
  }
  else{
    $scope.passwordIsValid = false;
    $scope.passwordIsValidDirty = false;
  }
};

$scope.checkPseudo = function(){
  if($scope.userData.pseudo){
    if($scope.userData.pseudo.length > 3){
      $scope.userData.pseudo = $scope.userData.pseudo.toLowerCase();
      UserService.checkPseudo($scope.userData.pseudo).then(function(data){
        if(data.result == "notFound"){
          $scope.pseudoIsValid = true;
        }
        if(data.result == "found"){
          $scope.pseudoIsValid = false;
        }
      },function(status){ 
        console.log("Impossible de verifier le pseudo");
        $scope.pseudoIsValid = false;
      });
    }
    else {
      $scope.pseudoIsValid = false;
    }
  }
  else {
    $scope.pseudoIsValid = false;
  }
};

$scope.checkFirstStep = function(){
  $scope.checkPasswords();
  $scope.checkEmail();
  $scope.checkPseudo();
  $scope.checkPasswordIsValid();
  if(!$scope.identicPasswords || !$scope.pseudoIsValid || !$scope.mailIsValid || !$scope.passwordIsValid){
    $scope.firstStepValid = false;
  }
  else{
    $scope.firstStepValid = true;
  }
};

$scope.checkMale = function(){
  $scope.userData.isMale = true;
  $scope.userData.isFemale = false;
  $scope.genderIsValid = true;

};

$scope.checkFemale = function(){
  $scope.userData.isMale = false;
  $scope.userData.isFemale = true;
  $scope.genderIsValid = true;
};

$scope.changeProfilePicture = function(){
  var options = {
    quality: 99,
    destinationType: $rootScope.destinationType,
    sourceType: $rootScope.pictureSource,
    allowEdit: true,
    encodingType: Camera.EncodingType.JPEG,
    targetWidth: 150,
    targetHeight: 150,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: false
  };
  $cordovaCamera.getPicture(options).then(function(imageData) {
    $scope.userData.photo = "data:image/jpeg;base64," + imageData;
    $scope.photoHasChanged = true;
  }, function(err) {
  });
};

$scope.showActionSheetPhotoSource = function() {
  $ionicActionSheet.show({
    titleText: 'Choose your profile photo',
    buttons: [
    { text: 'Album <i class="icon ion-images"></i>' },
    { text: 'Camera <i class="icon ion-camera"></i>' },
    ],
    cancelText: 'Annuler',
    cancel: function() {
    },
    buttonClicked: function(index) {
      if(index == 0){
        $rootScope.pictureSource = Camera.PictureSourceType.PHOTOLIBRARY;
        $scope.changeProfilePicture();
      }
      if(index == 1){
        $rootScope.pictureSource = Camera.PictureSourceType.CAMERA;
        $scope.changeProfilePicture();
      }
      return true;
    }
  });
};

$scope.checkSecondStep = function(){
  if($scope.userData.isMale || $scope.userData.isFemale){
    $scope.signUp();
  }
  else{
    $scope.genderIsValid = false;
  }
};

$scope.toHomeSignUp = function(){
  console.log("toHomeSignUp");
  $state.go('home');
  $scope.closeRegisterModal();
};

$scope.signUp = function() {
  $scope.userInfo.password = $scope.userData.password;
  $scope.userInfo.email = $scope.userData.email;
  $scope.userInfo.pseudo = $scope.userData.pseudo;
  if($scope.userData.photo == "img/camera.png"){
    $scope.userInfo.photo = "img/noProfilePic.png";
  }
  else{
    $scope.userInfo.photo = $scope.userData.photo;
  }
  
  if($scope.userData.isMale == true){
    $scope.userInfo.gender = true;
  } 
  else {
    $scope.userInfo.gender = false;
  }
  UserService.signUp($scope.userInfo).then(function(){
    UserService.sendSignUpMail($scope.userInfo.email, $scope.userInfo.password).then(function(){
      UserService.logIn($scope.userInfo.email, $scope.userInfo.password).then(function(d){
        $window.localStorage['isLog'] = "true";
        $window.localStorage['token'] = d.token;
        //$ionicPlatform.ready(function () {
         //$cordovaPush.register({badge: true, sound: true, alert: true}).then(function (result) {
          //UserService.registerDevice({device: result}).then(function(){
            UserService.getUserInfoForLocalStorage().then(function(data){
              $window.localStorage['pseudo'] = data.pseudo;
              $window.localStorage['email'] = data.email;
              $window.localStorage['gender'] = data.gender;
              $window.localStorage['photo'] = data.photo;
              if(data.notifFriends) {
                $window.localStorage['notifFriends'] = "true";
              }
              else {
                $window.localStorage['notifFriends'] = "false";
              }           
              if(data.notifPolls) {
                $window.localStorage['notifPolls'] = "true";
              }
              else {
                $window.localStorage['notifPolls'] = "false";
              }
              $scope.toHomeSignUp();
            }, function(msg){
              console.log(msg);
            });
          // },function(m){
          //   console.log(m);
          // });
        // }, function(){
        //   console.log("error in $cordovaPushregister");
        // });
//});



},function(msg){
  console.log(msg);
});
},function(m){
  console.log("Impossible de sendemail");
});
},function(status){
  console.log("Impossible de signUp");
});

};


});