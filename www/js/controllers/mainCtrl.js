zonder.controller('mainCtrl', function($scope, $state, $rootScope, $ionicModal, $ionicSlideBoxDelegate, $ionicActionSheet, $cordovaCamera) {
	
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
$scope.displayButtonLeft = true;
$scope.displayButtonRight = true;

$scope.friendsConcerned = new Array();
$scope.friends = new Array();
$scope.friendsAreLoaded = false;

$scope.friendPoll = false;
$scope.worldPoll = false;
$scope.femalePoll = false;
$scope.malePoll = false;
$scope.mixtPoll = false;

$scope.search = "";
$scope.showCloseButton = true;
$scope.displayNextButtonQuestion = true;
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

// $scope.checkPhotoInCreatePoll = function(){
//   if(($scope.createPoll.photoLeft != "img/transparencyBackground.png") && ($scope.createPoll.photoRight != "img/transparencyBackground.png")){
//     console.log("aaa");
//     $scope.showNextButtonForChoosePhoto = true;
//   }
//   else {
//     $scope.showNextButtonForChoosePhoto = false;
//   }
// };

$scope.checkChoicePhotoInCreatePoll = function(){
  if(($scope.createPoll.namePhotoLeft.length > 2) && ($scope.createPoll.namePhotoRight.length > 2)){
    $scope.showNextButtonForChoosePhoto = true;
  }
  else {
    $scope.showNextButtonForChoosePhoto = false;
  }
};

$scope.imgLeftInfo = {};
$scope.imgRightInfo = new Array();
// $scope.toto = {};

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
        $scope.imgLeftInfo.imgWidth = image.width;
        $scope.imgLeftInfo.imgHeight = image.height;
        callback();
      };
    },function(callback){
      $scope.imgLeftInfo = $scope.setPositionImage($scope.imgLeftInfo.imgWidth, $scope.imgLeftInfo.imgHeight);
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
    $scope.displayButtonRight = false;
    // $scope.checkPhotoInCreatePoll();
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

  $scope.setFriendPoll  = function() {
    $scope.friendPoll = true;
    $scope.worldPoll = false;
    $scope.createPoll.range = "Amis";
    // $scope.updateFriendsCreatePoll();
    // $scope.checkOptionInCreatePoll();
  };

  $scope.setWorldPoll  = function() {
    $scope.friendPoll = false;
    $scope.worldPoll = true;
    $scope.createPoll.range = "Monde";
    // $scope.updateFriendsCreatePoll();
    // $scope.checkOptionInCreatePoll();
  };


// $scope.checkOptionInCreatePoll = function(){
//   if($scope.createPoll.timePoll != ""){
//     if($scope.createPoll.gender != ""){
//       if($scope.createPoll.range != ""){
//         if($scope.friendPoll){
//           for(friend in $scope.friends){
//             if($scope.friends[friend].selected){
//               $scope.showFinishButtonCreatePoll = true;
//             }
//             else{
//               $scope.showFinishButtonCreatePoll = false;
//             }
//           }
//         }
//         if($scope.worldPoll){
//           if($scope.createPoll.usersConcerned != ""){
//             $scope.showFinishButtonCreatePoll = true;
//           }
//           else{
//             $scope.showFinishButtonCreatePoll = false;
//           }
//         }
//       }
//     }
//   }
// };
//////////////// resize image ///////////////////


    // $scope.imgLeftInfo = $scope.getInfoImage($scope.createPoll.photoLeft);
    // $scope.imgRightInfo = $scope.getInfoImage($scope.createPoll.photoRight);

    // $scope.imgLeftInfo = $scope.setPositionImage($scope.imgLeftInfo.imgWidth, $scope.imgLeftInfo.imgHeight);
    // $scope.imgRightInfo = $scope.setPositionImage($scope.imgRightInfo.imgWidth, $scope.imgRightInfo.imgHeight);


///// set position and info image //////////////////

$scope.getInfoImage = function(photoBase64){
 var image = new Image();
 image.src = photoBase64;
 console.log("hihahaaaaaaa");
 image.onload = function(){
  console.log("hihahoooooooooooo" + image.height);
  return {"imgWidth": image.width, "imgHeight": image.height};
};
};

$scope.setPositionImage = function(imgWidth, imgHeight){
  var imgInfo = new Array();

  var viewportWidth = window.screen.width;
  var viewportHeight = window.screen.height * 0.55;

  if(imgWidth <= imgHeight){
    imgInfo = $scope.resizeImageWidth(imgWidth, imgHeight, viewportWidth, viewportHeight);
  }
  else{
    imgInfo = $scope.resizeImageHeight(imgWidth, imgHeight, viewportWidth, viewportHeight);
  }

  return imgInfo;
};

$scope.resizeImageWidth = function(imgWidth, imgHeight, divWidth, divHeight){
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

  var positionLeft = -posTopLeftX;
  var positionTop = 0;
  var imgWidth = finalWidthImg;
  var imgHeight = divHeight;

  return {"positionLeft": positionLeft, "positionTop": positionTop, "imgWidth": imgWidth, "imgHeight": imgHeight};
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