zonder.controller('mainCtrl', function($scope, $state, $rootScope, $ionicModal, $ionicSlideBoxDelegate, $ionicActionSheet, $cordovaCamera, UserService, PollService) {
  $scope.timePickerIsOpen = false;

  $scope.openTimePicker = function(){
    $scope.timePickerIsOpen = true;
  };

  $scope.closeTimePicker = function(){
    $scope.timePickerIsOpen = false;
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

$scope.openTargetPicker = function(){
  $scope.targetPickerIsOpen = true;
};

$scope.closeTargetPicker = function(){
  $scope.targetPickerIsOpen = false;
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
  $scope.clearModal();
};

$scope.$on('$destroy', function() {
  $scope.createZonderModal.remove();
});


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
  $scope.charLeft = (90 - $scope.createPoll.question.length);
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
    quality: 40,
    destinationType: $rootScope.destinationType,
    sourceType: $rootScope.pictureSource,
    allowEdit: true,
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
    quality: 40,
    destinationType: $rootScope.destinationType,
    sourceType: $rootScope.pictureSource,
    allowEdit: true,
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
    if($scope.createPoll.timePoll != ""){
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
            if($scope.createPoll.usersConcerned != ""){
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


///// set position and info image //////////////////

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

  var imgWidth = imgHeight;
  var widthIncreaseFactor = divWidth / imgWidth;

  var finalHeightImg = widthIncreaseFactor * imgHeight;
  var posTopLeftY = (divHeight - finalHeightImg) / 2;

  var ratio = divWidth / divHeight;

  console.log("widthIncreaseFactor" + widthIncreaseFactor);
  console.log("posTopLeftY" + posTopLeftY);

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
  console.log("toto");

  return {"positionLeft": positionLeft, "positionTop": positionTop, "imgWidth": imgWidth, "imgHeight": imgHeight};
};

$scope.resizeImageWidthInHeight = function(imgWidth, imgHeight, divWidth, divHeight){

  var widthIncreaseFactor = divWidth / imgWidth;

  var finalHeightImg = widthIncreaseFactor * imgHeight;
  var posTopLeftY = (divHeight - finalHeightImg) / 2;

  var positionLeft = 0;
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

  if(imgWidth < divWidth){
    console.log("resize");
    var imgLeftInfoTest = $scope.resizeImageWidthInHeight(imgWidth,imgHeight,divWidth,divHeight);

    var ratio = divWidth / divHeight;

    var positionLeft = imgLeftInfoTest.positionTop * ratio;
    var positionTop = imgLeftInfoTest.positionTop;
    var imgWidth = imgLeftInfoTest.imgWidth - positionLeft + 40;
    var imgHeight = imgLeftInfoTest.imgHeight;
  }

  return {"positionLeft": positionLeft, "positionTop": positionTop, "imgWidth": imgWidth, "imgHeight": imgHeight};
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

  $scope.closeAllModalCreatePoll();

  PollService.createPoll($scope.createPoll).then(function(data) {
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


});