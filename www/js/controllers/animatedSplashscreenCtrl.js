zonder.controller('animatedSplashscreenCtrl', function($window,$scope, $rootScope, $state, $ionicPlatform, $ionicSlideBoxDelegate, UserService, $ionicModal) {
	$scope.animateTriangles = false;
	$ionicPlatform.ready(function() {
		$scope.animateTriangles = true;
		$scope.$apply();
	});

	// Called to navigate to the main app
   $scope.toLogin = function() {
   $ionicSlideBoxDelegate.slide(3);
  };

  $scope.toRegister = function() {
    $state.go("register");
  };

  //  $scope.toforgotPassword = function() {
  //   $state.go("forgotPassword");
  // };

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

$scope.login = function (mail, password) {
 if(mail !== undefined && password !== undefined) {
    /*  $rootScope.loadingIndicator = $ionicLoading.show({
        template: "<div class='loadingTest'></div>",
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 600,
        showDelay: 500
      });*/
    UserService.logIn(mail, password).then(function(d){
      $window.localStorage['isLog'] = "true";
      $window.localStorage['token'] = d.token;
      $scope.displayMailError = false;
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
        $scope.toAnswer();
        //$rootScope.loadingIndicator.hide();
        }, function(m){
        });
      },function(status) {
        console.log("impossible de se loguer");
        $scope.displayMailError = true;
        $window.setTimeout(function() { 
          $scope.displayMailError = false;
          $scope.$apply();
        }, 3000);
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

$scope.toAnswer = function(){
  console.log("log");
  $state.go('home');
};

///////////// forgot pass /////////////////
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
  console.log("hiha31");
  $scope.displayMailerror = false;
};

$scope.sendNewPassword = function(mail){
  console.log("hiha1");
  UserService.checkEmail(mail).then(function(data){
    if(data.result == "notFound")  {
      console.log("hiha2");
      $scope.displayMailerror = true;
    }
    if(data.result == "found"){ 
      console.log("hiha3");
      UserService.resetPassword(mail).then(function(data){
      console.log("hiha4");
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

});