zonder.controller('mainCtrl', function($window, $scope, $state, $rootScope, $ionicModal, $ionicSlideBoxDelegate, $ionicActionSheet, $cordovaCamera, UserService, PollService) {

  $scope.myPhoto = $window.localStorage['photo'];
  $scope.myPseudo = $window.localStorage['pseudo'];

  //////////////////////// Change Profile Photo////////////////////////////////

  $scope.changeProfilePicture = function(){
    console.log("changeProfilePicture");
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
      { text: 'Internet <i class="icon ion-earth"></i>' },
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
        if(index == 2){
          $window.open("https://www.google.com", "_system");
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
  animation: 'slide-in-right'
}).then(function(modal) {
  $scope.createZonderModal = modal;
});

$scope.openCreateZonderModal = function() {
  $scope.createZonderModal.show();
};

$scope.closeCreateZonderModal = function() {
  $scope.createZonderModal.hide();
  
};

$scope.$on('$destroy', function() {
  $scope.createZonderModal.remove();
});

$scope.closeAndClearCreateZonderModal = function(){
  $scope.closeCreateZonderModal();
  $scope.clearModal();
};

$scope.slideHasChangedInCreateZonder = function(index){
  if(index == 0){
  	console.log("question");
    $scope.displayNextButtonQuestion = true;
    $scope.displayNextButtonChoosePhoto = false;
    $scope.showCloseButton = true;
  }
  if(index == 1){
  	console.log("photo");
  	$scope.displayNextButtonQuestion = false;
  	$scope.displayNextButtonChoosePhoto = true;
  	$scope.displayCreateButton = false;
  	$scope.showCloseButton = false;
  }
  if(index == 2){
  	console.log("option");
  	$scope.displayNextButtonChoosePhoto = false;
  	$scope.displayCreateButton = true;
  }
};

$scope.disableSwipeCreateZonder = function() {
  $ionicSlideBoxDelegate.$getByHandle('createZonderSlider').enableSlide(false);
};

$scope.nextStepPhoto = function(){
  $ionicSlideBoxDelegate.$getByHandle('createZonderSlider').next();
  $scope.displayNextButtonQuestion = false;
};

$scope.nextStepOption = function(){
  $ionicSlideBoxDelegate.$getByHandle('createZonderSlider').next();
  $scope.displayNextButtonChoosePhoto = false;
};

$scope.createPoll = function(){
 console.log("create poll");
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
};

$scope.showCloseButton = true;
$scope.displayNextButtonQuestion = true;

$scope.displayButtonLeft = true;
$scope.displayButtonRight = true;

$scope.friendsConcerned = new Array();
$scope.friends = new Array();
$scope.friendsAreLoaded = false;

$scope.search = "";

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

/////////////////  slider question /////////////////////////
$scope.charLeft = 90;

$scope.charactersLeft = function(){
  console.log("charactersLeft" + $scope.charLeft);
  console.log("length" + $scope.createPoll.question.length);
  console.log("question" + $scope.createPoll.question);
  $scope.charLeft = (90 - $scope.createPoll.question.length);
  $scope.createPoll.question = $scope.createPoll.question.toLowerCase();
  console.log( "$scope.createPoll.question" + $scope.createPoll.question);
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

    console.log("hiha 444444");
    async.series([function(callback){
      var image = new Image();
      image.src = $scope.createPoll.photoLeft;
      console.log("hiha 7");
      image.onload = function(){
        console.log("width" + image.width);
        console.log("height" + image.height);
        $scope.imgLeftInfo.imgWidth = image.width;
        $scope.imgLeftInfo.imgHeight = image.height;
        callback();
      };
    },function(callback){
      $scope.imgLeftInfo = $scope.setPositionImage(true, $scope.imgLeftInfo.imgWidth, $scope.imgLeftInfo.imgHeight);
      callback();
    }], function(err, res){
      console.log("imgLeftInfo3" + JSON.stringify($scope.imgLeftInfo));
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
    console.log("hiha 444444");
    async.series([function(callback){
      var image = new Image();
      image.src = $scope.createPoll.photoRight;
      console.log("hiha 7");
      image.onload = function(){
        console.log("width" + image.width);
        console.log("height" + image.height);
        $scope.imgRightInfo.imgWidth = image.width;
        $scope.imgRightInfo.imgHeight = image.height;
        callback();
      };
    },function(callback){
      $scope.imgRightInfo = $scope.setPositionImage(false, $scope.imgRightInfo.imgWidth, $scope.imgRightInfo.imgHeight);
      callback();
    }], function(err, res){
      console.log("imgRightInfo3" + JSON.stringify($scope.imgRightInfo));
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
  $scope.updateFriendsCreatePoll();
  $scope.checkOptionInCreatePoll();
};

$scope.getFriendsCreatePoll = function(callback){
  UserService.getFriends().then(function(data){
    $scope.friends = data.friends;
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
  if(!$scope.loadingSondrFriends && !$scope.friendsAreLoaded){
    $scope.loadingSondrFriends = true;
    $scope.queriesForFriendPhotoCreatePoll.splice(0, $scope.queriesForFriendPhotoCreatePoll.length);
    $scope.queriesForFriendInfoCreatePoll.splice(0, $scope.queriesForFriendInfoCreatePoll.length);
    $scope.friends.splice(0, $scope.friends.length);

    async.series([$scope.getFriendsCreatePoll, $scope.queriesParallelCreatePoll], 
      function(err, result){
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
  console.log("viewportHeight" + viewportHeight);
  console.log("viewportWidth" + viewportWidth);
  if(imgWidth <= imgHeight){
    console.log("portrait");
    imgInfo = $scope.resizeImageWidth(imgLeft, imgWidth, imgHeight, viewportWidth, viewportHeight);
  }
  else{
    console.log("lanscape");
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
    console.log("left");
    var positionLeft = posTopLeftY * ratio;
  }
  else{
    console.log("right");
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
  // console.log("viewportHeight" + viewportHeight);
  // console.log("viewportWidth" + viewportWidth);
  // console.log("imgWidth" + imgWidth);
  // console.log("imgHeight" + imgHeight);

  if(imgWidth <= imgHeight){
    // console.log("portrait");
    imgInfo = $scope.resizeImageWidthVoteAndZonder(imgWidth, imgHeight, viewportWidth, viewportHeight);
  }
  else{
    // console.log("lanscape");
    imgInfo = $scope.resizeImageHeightVoteAndZonder(imgWidth, imgHeight, viewportWidth, viewportHeight);
  }

  return imgInfo;
};

$scope.resizeImageWidthVoteAndZonder = function(imgWidth, imgHeight, divWidth, divHeight){
  var widthIncreaseFactor = divWidth / imgWidth;

  var finalHeightImg = widthIncreaseFactor * imgHeight;
  var posTopLeftY = (divHeight - finalHeightImg) / 2;

  var positionLeft = 0;
  var positionTop = posTopLeftY;
  var imgWidthFinal = divWidth;
  var imgHeightFinal = finalHeightImg;

  if(imgHeightFinal < divHeight){
    var imgInfoResizeHeight = new Array();
    imgInfoResizeHeight = $scope.resizeImageHeightVoteAndZonder(imgWidthFinal, imgHeightFinal, divWidth, divHeight);
    return {"positionLeft": imgInfoResizeHeight.positionLeft, "positionTop": imgInfoResizeHeight.positionTop, "imgWidth": imgInfoResizeHeight.imgWidth, "imgHeight": imgInfoResizeHeight.imgHeight};
  }

  return {"positionLeft": positionLeft, "positionTop": positionTop, "imgWidth": imgWidthFinal, "imgHeight": imgHeightFinal};
};

$scope.resizeImageHeightVoteAndZonder = function(imgWidth, imgHeight, divWidth, divHeight){
  var heightIncreaseFactor = divHeight / imgHeight;

  var finalWidthImg = heightIncreaseFactor * imgWidth;
  var posTopLeftX = (divWidth - finalWidthImg) / 2;

  var positionLeft = posTopLeftX;
  var positionTop = 0;
  var imgWidthFinal = finalWidthImg;
  var imgHeightFinal = divHeight;

  if(imgWidthFinal < divWidth){
    // console.log("jy suissssss");
    var imgInfoResizeWidth = new Array()
    imgInfoResizeWidth = $scope.resizeImageWidthVoteAndZonder(imgWidthFinal, imgHeightFinal, divWidth, divHeight);
    // console.log("imgInfoResizeWidth" + JSON.stringify(imgInfoResizeWidth));
    return {"positionLeft": imgInfoResizeWidth.positionLeft, "positionTop": imgInfoResizeWidth.positionTop, "imgWidth": imgInfoResizeWidth.imgWidth, "imgHeight": imgInfoResizeWidth.imgHeight};
  }

  return {"positionLeft": positionLeft, "positionTop": positionTop, "imgWidth": imgWidthFinal, "imgHeight": imgHeightFinal};
};



/////////////// create poll ///////////////////////

$scope.createPollFunction = function() {
  console.log("create");
  if($scope.createPoll.range == "Amis"){
    for(friend in $scope.friends){
      if($scope.friends[friend].selected){
        $scope.friendsConcerned.push($scope.friends[friend].id);
      }
    }
  }
  else if($scope.createPoll.range == "Monde"){
    $scope.createPoll.usersConcerned = ($scope.hundredPeopleRange*100) + ($scope.decadePeopleRange*10);
  }

  $scope.createPoll.timePoll = ($scope.hours*3600) + ($scope.decadeMinutes*600);

  $scope.createPoll.friendsConcerned = $scope.friendsConcerned;
  $scope.createPoll.question = $scope.createPoll.question.charAt(0).toUpperCase() + $scope.createPoll.question.slice(1);
  $scope.closeCreateZonderModal();
  PollService.createPoll($scope.createPoll).then(function(data) {
    $ionicSlideBoxDelegate.$getByHandle('createZonderSlider').slide(0);
    $scope.clearModal();
    
  },function(status) {
    console.log("Impossible de creer le sondage");
  });
};

/////////////// search image google ///////////////

$ionicModal.fromTemplateUrl('modals/chooseGooglePhoto.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $scope.chooseGooglePhotoModal = modal;
});

$scope.openChooseGooglePhotoModal = function() {
  $scope.chooseGooglePhotoModal.show();
};

$scope.closeChooseGooglePhotoModal = function() {
  $scope.chooseGooglePhotoModal.hide();
};

$scope.$on('$destroy', function() {
  $scope.chooseGooglePhotoModal.remove();
});

/////////////////////// fin create poll ///////////////////////

//////////////////////// Retrieve Polls ////////////////////////////////

$scope.queriesForPollsInfos = new Array();
$scope.queriesForInfoPhoto = new Array();
$scope.queriesForUserInfo = new Array();
$scope.queriesForUserPhoto = new Array();

$scope.getPollsVoted = function(callback){
  PollService.getPollsVoted(0).then(function(data){
    $rootScope.lengthTab = data.lengthGlobal;
    console.log("$rootScope.lengthTab" + $rootScope.lengthTab);
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
      console.log("allPollsLoaded" + data.poll);
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
              p.whoVotedWhat = d.whoVotedWhat;
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
  if(pollArray.length){
    angular.forEach(pollArray, function(poll, key){
      var q = function(callback){
        angular.forEach(pollArray, function(p, k){
          if(p.id == poll.id){
            console.log
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
      $scope.queriesForPollsInfos.splice(0, $scope.queriesForPollsInfos.length);
      $scope.queriesForInfoPhoto.splice(0, $scope.queriesForInfoPhoto.length);
      $scope.queriesForUserPhoto.splice(0, $scope.queriesForUserPhoto.length);
      $scope.queriesForUserInfo.splice(0, $scope.queriesForUserInfo.length);
      console.log("fin recup");
    });
};

window.setTimeout(function(){
  $scope.retrievePollsForRootScope();
}, 2000);

//////////////////////// Retrieve Friends ////////////////////////////////


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
  UserService.getFriends().then(function(data){
    $rootScope.friends = data.friends;
    callback();
  }, function(status){
    console.log("Impossible de recuperer friends");
    callback();
  });
};

$scope.retrieveAllFriends = function(){
  async.parallel([$scope.getFriends, $scope.getRequestFriends, $scope.getAddFriends], function(err, result){
  });
};

$scope.retrieveAllFriends();

/////////////////////////  Report This Poll ////////////////////////////////

$scope.reportThisPoll = function(pollId){
  PollService.reportThisPoll(pollId).then(function(data){
    console.log("Le sondage à été reporté");
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

  return pollTime;
};

});