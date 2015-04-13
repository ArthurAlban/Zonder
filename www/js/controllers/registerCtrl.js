zonder.controller('registerCtrl', function($scope, $state, $ionicPlatform, $ionicSlideBoxDelegate, $rootScope, $ionicActionSheet, $cordovaCamera, UserService) {
	$scope.userData = {};

	$scope.userData.email = "";
	$scope.userData.password = "";
	$scope.userData.confirmPassword = "";
	$scope.userData.pseudo = "";
	$scope.userData.isMale = false;
	$scope.userData.isFemale = false;
	$scope.userData.photo = "img/camera.png";

	$scope.displayNextButton = true;
	
	$scope.mailIsValid = true;
	$scope.identicPasswords = true;
	$scope.pseudoIsValid = true;
	$scope.genderIsValid = true;
	$scope.photoHasChanged = false;

	$scope.firstStepValid = false;
	$scope.secondStepValid = false;

	$scope.disableSwipe = function() {
		$ionicSlideBoxDelegate.enableSlide(false);
	};
	
	$scope.nextStepRegister = function(){
		//$scope.checkFirstStep();
		//if($scope.firstStepValid){
			$ionicSlideBoxDelegate.next();
			//$scope.displayNextButton = false;
		//}
	};

	$scope.login = function() {
		$state.go("animatedSplashscreen");
	};


	$scope.checkEmail = function(){
		if($scope.userData.email.length){
			var reMail = new RegExp("^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-z]{2,4})$");
			if(reMail.test($scope.userData.email)){
				UserService.checkEmail($scope.userData.email).then(function(data){
					if(data.result == "notFound")  {
						$scope.mailIsValid = true;
						$scope.openWhoAreYouModal();
					}
					if(data.result == "found"){
						$scope.mailIsValid = false;
						$window.setTimeout(function() {
							$scope.mailIsValid = true;
							$scope.$apply();
						}, 5000);
					}
				},function(status) {
					console.log("impossible de vérifier l'email");
				});
			}
		}
		else {
			$scope.mailIsValid = false;
		}
	};

	$scope.checkPasswords = function(){
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
	};

	$scope.checkPseudo = function(){
		if($scope.userData.pseudo.length > 3){
			UserService.checkPseudo($scope.userData.pseudo).then(function(data){
				if(data.result == "notFound")  {
					console.log("notfound");
					$scope.pseudoIsValid = true;
				}
				if(data.result == "found"){
					console.log("found");
					$scope.pseudoIsValid = false;
					$window.setTimeout(function() { 
						$scope.pseudoIsValid = true;
					}, 4000);
				}
			},function(status){ 
				console.log("Impossible de verifier le pseudo");
			});
		}
		else {
			$scope.pseudoIsValid = false;
		}
	};

	$scope.checkIfEmptyFields = function(){
		if((!$scope.userData.email.length) || (!$scope.userData.password.length) || (!$scope.userData.confirmPassword.length) || (!$scope.userData.pseudo.length)){
			$scope.mailIsValid = new Boolean($scope.userData.email.length);
			var passwordIsEmpty = new Boolean($scope.userData.password.length);
			var passwordConfirmIsEmpty = new Boolean($scope.userData.password.length);
			$scope.identicPasswords = (passwordIsEmpty && passwordConfirmIsEmpty);
			$scope.pseudoIsValid = new Boolean($scope.userData.pseudo.length);
			return true;
		}
		else{
			return false;
		}
	};

	$scope.checkFirstStep = function(){
		if(!$scope.checkIfEmptyFields){
			$scope.checkPasswords();
			if($scope.identicPasswords && $scope.mailIsValid && $scope.pseudoIsValid){
				$scope.firstStepValid = true;
			}
		}	
		else {
			$scope.firstStepValid = false;
		}
	};

	$scope.checkMale = function(){
		$scope.userData.isMale = true;
		$scope.userData.isFemale = false;
	};

	$scope.checkFemale = function(){
		$scope.userData.isMale = false;
		$scope.userData.isFemale = true;
	};

	$scope.checkSecondStep = function(){
		if($scope.userData.isMale || $scope.userData.isFemale){
			$scope.secondStepValid = true;
		}
		else{
			$scope.secondStepValid = false;
			$scope.genderIsValid = false;
		}
	};

	$scope.signUp = function() {
		$scope.checkSecondStep();
		if($scope.secondStepValid){
			UserService.signUp($scope.userData).then(function(){
				UserService.sendSignUpMail($scope.userData.email, $scope.userData.password).then(function(){
					UserService.logIn($scope.userData.email, $scope.userData.password).then(function(d){
						$window.localStorage['isLog'] = "true";
						$window.localStorage['token'] = d.token;
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
						}, function(msg){
							console.log(msg);
						});
					},function(msg){
						console.log(msg);
					});
				},function(m){
					console.log("Impossible de sendemail");
				});
},function(status){
	console.log("Impossible de signUp");
});
}
};


$scope.changeProfilePicture = function(){
	console.log("changeProfilePicture");
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

});