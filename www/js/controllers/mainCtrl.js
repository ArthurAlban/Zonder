zonder.controller('mainCtrl', function($window, $scope, $state, $rootScope, $ionicModal, $ionicSlideBoxDelegate, $ionicActionSheet, $cordovaCamera, UserService, PollService, $ionicLoading, $ionicPlatform, $cordovaKeyboard) {

 $scope.startDifferentLoadingLogIn = function(){
  if(!$rootScope.loadingLogIn) {
    console.log("$rootScope.showHome" + $rootScope.showHome);
    $rootScope.loadingIndicator = $ionicLoading.show({
      templateUrl:'templates/loading.html',
      animation: 'fade-in',
      showBackdrop: false,
    });
  }
};

$scope.loadingCreateZonder = false;
$scope.showInfoCreateZonder = false;
$scope.showInfoErrorCreateZonder = false;

$scope.startDifferentLoadingLogIn();

$scope.goToProfile = function(){
  $state.go('showProfile');
};

$scope.myPhoto = $window.localStorage['photo'];
$scope.myPseudo = $window.localStorage['pseudo'];

if($window.localStorage['notifPolls'] == "true"){
  $scope.acceptNotifPolls = true;
}
else{
  $scope.acceptNotifPolls = false;
}

if($window.localStorage['notifFriends'] == "true"){
  $scope.acceptNotifFriends = true;
}
else{
  $scope.acceptNotifFriends = false;
}


  //////////////// Notifications Friends / Poll /////////////////////

  $scope.changeAcceptNotifFriends = function(){
    $scope.acceptNotifFriends = !$scope.acceptNotifFriends;
    console.log("changeAcceptNotifFriends + $scope.acceptNotifFriends " + $scope.acceptNotifFriends);
    UserService.notificationFriends($scope.acceptNotifFriends).then(function(){
      if($scope.acceptNotifFriends){
        $window.localStorage['notifFriends'] = "true";
      }
      else{
        $window.localStorage['notifFriends'] = "false";
      }
    }, function(satus){
      console.log("Error in notificationFriends");
    });

  };

  $scope.changeAcceptNotifPolls = function(){
    $scope.acceptNotifPolls = !$scope.acceptNotifPolls;
    console.log("changeAcceptNotifPolls + $scope.acceptNotifPolls " + $scope.acceptNotifPolls);
    UserService.notificationPolls($scope.acceptNotifPolls).then(function(){
      if($scope.acceptNotifPolls){
        $window.localStorage['notifPolls'] = "true";
      }
      else{
        $window.localStorage['notifPolls'] = "false";
      }
    }, function(satus){
      console.log("Error in notificationsPolls");
    });

  };

  //////////////////////// Change Profile Photo////////////////////////////////

  $scope.changeProfilePicture = function(){
    var options = {
      quality: 99,
      destinationType: $rootScope.destinationType,
      sourceType: $rootScope.pictureSource,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 150,
      targetHeight: 150,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.myPhoto = "data:image/jpeg;base64," + imageData;
      UserService.setPhotoUser($scope.myPhoto).then(function(data){
        $window.localStorage['photo'] = $scope.myPhoto;
      }, function(status){
        console.log("Erreur lors de la modification de la photo de profil")
      });
    }, function(err) {
      // error
    });
  };


  $scope.showActionSheetPhotoSource = function() {

    $ionicActionSheet.show({
      titleText: 'Choose your profile photo',
      buttons: [
      { text: 'Album <i class="icon ion-images"></i>' },
      { text: 'Camera <i class="icon ion-camera"></i>' },
      ],
      cancelText: 'Cancel',
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

////////////////////////// Create Poll  ///////////////////////////////////////

$scope.timePickerIsOpen = false;
$scope.timeIsSelected = false;
$scope.animateHideTimePicker = false;

$scope.openTimePicker = function(){
  $scope.timePickerIsOpen = true;
};

$scope.chooseTime = function(){
  $scope.timePickerIsOpen = false;
  window.setTimeout(function() {
   $scope.timeIsSelected = true;
   $scope.checkOptionInCreatePoll();
   $scope.$apply();
 }, 500);

};

$scope.hours = 1;
$scope.decadeMinutes = 0;
$scope.unitMinutes = 0;

$scope.increaseHours = function(){
  if($scope.hours > 8){
    $scope.hours = 1;
  }
  else{
    $scope.hours = ($scope.hours + 1)%10;
  }
};

$scope.decreaseHours = function(){
  if($scope.hours <= 1){
    $scope.hours = 9;
  }
  else {
   $scope.hours--;
 }
};

$scope.increaseDecadeMinutes = function(){
  if($scope.decadeMinutes == 3){
    $scope.decadeMinutes = 0;
  }
  else{
    $scope.decadeMinutes = 3;
  }
};

$scope.decreaseDecadeMinutes = function(){
  if($scope.decadeMinutes == 3){
    $scope.decadeMinutes = 0;
  }
  else{
    $scope.decadeMinutes = 3;
  }
};

$scope.targetPickerIsOpen = false;
$scope.targetIsSelected = false;

$scope.openTargetPicker = function(){
  $scope.targetPickerIsOpen = true;
};

$scope.chooseRange = function(){
  $scope.targetPickerIsOpen = false;
  $scope.targetIsSelected = true;
  $scope.checkOptionInCreatePoll();
};

$scope.hundredPeopleRange = 0;
$scope.decadePeopleRange = 1;
$scope.unitPeopleRange = 0;

$scope.increaseHundredPeopleRange = function(){
  if($scope.hundredPeopleRange > 8){
    $scope.hundredPeopleRange = 0;
  }
  else{
    $scope.hundredPeopleRange = ($scope.hundredPeopleRange + 1)%10;
  }
};

$scope.decreaseHundredPeopleRange = function(){
  if($scope.hundredPeopleRange <= 0){
    $scope.hundredPeopleRange = 9;
  }
  else {
   $scope.hundredPeopleRange--;
 }
};

$scope.increaseDecadePeopleRange = function(){
  if($scope.decadePeopleRange > 8){
    $scope.decadePeopleRange = 1;
  }
  else{
    $scope.decadePeopleRange = ($scope.decadePeopleRange + 1)%10;
  }
};

$scope.decreaseDecadePeopleRange = function(){
  if($scope.decadePeopleRange <= 1){
    $scope.decadePeopleRange = 9;
  }
  else {
   $scope.decadePeopleRange--;
 }
};


$ionicModal.fromTemplateUrl('modals/createZonderModal.html', {
  scope: $scope,
  animation: 'slide-in-right',
  backdropClickToClose: false
}).then(function(modal) {
  $scope.createZonderModal = modal;
});

$scope.preloadModal = function(){
  $scope.openCreateZonderModal();
  window.setTimeout(function() {
   $scope.closeCreateZonderModal();
   $scope.$apply();
 }, 200);
};

$scope.openCreateZonderModal = function() {
  $scope.createZonderModal.show();
  $scope.initGoogleModal();
};

$scope.closeCreateZonderModal = function() {
  $scope.createZonderModal.hide();
  $scope.removeGoogleModal();
};

$scope.$on('$destroy', function() {
  $scope.createZonderModal.remove();
});

// $scope.$on('modal.hidden', function() {
//    console.log("hidden create zonder");
// });

// $scope.$on('modal.removed', function() {
//    console.log("remove create zonder");
// });

$scope.closeAndClearCreateZonderModal = function(){
  $scope.closeCreateZonderModal();
  $cordovaKeyboard.close();
  $scope.clearModal();
};

$scope.slideHasChangedInCreateZonder = function(index){
  if(index == 0){
    $scope.displayNextButtonQuestion = true;
    $scope.displayNextButtonChoosePhoto = false;
    $scope.showCloseButton = true;
  }
  if(index == 1){
    $scope.initTabImageToInternet();
    $scope.displayNextButtonQuestion = false;
    $scope.displayNextButtonChoosePhoto = true;
    $scope.displayCreateButton = false;
    $scope.showCloseButton = false;
  }
  if(index == 2){
  	$scope.displayNextButtonChoosePhoto = false;
  	$scope.displayCreateButton = true;
  }
};

$scope.disableSwipeCreateZonder = function() {
  $ionicSlideBoxDelegate.$getByHandle('createZonderSlider').enableSlide(false);
};

$scope.nothing = function(){
  console.log("nothing");
};

$scope.nextStepPhoto = function(){
  console.log("nextStepPhoto" + $scope.createPoll.question);
  $scope.displayNextButtonQuestion = false;
  $ionicSlideBoxDelegate.$getByHandle('createZonderSlider').next();
};

$scope.nextStepOption = function(){
  console.log("nextStepOption" + $scope.createPoll.question);
  $scope.displayNextButtonChoosePhoto = false;
  $ionicSlideBoxDelegate.$getByHandle('createZonderSlider').next();
};

$scope.backStep = function(){
  $ionicSlideBoxDelegate.$getByHandle('createZonderSlider').previous();
};

$scope.clearModal = function(){
  $scope.createPoll.photoLeft = "img/transparencyBackground.png";
  $scope.createPoll.photoRight = "img/transparencyBackground.png";
  $scope.createPoll.question = "";
  $scope.createPoll.namePhotoLeft = "";
  $scope.createPoll.namePhotoRight = "";
  $scope.createPoll.friendsConcerned = "";
  $scope.friendsConcerned.splice(0, $scope.friendsConcerned.length);
  $scope.createPoll.usersConcerned = 10;
  $scope.createPoll.timePoll = 3600;
  $scope.createPoll.gender = "";
  $scope.createPoll.range = "";
  $scope.displayButtonLeft = true;
  $scope.displayButtonRight = true;
  $scope.zonderInfo.friendPoll = false;
  $scope.zonderInfo.worldPoll = false;
  $scope.zonderInfo.femalePoll = false;
  $scope.zonderInfo.malePoll = false;
  $scope.zonderInfo.mixtPoll = false;
  $scope.showNextButtonForCreatePoll = false;
  $scope.showNextButtonForChoosePhoto = false;
  $scope.showFinishButtonCreatePoll = false;
  $scope.hundredPeopleRange = 0;
  $scope.decadePeopleRange = 1;
  $scope.unitPeopleRange = 0;
  $scope.hours = 1;
  $scope.decadeMinutes = 0;
  $scope.unitMinutes = 0;
  $scope.timeIsSelected = false;
  $scope.targetIsSelected = false;
  $scope.charLeft = 90;
  $scope.showSliderPhoto = false;
  $scope.loadingSondrFriends = false;
  $scope.friendsAreLoaded = false;
};

$scope.loadingSondrFriends = false;

$scope.showCloseButton = true;
$scope.displayNextButtonQuestion = true;

$scope.displayButtonLeft = true;
$scope.displayButtonRight = true;

$scope.friendsConcerned = new Array();
$scope.friends = new Array();
$scope.friendsAreLoaded = false;

$scope.search = {};
$scope.search.googleSearch = "";

$scope.createPoll = {};
$scope.createPoll.question = "";
$scope.createPoll.photoLeft = "img/transparencyBackground.png";
$scope.createPoll.photoRight = "img/transparencyBackground.png";

$scope.createPoll.namePhotoLeft = "";
$scope.createPoll.namePhotoRight = "";
$scope.createPoll.friendsConcerned = "";
$scope.createPoll.usersConcerned = 10;
$scope.createPoll.timePoll = 3600;
$scope.createPoll.gender = "";
$scope.createPoll.range = "";

$scope.showSliderPhoto = false;
/////////////////  slider question /////////////////////////
$scope.charLeft = 90;

$scope.charactersLeft = function(){
  $scope.showSliderPhoto = true;
  var resSplit = $scope.createPoll.question.split("\n");
  var nbLineBreak = resSplit.length - 1;
  /*if($scope.createPoll.question.length == 0 || $scope.createPoll.question.length == 1){
    nbLineBreak = 0;
  }*/
  console.log("nbLineBreak" + nbLineBreak);
  $scope.charLeft = (90 - ($scope.createPoll.question.length + nbLineBreak));
  if($scope.createPoll.question.length > 2){
    $scope.showNextButtonForCreatePoll = true;
  }
  else{
    $scope.showNextButtonForCreatePoll = false;
  }
};


/////////////////  slider choose photo /////////////////////////

$scope.showNextButtonForChoosePhoto = false;

var viewportWidth = window.screen.width * window.devicePixelRatio.toFixed(1);
var viewportHeightPixel = window.screen.height * 0.55;

var viewportHeight= viewportHeightPixel * window.devicePixelRatio.toFixed(1);
var angleRad = Math.atan(viewportHeight/viewportWidth);

$scope.photoSkewAngleDegBackground = (90 - (angleRad * (180 / Math.PI)))*(-1);
$scope.photoSkewAngleDegImage = 90 - (angleRad * (180 / Math.PI));

$scope.checkChoicePhotoInCreatePoll = function(){
  if(($scope.createPoll.namePhotoLeft.length > 2) && ($scope.createPoll.namePhotoRight.length > 2)){
    $scope.showNextButtonForChoosePhoto = true;
  }
  else {
    $scope.showNextButtonForChoosePhoto = false;
  }
};

$scope.imgLeftInfo = {};
$scope.imgRightInfo = {};

$scope.choosePhotoLeft = function(){
  var options = {
    quality: 50,
    destinationType: $rootScope.destinationType,
    sourceType: $rootScope.pictureSource,
    allowEdit: false,
    encodingType: Camera.EncodingType.JPEG,
    targetWidth: 500,
    targetHeight: 500,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: false
  };

  $cordovaCamera.getPicture(options).then(function(imageData) {
    $scope.createPoll.photoLeft = "data:image/jpeg;base64," + imageData;

    async.series([function(callback){
      var image = new Image();
      image.src = $scope.createPoll.photoLeft;
      image.onload = function(){
        $scope.imgLeftInfo.imgWidth = image.width;
        $scope.imgLeftInfo.imgHeight = image.height;
        callback();
      };
    },function(callback){
      $scope.imgLeftInfo = $scope.setPositionImage(true, $scope.imgLeftInfo.imgWidth, $scope.imgLeftInfo.imgHeight);
      callback();
    }], function(err, res){
      $scope.displayButtonLeft = false;
      $scope.$apply();
      callback();
    });
  }, function(err) {
      // error
      // $scope.checkPhotoInCreatePoll();
    });
};


$scope.showActionSheetPhotoSourceForPhotoLeft = function() {
  $ionicActionSheet.show({
    titleText: 'Choose your profile photo',
    buttons: [
    { text: 'Album <i class="icon ion-images"></i>' },
    { text: 'Camera <i class="icon ion-camera"></i>' },
    { text: 'Internet <i class="icon ion-earth"></i>' },
    ],
    cancelText: 'Cancel',
    cancel: function() {
    },
    buttonClicked: function(index) {
      if(index == 0){
        $rootScope.pictureSource = Camera.PictureSourceType.PHOTOLIBRARY;
        $scope.choosePhotoLeft();
      }
      if(index == 1){
        $rootScope.pictureSource = Camera.PictureSourceType.CAMERA;
        $scope.choosePhotoLeft();
      }
      if(index == 2){
        $scope.sideImage = "left";
        $scope.openChooseGooglePhotoModal();
      }
      return true;
    }
  });
};

$scope.choosePhotoRight = function(){
  var options = {
    quality: 50,
    destinationType: $rootScope.destinationType,
    sourceType: $rootScope.pictureSource,
    allowEdit: false,
    encodingType: Camera.EncodingType.JPEG,
    targetWidth: 500,
    targetHeight: 500,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: false
  };

  $cordovaCamera.getPicture(options).then(function(imageData) {
    $scope.createPoll.photoRight = "data:image/jpeg;base64," + imageData;
    async.series([function(callback){
      var image = new Image();
      image.src = $scope.createPoll.photoRight;
      image.onload = function(){
        $scope.imgRightInfo.imgWidth = image.width;
        $scope.imgRightInfo.imgHeight = image.height;
        callback();
      };
    },function(callback){
      $scope.imgRightInfo = $scope.setPositionImage(false, $scope.imgRightInfo.imgWidth, $scope.imgRightInfo.imgHeight);
      callback();
    }], function(err, res){
      $scope.displayButtonRight = false;
      $scope.$apply();
      callback();
    });
  }, function(err) {
    // $scope.checkPhotoInCreatePoll();
  });
};

$scope.showActionSheetPhotoSourceForPhotoRight = function() {
  $ionicActionSheet.show({
    titleText: 'Choose your profile photo',
    buttons: [
    { text: 'Album <i class="icon ion-images"></i>' },
    { text: 'Camera <i class="icon ion-camera"></i>' },
    { text: 'Internet <i class="icon ion-earth"></i>' },
    ],
    cancelText: 'Cancel',
    cancel: function() {
    },
    buttonClicked: function(index) {
      if(index == 0){
        $rootScope.pictureSource = Camera.PictureSourceType.PHOTOLIBRARY;
        $scope.choosePhotoRight();
      }
      if(index == 1){
        $rootScope.pictureSource = Camera.PictureSourceType.CAMERA;
        $scope.choosePhotoRight();
      }
      if(index == 2){
        $scope.sideImage = "right";
        $scope.openChooseGooglePhotoModal();
      }
      return true;
    }
  });
};

/////////////////  slider option create poll /////////////////////////

$scope.showFinishButtonCreatePoll = false;

$scope.queriesForFriendInfoCreatePoll = new Array();
$scope.queriesForFriendPhotoCreatePoll = new Array();

$scope.zonderInfo = new Array();
$scope.zonderInfo.friendPoll = false;
$scope.zonderInfo.worldPoll = false;
$scope.zonderInfo.femalePoll = false;
$scope.zonderInfo.malePoll = false;
$scope.zonderInfo.mixtPoll = false;

$scope.animateFriends = false;
$scope.animateTarget = false;


$scope.checkOptionInCreatePoll = function(){
  if($scope.timeIsSelected){
    if($scope.createPoll.gender != ""){
      if($scope.createPoll.range != ""){
        if($scope.zonderInfo.friendPoll){
          for(friend in $scope.friends){
            if($scope.friends[friend].selected){
              $scope.showFinishButtonCreatePoll = true;
            }
            else{
              $scope.showFinishButtonCreatePoll = false;
            }
          }
        }
        if($scope.zonderInfo.worldPoll){
          if($scope.targetIsSelected){
           $scope.showFinishButtonCreatePoll = true;
         }
         else{
          $scope.showFinishButtonCreatePoll = false;
        }
      }
    }
  }
}
};


$scope.setFriendPoll  = function() {
  $scope.zonderInfo.friendPoll = true;
  $scope.zonderInfo.worldPoll = false;
  $scope.animateFriends = true;
  $scope.animateTarget = false;
  $scope.createPoll.range = "Amis";
  $scope.updateFriendsCreatePoll();
  $scope.checkOptionInCreatePoll();
};

$scope.setWorldPoll  = function() {
  $scope.zonderInfo.friendPoll = false;
  $scope.zonderInfo.worldPoll = true;
  $scope.animateFriends = false;
  $scope.animateTarget = true;
  $scope.createPoll.range = "Monde";
  // $scope.updateFriendsCreatePoll();
  $scope.checkOptionInCreatePoll();
};

$scope.sendNotif = function(){
  UserService.sendNotif().then(function(data){
    console.log("Cest envoyé");
  }, function(status){
    console.log("Cest pas envoyé");
  });
};

$scope.getFriendsCreatePoll = function(callback){
  console.log("jy suis");
  UserService.getAllFriends().then(function(data){
    $scope.friends = data.friends;
    console.log("friends" + JSON.stringify(data.friends));
    angular.forEach($scope.friends, function(f, k){
      if(!f.gender){
        f.photo = "img/profilTest.png";
      }
      else{
        f.photo = "img/louis.png";
      }

    });

    async.parallel([$scope.getFriendsInfosCreatePoll, $scope.getFriendsPhotosCreatePoll], function(err, res){
      callback();
    });
  }, function(status){
    console.log("Impossible de récuperer les utilisateurs");
  });
};

$scope.getFriendsInfosCreatePoll = function(callback){
  angular.forEach($scope.friends, function(friend, key){
    var q = function(callback){
      UserService.getFriendInfoFromId(friend.id).then(function(d){
        angular.forEach($scope.friends, function(f, k){
          if(f.id == friend.id){
            f.pseudo = d.pseudo;
            f.selected = false;
            f.gender = d.gender;
          }
        });
        callback();
      }, function(status){
        console.log("Impossible de recuperer les infos d'un utilisateur");
      });
    };
    $scope.queriesForFriendInfoCreatePoll.push(q);
  });
  callback();
};

$scope.getFriendsPhotosCreatePoll = function(callback){
  angular.forEach($scope.friends, function(friend, key){
    var q = function(callback){
      UserService.getFriendPhotoFromId(friend.id).then(function(d){
        angular.forEach($scope.friends, function(f, k){
          if(f.id == friend.id){
            f.photo = d.photo;
            callback();
          }
        });
      }, function(status){
        console.log("Impossible de récuperer la photo de l'utulisateur");
      });
    };
    $scope.queriesForFriendPhotoCreatePoll.push(q);
  });
  callback();
};

$scope.queriesExecInfoCreatePoll = function(callback){
  async.parallel($scope.queriesForFriendInfoCreatePoll, function(err, res){
    $scope.loadingSondrFriends = false;
    $scope.$apply();
    callback();
  });
};

$scope.queriesExecPhotoCreatePoll = function(callback){
  async.parallel($scope.queriesForFriendPhotoCreatePoll,function(err, res){
    callback();
  });
};

$scope.queriesParallelCreatePoll = function(callback) {
  async.parallel([$scope.queriesExecInfoCreatePoll, $scope.queriesExecPhotoCreatePoll], function(err, res){
    $scope.friendsAreLoaded = true;
    callback();
  });
};


$scope.updateFriendsCreatePoll = function(){
  console.log("loadFriends" + $scope.loadingSondrFriends);
  if(!$scope.loadingSondrFriends && !$scope.friendsAreLoaded){
    $scope.loadingSondrFriends = true;
    $scope.queriesForFriendPhotoCreatePoll.splice(0, $scope.queriesForFriendPhotoCreatePoll.length);
    $scope.queriesForFriendInfoCreatePoll.splice(0, $scope.queriesForFriendInfoCreatePoll.length);
    $scope.queriesForDeleteFriends.splice(0, $scope.queriesForDeleteFriends.length);

    $scope.friends.splice(0, $scope.friends.length);
    console.log("2");
    async.series([$scope.fillQueriesforDeleteFriends, $scope.queriesExecDeleteFriends, $scope.getFriendsCreatePoll, $scope.queriesParallelCreatePoll], 
      function(err, result){
        $scope.queriesForFriendPhotoCreatePoll.splice(0, $scope.queriesForFriendPhotoCreatePoll.length);
        $scope.queriesForFriendInfoCreatePoll.splice(0, $scope.queriesForFriendInfoCreatePoll.length);
        $scope.queriesForDeleteFriends.splice(0, $scope.queriesForDeleteFriends.length);
        $scope.$broadcast('reloadFriends');
        $scope.$apply();
      });
  }
};

$scope.deselectFriends = function(){
  for(f in $scope.friends){
    if($scope.zonderInfo.femalePoll){
      if($scope.friends[f].gender){
        if($scope.friends[f].selected ){
          $scope.friends[f].selected = false;
        }   
      }
    } else if($scope.zonderInfo.malePoll){
      if(!$scope.friends[f].gender){
        if($scope.friends[f].selected ){
          $scope.friends[f].selected = false;
        }   
      } 
    }
  }
};

$scope.updateAllFriendsSelected = function(){
  var isAllselected = true;

  if($scope.friends.length){
    if($scope.zonderInfo.femalePoll){
      var hasWoman = false;
      for(friend in $scope.friends){
        if(!$scope.friends[friend].gender){
          hasWoman = true;
          if(!$scope.friends[friend].selected){
            isAllselected = false;
          }
        }
      }
      if(!hasWoman){
        isAllselected = false;
      }
    }
    else if($scope.zonderInfo.malePoll){
      var hasMan = false;
      for(friend in $scope.friends){
        if($scope.friends[friend].gender){
          hasMan = true;
          if(!$scope.friends[friend].selected){
            isAllselected = false;
          }
        }
      }
      if(!hasMan){
        isAllselected = false;
      }
    }
    else{
      for(friend in $scope.friends){
        if(!$scope.friends[friend].selected){
          isAllselected = false;
        }
      }
    }
  }
  else{
    isAllselected = false;
  }
  return isAllselected;
};

$scope.selectAllFriends = function(){
  for(friend in $scope.friends){
    if($scope.zonderInfo.femalePoll){
      if(!$scope.friends[friend].gender){
        $scope.friends[friend].selected = !$scope.allFriendsSelected; 
      }
    }
    else if ($scope.zonderInfo.malePoll){
      if($scope.friends[friend].gender){
        $scope.friends[friend].selected = !$scope.allFriendsSelected; 
      }
    }
    else {
      $scope.friends[friend].selected = !$scope.allFriendsSelected;
    }
  }    
  $scope.allFriendsSelected = !$scope.allFriendsSelected;
  $scope.checkOptionInCreatePoll(); 
};

$scope.selectFriend = function(id, selected){
  for(friend in $scope.friends){
    if($scope.friends[friend].id == id){
      $scope.friends[friend].selected = !selected;
    }
  }
  $scope.allFriendsSelected = $scope.updateAllFriendsSelected();
  $scope.checkOptionInCreatePoll();
};

$scope.setFemalePoll = function() {
  $scope.createPoll.gender = "female";
  $scope.zonderInfo.femalePoll = true;
  $scope.zonderInfo.malePoll = false;
  $scope.zonderInfo.mixtPoll = false;
  $scope.deselectFriends();
  $scope.allFriendsSelected = $scope.updateAllFriendsSelected();
  $scope.checkOptionInCreatePoll();
};

$scope.setMalePoll = function() {
  $scope.createPoll.gender = "male";
  $scope.zonderInfo.femalePoll = false;
  $scope.zonderInfo.malePoll = true;
  $scope.zonderInfo.mixtPoll = false;
  $scope.deselectFriends();
  $scope.allFriendsSelected = $scope.updateAllFriendsSelected();
  $scope.checkOptionInCreatePoll();
};

$scope.setMixtPoll = function() {
  $scope.createPoll.gender = "mixte";
  $scope.zonderInfo.femalePoll = false;
  $scope.zonderInfo.malePoll = false;
  $scope.zonderInfo.mixtPoll = true;
  $scope.allFriendsSelected = $scope.updateAllFriendsSelected();
  $scope.checkOptionInCreatePoll();
};



//////////////// resize image ///////////////////


///// set position and info image IN CREATE ZONDER//////////////////

$scope.setPositionImage = function(imgLeft, imgWidth, imgHeight){
  var imgInfo = new Array();

  var viewportWidth = window.screen.width;
  var viewportHeight = window.screen.height * 0.55;
  if(imgWidth <= imgHeight){
    imgInfo = $scope.resizeImageWidth(imgLeft, imgWidth, imgHeight, viewportWidth, viewportHeight);
  }
  else{
    imgInfo = $scope.resizeImageHeight(imgWidth, imgHeight, viewportWidth, viewportHeight);
  }

  return imgInfo;
};

$scope.resizeImageWidth = function(imgLeft, imgWidth, imgHeight, divWidth, divHeight){

  var widthIncreaseFactor = divWidth / imgWidth;

  var finalHeightImg = widthIncreaseFactor * imgHeight;
  var posTopLeftY = (divHeight - finalHeightImg) / 2;

  var ratio = divWidth / divHeight;

  if(imgLeft){
    var positionLeft = posTopLeftY * ratio;
  }
  else{
    var positionLeft = -posTopLeftY * ratio;
  }

  var positionTop = posTopLeftY;
  var imgWidth = divWidth;
  var imgHeight = finalHeightImg;

  return {"positionLeft": positionLeft, "positionTop": positionTop, "imgWidth": imgWidth, "imgHeight": imgHeight};
};

$scope.resizeImageHeight = function(imgWidth, imgHeight, divWidth, divHeight){
  var heightIncreaseFactor = divHeight / imgHeight;

  var finalWidthImg = heightIncreaseFactor * imgWidth;
  var posTopLeftX = (divWidth - finalWidthImg) / 2;

  var positionLeft = posTopLeftX;
  var positionTop = 0;
  var imgWidth = finalWidthImg;
  var imgHeight = divHeight;

  return {"positionLeft": positionLeft, "positionTop": positionTop, "imgWidth": imgWidth, "imgHeight": imgHeight};
};


///// set position and info image IN VOTE AND ZONDER//////////////////

$scope.setPositionImageVoteAndZonder = function(imgWidth, imgHeight){
  var imgInfo = new Array();

  var viewportWidth = window.screen.width * 0.40;
  var viewportHeight = window.screen.width * 0.30;

  if(imgWidth <= imgHeight){
    imgInfo = $scope.resizeImageWidthGeneral(imgWidth, imgHeight, viewportWidth, viewportHeight);
  }
  else{
    imgInfo = $scope.resizeImageHeightGeneral(imgWidth, imgHeight, viewportWidth, viewportHeight);
  }

  return imgInfo;
};

$scope.resizeImageWidthGeneral = function(imgWidth, imgHeight, divWidth, divHeight){
  var widthIncreaseFactor = divWidth / imgWidth;

  var finalHeightImg = widthIncreaseFactor * imgHeight;
  var posTopLeftY = (divHeight - finalHeightImg) / 2;

  var positionLeft = 0;
  var positionTop = posTopLeftY;
  var imgWidthFinal = divWidth;
  var imgHeightFinal = finalHeightImg;

  if(imgHeightFinal < divHeight){
    var imgInfoResizeHeight = new Array();
    imgInfoResizeHeight = $scope.resizeImageHeightGeneral(imgWidthFinal, imgHeightFinal, divWidth, divHeight);
    return {"positionLeft": imgInfoResizeHeight.positionLeft, "positionTop": imgInfoResizeHeight.positionTop, "imgWidth": imgInfoResizeHeight.imgWidth, "imgHeight": imgInfoResizeHeight.imgHeight};
  }

  return {"positionLeft": positionLeft, "positionTop": positionTop, "imgWidth": imgWidthFinal, "imgHeight": imgHeightFinal};
};

$scope.resizeImageHeightGeneral = function(imgWidth, imgHeight, divWidth, divHeight){
  var heightIncreaseFactor = divHeight / imgHeight;

  var finalWidthImg = heightIncreaseFactor * imgWidth;
  var posTopLeftX = (divWidth - finalWidthImg) / 2;

  var positionLeft = posTopLeftX;
  var positionTop = 0;
  var imgWidthFinal = finalWidthImg;
  var imgHeightFinal = divHeight;

  if(imgWidthFinal < divWidth){
    var imgInfoResizeWidth = new Array()
    imgInfoResizeWidth = $scope.resizeImageWidthGeneral(imgWidthFinal, imgHeightFinal, divWidth, divHeight);
    return {"positionLeft": imgInfoResizeWidth.positionLeft, "positionTop": imgInfoResizeWidth.positionTop, "imgWidth": imgInfoResizeWidth.imgWidth, "imgHeight": imgInfoResizeWidth.imgHeight};
  }
  return {"positionLeft": positionLeft, "positionTop": positionTop, "imgWidth": imgWidthFinal, "imgHeight": imgHeightFinal};
};


$scope.setPositionImageInCommentsAndPollModal = function(imgWidth, imgHeight){
  var imgInfo = new Array();

  var viewportWidth = window.screen.width;
  var viewportHeight = window.screen.height / 2;

  if(imgWidth <= imgHeight){
    imgInfo = $scope.resizeImageWidthGeneral(imgWidth, imgHeight, viewportWidth, viewportHeight);
  }
  else{
    imgInfo = $scope.resizeImageHeightGeneral(imgWidth, imgHeight, viewportWidth, viewportHeight);
  }

  return imgInfo;
};

$scope.setPositionImageInSearchGoogle = function(imgWidth, imgHeight){
  var imgInfo = new Array();
  console.log("4");

  var viewportWidth = window.screen.width;
  var viewportHeight = window.screen.height * 0.55;

  console.log("5");
  if(imgWidth <= imgHeight){
    console.log("portrait");
    imgInfo = $scope.resizeImageWidthGeneral(imgWidth, imgHeight, viewportWidth, viewportHeight);
  }
  else{
    console.log("paysage");
    imgInfo = $scope.resizeImageHeightGeneral(imgWidth, imgHeight, viewportWidth, viewportHeight);
  }

  return imgInfo;
};
/////////////// create poll ///////////////////////
$scope.createPollFunction = function() {
  if($scope.createPoll.range == "Amis"){
    for(friend in $scope.friends){
      if($scope.friends[friend].selected){
        $scope.friendsConcerned.push({"id":$scope.friends[friend].id});
      }
    }
  }
  else if($scope.createPoll.range == "Monde"){
    $scope.createPoll.usersConcerned = ($scope.hundredPeopleRange*100) + ($scope.decadePeopleRange*10);
  }
  $scope.createPoll.question = $scope.createPoll.question.replace(/(\r\n|\n|\r)/gm," ");
  $scope.createPoll.question = $scope.createPoll.question.toLowerCase();

  $scope.createPoll.timePoll = ($scope.hours*3600) + ($scope.decadeMinutes*600);

  $scope.createPoll.friendsConcerned = $scope.friendsConcerned;
  $scope.createPoll.namePhotoLeft = $scope.createPoll.namePhotoLeft.toUpperCase();
  $scope.createPoll.namePhotoRight = $scope.createPoll.namePhotoRight.toUpperCase();
  $scope.createPoll.question = $scope.createPoll.question.charAt(0).toUpperCase() + $scope.createPoll.question.slice(1);
  $scope.loadingCreateZonder = true;
  $scope.$apply();
  $scope.closeCreateZonderModal();
  PollService.createPoll($scope.createPoll).then(function(data) {
    $ionicSlideBoxDelegate.$getByHandle('createZonderSlider').slide(0);
    $scope.clearModal();
    window.setTimeout(function() {
      $scope.showInfoCreateZonder = true;
      $scope.loadingCreateZonder = false;
      window.setTimeout(function() {
        $scope.showInfoCreateZonder = false;
        $scope.$apply();
      }, 3000);
      $scope.$apply();
    }, 3000);
  },function(status) {
    window.setTimeout(function() {
      $scope.showInfoErrorCreateZonder = true;
      $scope.loadingCreateZonder = false;
      window.setTimeout(function() {
        $scope.showInfoErrorCreateZonder = false;
        $scope.$apply();
      }, 3000);
      $scope.$apply();
    }, 3000);
    console.log("Impossible de creer le sondage");
  });
};

/////////////// search image google ///////////////

$scope.slideHasChangedInGoogleSearch = function(index) {
  $scope.currentSlider = index;
  if(index == 2){
    $scope.showExplenationSwipe = false;
  }
};

$scope.selectImage = function(){
  if($scope.sideImage == "left"){
    console.log("left");
    $scope.createPoll.photoLeft = $scope.tabImageToInternet[$scope.currentSlider].image;
    async.series([function(callback){
      var image = new Image();
      image.src = $scope.createPoll.photoLeft;
      image.onload = function(){
        $scope.imgLeftInfo.imgWidth = image.width;
        $scope.imgLeftInfo.imgHeight = image.height;
        console.log("imgWidth" + $scope.imgLeftInfo.imgWidth);
        console.log("imgHeight" + $scope.imgLeftInfo.imgHeight);
        callback();
      };
    },function(callback){
      $scope.imgLeftInfo = $scope.setPositionImage(true, $scope.imgLeftInfo.imgWidth, $scope.imgLeftInfo.imgHeight);
      callback();
    }], function(err, res){
      $scope.displayButtonLeft = false;
      $scope.closeChooseGooglePhotoModal();
      $scope.$apply();
    });
  }
  else if($scope.sideImage == "right"){
    console.log("right");
    $scope.createPoll.photoRight = $scope.tabImageToInternet[$scope.currentSlider].image;
    async.series([function(callback){
      var image = new Image();
      image.src = $scope.createPoll.photoRight;
      image.onload = function(){
        $scope.imgRightInfo.imgWidth = image.width;
        $scope.imgRightInfo.imgHeight = image.height;
        callback();
      };
    },function(callback){
      $scope.imgRightInfo = $scope.setPositionImage(false, $scope.imgRightInfo.imgWidth, $scope.imgRightInfo.imgHeight);
      callback();
    }], function(err, res){
      $scope.displayButtonRight = false;
      $scope.closeChooseGooglePhotoModal();
      $scope.$apply();
    });
  }
}

$scope.initTabImageToInternet = function(){
  $scope.loadingImage = false;
  $scope.showSliderGoogleSearch = false;
  $scope.showExplenationSwipe = true;
  $scope.showNoFoundPicture = false;
  $scope.tabImageToInternet = new Array();
  console.log("lol" + $scope.search.googleSearch);
  $scope.search.googleSearch = "";
  console.log("lol" + $scope.search.googleSearch);
  for(i = 0; i<10; i++){
    var image = {};
    $scope.currentSlider = 0;
    image.image  = "img/transparencyBackground.png";
    image.height = "";
    image.width = "";
    image.url = "";
    image.positionLeft = "";
    image.positionTop = "";
    image.imgWidth = "";
    image.imgHeight = "";
    image.load = true;
    $scope.tabImageToInternet.push(image);
  }
};

$scope.initGoogleModal = function(){
  $ionicModal.fromTemplateUrl('modals/chooseGooglePhoto.html', {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: false
  }).then(function(modal) {
    $scope.chooseGooglePhotoModal = modal;
  });
};

$scope.openChooseGooglePhotoModal = function() {
  $scope.chooseGooglePhotoModal.show();
};

$scope.closeChooseGooglePhotoModal = function() {
  $scope.chooseGooglePhotoModal.hide();
};

$scope.removeGoogleModal = function() {
  $scope.chooseGooglePhotoModal.remove();
};

$scope.$on('$destroy', function() {
  $scope.chooseGooglePhotoModal.remove();
});

$scope.queriesForInfosAndResizeImage = new Array();

$scope.getImageFromGoogle = function(query, callback){
  UserService.getImageFromGoogle(query).then(function(data) {
    $scope.showNoFoundPicture = false;
    var cpt = 0;

    if(!data.items){
      $scope.showNoFoundPicture = true;
    }

    angular.forEach(data.items, function(item, key){
      $scope.tabImageToInternet[cpt].url = item.link;
      cpt++;
    });

    if(cpt != 10){
      for(i = cpt; i<10; i ++){
        $scope.tabImageToInternet[i].url = "";
      }
    }
    async.parallel([function(callback){$scope.getInfosAndResizeImage($scope.tabImageToInternet, callback)}],
      function(err, res){
        callback();
      });
  }, function(status){
    console.log("Impossible de récuperer les images");
    callback();
  });
};


$scope.getInfosAndResizeImage = function(tabImageToInternet, callback){
 angular.forEach(tabImageToInternet, function(image, key){
  var q = function(callback){
    if(image.url){
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = image.url;
      
      async.series([function(callback){
        img.onload = function(){
          canvas.height = img.height;
          canvas.width = img.width;
          image.height = canvas.height;
          image.width = canvas.width;
          ctx.drawImage(img,0,0);
          image.image = canvas.toDataURL('image/jpeg');
          var imageInternetInfoTmp = $scope.setPositionImageInSearchGoogle(image.width, image.height);
          image.positionLeft = imageInternetInfoTmp.positionLeft;
          image.positionTop = imageInternetInfoTmp.positionTop;
          image.imgWidth = imageInternetInfoTmp.imgWidth;
          image.imgHeight = imageInternetInfoTmp.imgHeight;
          image.load = true;
          canvas = null; 
          callback();
        };
      }], function(err, res){
        callback();
      });
    }
    else{
      image.image  = "img/transparencyBackground.png";
      image.height = "";
      image.width = "";
      image.positionLeft = "";
      image.positionTop = "";
      image.imgWidth = "";
      image.imgHeight = "";
      image.load = false;
      callback();
    }
  };
  $scope.queriesForInfosAndResizeImage.push(q);
});
callback();
};


$scope.queriesExecInfosAndResizeImage= function(callback){
  async.series($scope.queriesForInfosAndResizeImage,function(err, res){
    callback();
  });
};


$scope.fillImageFromGoogle = function(query){
  if(query){
    console.log("query" + query);
    $scope.loadingImage = true;
    async.series([function(callback){$scope.getImageFromGoogle(query, callback)}, $scope.queriesExecInfosAndResizeImage], 
      function(err, result){
       $scope.loadingImage = false;
       console.log("fin fin fin fin");
       $scope.queriesForInfosAndResizeImage.splice(0, $scope.queriesForInfosAndResizeImage.length);
       if(!$scope.showNoFoundPicture){
        $scope.showSliderGoogleSearch = true;
      }
      else{
       $scope.showSliderGoogleSearch = false;
     } 
     $scope.$apply();
   });
  }
  else{
    console.log("ZZZZZZZ");
  }
};

// $scope.nextImage = function(){
//   if(!$scope.loadingImage){
//     $scope.loadingImage = true;
//     $scope.indiceImage++;
//     $scope.showBackButton = true;
//     if($scope.indiceImage == 9){
//       $scope.showNextButton = false;
//     }
//     $scope.urlToResizedBase64Image($scope.tabImageToInternet[$scope.indiceImage]);
//   }
// };

// $scope.backImage = function(){
//   if(!$scope.loadingImage){
//     $scope.loadingImage = true;
//     $scope.indiceImage--;
//     $scope.showNextButton = true;
//     if($scope.indiceImage == 0){
//       $scope.showBackButton = false;
//     }
//     $scope.urlToResizedBase64Image($scope.tabImageToInternet[$scope.indiceImage]);
//   }
// };

// $scope.urlToResizedBase64Image = function(url){
//   var canvas = document.createElement('CANVAS');
//   var ctx = canvas.getContext('2d');
//   var img = new Image();
//   img.crossOrigin = 'Anonymous';
//   img.src = url;
//   img.onload = function(){
//     canvas.height = img.height;
//     canvas.width = img.width;

//     $scope.imageToInternet.height = canvas.height;
//     $scope.imageToInternet.width = canvas.width;

//       ctx.drawImage(img,0,0);
//       $scope.imageToInternet.image = canvas.toDataURL('image/jpeg');
//        //resize de tpmImg
//          $scope.$apply();
//        var imageInternetInfoTmp = $scope.setPositionImageInSearchGoogle($scope.imageToInternet.width, $scope.imageToInternet.height);
//        $scope.imageInternetInfo.positionLeft = imageInternetInfoTmp.positionLeft;
//        $scope.imageInternetInfo.positionTop = imageInternetInfoTmp.positionTop;
//        $scope.imageInternetInfo.imgWidth = imageInternetInfoTmp.imgWidth;
//        $scope.imageInternetInfo.imgHeight = imageInternetInfoTmp.imgHeight;
//        // $scope.imgSrc = tmpImg
//        $scope.loadingImage = false;
//        canvas = null; 
//         $scope.$apply();
//   };

// };

/////////////////////// fin create poll ///////////////////////

//////////////////////// Retrieve Polls ////////////////////////////////

$scope.queriesForPollsInfos = new Array();
$scope.queriesForInfoPhoto = new Array();
$scope.queriesForUserInfo = new Array();
$scope.queriesForUserPhoto = new Array();

$scope.getPollsVoted = function(callback){
  PollService.getPollsVoted(0).then(function(data){
    $rootScope.lengthTab = data.lengthGlobal;
    if(data.poll != "allPollsLoaded"){
      $rootScope.pollsVoted = data.poll;
      async.parallel([function(callback){$scope.getPollsInfos($rootScope.pollsVoted, callback)}, 
        function(callback){$scope.getInfoPhoto($rootScope.pollsVoted, callback)},
        function(callback){$scope.getUsersInfos($rootScope.pollsVoted, callback)},
        function(callback){$scope.getUsersPhoto($rootScope.pollsVoted, callback)}], 
        function(err, res){
          callback();
        });
    }
    else{
      callback();
    }
  }, function(status){
    console.log("Impossible de récuperer les polls");
    callback();
  });
};

$scope.getPollsInfos = function(pollArray, callback){
  if(pollArray.length){
    angular.forEach(pollArray, function(poll, key){ 
      var q = function(callback){
        PollService.getPollFromId(poll.id).then(function(d){
          angular.forEach(pollArray, function(p, k){
            if(p.id == poll.id){
              p.authorId = d.author;

              p.question = d.question;
              p.photoLeft = d.photoLeft;
              p.photoRight = d.photoRight;
              p.gender = d.gender;
              p.range = d.range;
              p.votes = d.votes;
              // p.whoVotedWhat = d.whoVotedWhat;
              p.progression = d.progression;
              p.timePoll = d.timePoll;
              p.startDate = d.startDate;
              p.photoLeftVote = d.photoLeftVote;
              p.photoRightVote = d.photoRightVote;
              p.pourcentagePhotoLeft = d.pourcentagePhotoLeft;
              p.pourcentagePhotoRight = d.pourcentagePhotoRight;
              p.comments = d.comments;
              p.firstName = d.firstName;
              p.secondName = d.secondName;
              p.friendsConcerned = d.friendsConcerned;
              p.usersConcerned = d.usersConcerned;
              p.isOver = d.isOver;

              var time = $scope.getTimeHoursMinutesFromPoll(p);
              p.timeElapsedHours = time.hours;
              p.timeElapsedMinutes = time.minutes;
              p.timeElapsedDays = time.day;
            }
          });
callback();
}, function(status){
  console.log("Impossible de récuperer les infos basic du sondage");
  callback();
});
};
$scope.queriesForPollsInfos.push(q);
});
callback();
}
else {
  callback();
}
};


$scope.getInfoPhoto = function(pollArray, callback){
  console.log("4");
  if(pollArray.length){
    angular.forEach(pollArray, function(poll, key){
      var q = function(callback){
        angular.forEach(pollArray, function(p, k){
          if(p.id == poll.id){
            var imageLeft = new Image();
            imageLeft.src = p.photoLeft;

            var imageRight = new Image();
            imageRight.src = p.photoRight;
            async.parallel([function(callback){
              imageLeft.onload = function(){
                p.imageWidthLeft = imageLeft.width;
                p.imageHeightLeft = imageLeft.height;
                var specImgLeft = $scope.setPositionImageVoteAndZonder(p.imageWidthLeft, p.imageHeightLeft);
                p.specImgLeftPositionLeft = specImgLeft.positionLeft;
                p.specImgLeftPositionTop = specImgLeft.positionTop;
                p.specImgLeftWidth = specImgLeft.imgWidth;
                p.specImgLeftHeight = specImgLeft.imgHeight;
                callback();
              };
            },function(callback){
              imageRight.onload = function(){
                p.imageWidthRight = imageRight.width;
                p.imageHeightRight = imageRight.height;
                var specImgRight = $scope.setPositionImageVoteAndZonder(p.imageWidthRight, p.imageHeightRight);
                p.specImgRightPositionLeft = specImgRight.positionLeft;
                p.specImgRightPositionTop = specImgRight.positionTop;
                p.specImgRightWidth = specImgRight.imgWidth;
                p.specImgRightHeight = specImgRight.imgHeight;
                callback();
              };
            }], function(err, res){
              callback();
            });
}
}); 
}
$scope.queriesForInfoPhoto.push(q);
});
callback();
}
else {
  callback();
}
};

$scope.getUsersInfos = function(pollArray, callback){
  angular.forEach(pollArray, function(poll, key){
    var q = function(callback){
      UserService.getFriendInfoFromId(poll.authorId).then(function(d){
        angular.forEach(pollArray, function(p, k){
          if(p.id == poll.id){
            p.authorPseudo = d.pseudo;
          }
        });
        callback();
      }, function(status){
        console.log("Impossible de récuperer les infos pour l'utilisateurs");
      });
    };
    $scope.queriesForUserInfo.push(q);
  });
  callback();
};

$scope.getUsersPhoto = function(pollArray, callback){
  angular.forEach(pollArray, function(poll, key){
    var q = function(callback){
      UserService.getFriendPhotoFromId(poll.authorId).then(function(d){
        angular.forEach(pollArray, function(p, k){
          if(p.id == poll.id){
            p.authorPhoto = d.photo;
          }
        });
        callback();
      }, function(status){
        console.log("Impossible de récuperer les infos pour l'utilisateurs");
      });
    };
    $scope.queriesForUserPhoto.push(q);
  });
  callback();
};

$scope.queriesExecUsersPhoto = function(callback){
  async.parallel($scope.queriesForUserPhoto,function(err, res){
    callback();
  });
};

$scope.queriesExecUsersInfos = function(callback){
  async.parallel($scope.queriesForUserInfo,function(err, res){
    callback();
  });
};

$scope.queriesExecInfoPhoto = function(callback){
  async.parallel($scope.queriesForInfoPhoto,function(err, res){
    callback();
  });
};

$scope.queriesExecPollsInfos = function(callback){
  async.parallel($scope.queriesForPollsInfos,function(err, res){
    callback();
  });
};

$scope.parallelQueriesExecAllInfos = function(callback){
  async.parallel([$scope.queriesExecUsersInfos, $scope.queriesExecUsersPhoto, $scope.queriesExecInfoPhoto],function(err, res){
    callback();
  });
};

$scope.retrievePollsForRootScope = function(){
  async.series([$scope.getPollsVoted, $scope.queriesExecPollsInfos, $scope.parallelQueriesExecAllInfos], 
    function(err, result){
      console.log("fin retrive poll");
      $scope.queriesForPollsInfos.splice(0, $scope.queriesForPollsInfos.length);
      $scope.queriesForInfoPhoto.splice(0, $scope.queriesForInfoPhoto.length);
      $scope.queriesForUserPhoto.splice(0, $scope.queriesForUserPhoto.length);
      $scope.queriesForUserInfo.splice(0, $scope.queriesForUserInfo.length);
      window.setTimeout(function(){
        $ionicPlatform.ready(function() {
          $rootScope.loadingIndicator.hide();
          $scope.$apply();
        });
      }, 4000);
      console.log("finloadingOK");
      $rootScope.showHome = true;
      $scope.$apply();
    });
};

// marche car on force l'attente à 2 sec mais normalement c'est sur le device ready
window.setTimeout(function(){
  console.log("je lance retrieve poll");
  $scope.retrievePollsForRootScope();
  $scope.preloadModal();
}, 2000);

//////////////////////// Retrieve Friends ////////////////////////////////

$scope.queriesForRequestFriendInfo = new Array();
$scope.queriesForRequestFriendPhoto = new Array();
$scope.queriesForDeleteFriends = new Array();

$scope.getAddFriends = function(callback){
  UserService.getAddFriends().then(function(data){
    $rootScope.addFriends = data.addFriends;
    callback();
  }, function(status){
    console.log("Impossible de recuperer addFriends");
    callback();
  });
};

$scope.getRequestFriends = function(callback){
  UserService.getRequestFriends().then(function(data){
    $rootScope.requestFriends = data.requestFriends;
    callback();
  }, function(status){
    console.log("Impossible de recuperer requestFriends");
    callback();
  });
};

$scope.getFriends = function(callback){
  UserService.getFriends(0).then(function(data){
    console.log("getFriends" + JSON.stringify(data.friend));
    if(data.friend != "allFriendsLoaded"){
      $rootScope.friends = data.friend;
      callback();
    }
    else{
      callback();
    }
  }, function(status){
    console.log("Impossible de recuperer friends");
    callback();
  });
};

$scope.retrieveAllFriendsId = function(callback){
  async.parallel([$scope.getFriends, $scope.getRequestFriends, $scope.getAddFriends],
   function(err, result){
    callback();
  });
};

$scope.getFriendsInfo = function(friendArray, callback){
  angular.forEach(friendArray, function(friend, key){
    var q = function(callback){
      UserService.getFriendInfoFromId(friend.id).then(function(d){
        angular.forEach(friendArray, function(f, k){
          if(f.id == friend.id){
            f.pseudo = d.pseudo;
            f.gender = d.gender;
            f.nbPolls = d.nbPolls;
            f.nbFriends = d.nbFriends;
            if(f.gender){
              f.photo = "img/louis.png";
            }
            else{
              f.photo = "img/profilTest.png";
            }
          }
        });
        callback();
      }, function(status){
        console.log("Impossible de récuperer les infos pour l'utilisateurs");
      });
    };
    $scope.queriesForRequestFriendInfo.push(q);
  });
  callback();
};

$scope.getFriendsPhoto = function(friendArray, callback){
  angular.forEach(friendArray, function(friend, key){
    var q = function(callback){
      UserService.getFriendPhotoFromId(friend.id).then(function(d){
        angular.forEach(friendArray, function(f, k){
          if(f.id == friend.id){
            f.photo = d.photo;
            callback();
          }
        });
      }, function(status){
        console.log("Impossible de recupere la photo de l'utilisateur");
      });
    };
    $scope.queriesForRequestFriendPhoto.push(q);
  });
  callback();
};

$scope.getPseudoPhotoFriends = function(friendArray, callback){
  async.parallel([function(callback){$scope.getFriendsInfo(friendArray,callback);},
    function(callback){$scope.getFriendsPhoto(friendArray,callback);}],
    function(err, result){
      callback();
    });
};


$scope.queriesExecInfoRequest = function(callback){
  async.parallel($scope.queriesForRequestFriendInfo,
    function(err, res){
      callback();
    });
};

$scope.queriesExecPhotoRequest = function(callback){
  async.parallel($scope.queriesForRequestFriendPhoto,
    function(err, res){
      callback();
    });
};

$scope.queriesParallelRequest = function(callback) {
  async.parallel([$scope.queriesExecInfoRequest, $scope.queriesExecPhotoRequest],
   function(err, res){
    callback();
  });
};

$scope.fillQueriesAddFriends = function(callback){
  async.series([function(callback){$scope.getPseudoPhotoFriends($rootScope.addFriends,callback);},
    $scope.queriesParallelRequest],
    function(err, result){
      $scope.queriesForRequestFriendInfo.splice(0, $scope.queriesForRequestFriendInfo.length);
      $scope.queriesForRequestFriendPhoto.splice(0, $scope.queriesForRequestFriendPhoto.length);
      callback();
    });
};

$scope.fillQueriesRequestFriends = function(callback){
  async.series([function(callback){$scope.getPseudoPhotoFriends($rootScope.requestFriends,callback);},
    $scope.queriesParallelRequest],
    function(err, result){
      $scope.queriesForRequestFriendInfo.splice(0, $scope.queriesForRequestFriendInfo.length);
      $scope.queriesForRequestFriendPhoto.splice(0, $scope.queriesForRequestFriendPhoto.length);
      callback();
    });
};

$scope.fillQueriesFriends = function(callback){
  async.series([function(callback){$scope.getPseudoPhotoFriends($rootScope.friends,callback);},
    $scope.queriesParallelRequest],
    function(err, result){
      $scope.queriesForRequestFriendInfo.splice(0, $scope.queriesForRequestFriendInfo.length);
      $scope.queriesForRequestFriendPhoto.splice(0, $scope.queriesForRequestFriendPhoto.length);
      callback();
    });
};

$scope.fillAllQueries = function(callback){
  async.series([$scope.fillQueriesAddFriends, $scope.fillQueriesRequestFriends, $scope.fillQueriesFriends],
   function(err, result){
    callback();
  });
};


$scope.fillQueriesforDeleteFriends = function(callback){
  UserService.getFriendsToDelete().then(function(data){
    console.log("data toto" + JSON.stringify(data.friendsToDelete));
    if(data.friendsToDelete.length){
      console.log("1 bis");
      $rootScope.friendsHaveChanged = true;
      console.log("2 bis");
      angular.forEach(data.friendsToDelete, function(f, k){
        var q = function(callback){
          console.log("id" + f.id);
          UserService.deleteFriendToDelete(f.id).then(function(d){
            callback();
          },function(s){
            console.log("Error in deleteFriendsToDelete");
          });
        };
        $scope.queriesForDeleteFriends.push(q);
      });
      callback(); 
    }
    else{
      callback(); 
    }
  }, function(status){
    console.log("Error in getFriendsToDelete")
    callback();
  });
};

$scope.queriesExecDeleteFriends = function(callback){
  async.parallel($scope.queriesForDeleteFriends, function(err, result){    
    callback();
  });
};

$scope.loadAllFriends = function(){
  async.series([$scope.fillQueriesforDeleteFriends, $scope.queriesExecDeleteFriends, $scope.retrieveAllFriendsId, $scope.fillAllQueries],
    function(err, result){
      $rootScope.friendsHaveChanged = false;
      // console.log("$rootScope.friends1" + JSON.stringify($rootScope.friends));
      // console.log("$rootScope.addFriends1" + JSON.stringify($rootScope.addFriends));
      // console.log("$rootScope.requestFriends1" + JSON.stringify($rootScope.requestFriends));
      $scope.queriesForRequestFriendInfo.splice(0, $scope.queriesForRequestFriendInfo.length);
      $scope.queriesForRequestFriendPhoto.splice(0, $scope.queriesForRequestFriendPhoto.length);
      $scope.queriesForDeleteFriends.splice(0, $scope.queriesForDeleteFriends.length);

    });
};

window.setTimeout(function(){
  $scope.loadAllFriends();
}, 2000);

/////////////////////////  Report This Poll ////////////////////////////////

$scope.reportThisPoll = function(pollId){
  PollService.reportThisPoll(pollId).then(function(data){
  }, function(status){
    console.log("Impossible de report le sondage");
  });
};

////////////////// Compute Time elapsed since creation ////////////////////
$scope.getTimeHoursMinutesFromPoll = function(poll){
  //Get the dates in ms
  var startDateMs = new Date(poll.startDate);
  startDateMs = startDateMs.getTime();
  var nowMs = Date.now();

  //Compute the difference
  var durationInMs = nowMs - startDateMs;
  var durationInHours = durationInMs / (3600 * 1000);

  //get the Minutes and hours 
  var minPoll = (durationInHours % 1).toFixed(2) * 60;
  minPoll = minPoll.toString();
  minPoll = minPoll.split('.');
  if(minPoll[0].length == 1){
    minPoll[0] = "0" + minPoll[0];
  }

  var hoursPoll = Math.floor(durationInHours);

  //Object that contains minutes and hours
  var pollTime = new Array();
  pollTime.minutes = minPoll[0];
  pollTime.hours = hoursPoll;
  if(hoursPoll > 23){
    pollTime.day = Math.floor((hoursPoll/24));
  }
  return pollTime;
};


});