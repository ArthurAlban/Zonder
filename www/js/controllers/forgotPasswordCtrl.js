zonder.controller('forgotPasswordCtrl', function($scope, $state, UserService, $window) {

$scope.data = {};
$scope.displayMailerror = false;

// $scope.loadingForgotPasswordBlur = false;
// $scope.loadingForgotPassword = false;

$scope.setDisplayMailErrorFalse = function(){
  $scope.displayMailerror = false;
};

$scope.login = function() {
    $state.go("animatedSplashscreen");
  };

$scope.sendNewPassword = function(mail){
  // $scope.loadingForgotPassword = true;
  // $scope.loadingForgotPasswordBlur = true;
  UserService.checkEmail(mail).then(function(data){
    if(data.result == "notFound")  {
      $scope.displayMailerror = true;
      // $scope.loadingForgotPassword = false;
      // $scope.loadingForgotPasswordBlur = false;
    }
    if(data.result == "found"){ 
    	UserService.resetPassword(mail).then(function(data){
      // $scope.loadingForgotPassword = false;
      $window.setTimeout(function() { 
        // $scope.loadingForgotPasswordBlur = false;
        $scope.toLogin();
      }, 1000);
    }, function(msg){
      console.log("msg " + msg);
      // $scope.loadingForgotPassword = false;
      // $scope.loadingForgotPasswordBlur = false;
    });
  }
},function(status) {
  console.log("impossible de vérifier l'email");
  // $scope.loadingForgotPassword = false;
  // $scope.loadingForgotPasswordBlur = false;
});
};

});