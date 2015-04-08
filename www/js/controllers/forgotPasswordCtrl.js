zonder.controller('forgotPasswordCtrl', function($scope, $state, UserService, $window) {

$scope.data = {};
$scope.displayMailerror = false;

$scope.setDisplayMailErrorFalse = function(){
	console.log("hiha31");
  $scope.displayMailerror = false;
};

$scope.toLogin = function() {
    $state.go("animatedSplashscreen");
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
        $scope.toLogin();
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