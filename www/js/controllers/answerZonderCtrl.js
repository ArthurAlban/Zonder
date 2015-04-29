zonder.controller('answerZonderCtrl', function($scope, $state, $window, PollService, UserService, $ionicActionSheet){

///////////////// Récupération des polls ////////////////////////////

$scope.pollsLoaded = new Array();
$scope.pollsToBeLoaded = new Array();
$scope.pollUp = new Array();
$scope.pollDown = new Array();

$scope.pollUp.isFavourited = false;
$scope.pollUp.isAskingAddInFavourites = false;

$scope.pollDown.isFavourited = false;
$scope.pollDown.isAskingAddInFavourites = false;

$scope.queriesForUserInfo = new Array();
$scope.queriesForUserPhoto = new Array();
$scope.queriesForPollsInfosAnswerZonder = new Array();
$scope.queriesForPollsInfosPhotoAnswerZonder = new Array();



$scope.addPollUpInFavourites = function(id){
	$scope.pollUp.isAskingAddInFavourites = true;
	PollService.addPollinFavourites(id).then(function(data){
		$scope.pollUp.isAskingAddInFavourites = false;
		$scope.pollUp.isFavourited = true;
	}, function(status) {
		console.log("impossible d'ajouter le sondage en favoris");
		$scope.pollUp.isAskingAddInFavourites = false;
		$scope.pollUp.isFavourited = false;
	});
};


$scope.checkIfPollUpIsFavourited = function(){
	$scope.pollUp.isFavourited = false;
	PollService.getPollsForHistory().then(function(data){
		$scope.pollsFromHistory = data;
		for(poll in $scope.pollsFromHistory){
			if($scope.pollsFromHistory[poll].id == $scope.pollUp.id){
				$scope.pollUp.isFavourited = true;
			}
		}
	},function(status) {
		console.log("impossible de récupérer l'historique des sondages");
	});
};


$scope.addPollDownInFavourites = function(id){
	$scope.pollDown.isAskingAddInFavourites = true;
	PollService.addPollinFavourites(id).then(function(data){
		$scope.pollDown.isAskingAddInFavourites = false;
		$scope.pollDown.isFavourited = true;
	}, function(status) {
		console.log("impossible d'ajouter le sondage en favoris");
		$scope.pollDown.isAskingAddInFavourites = false;
		$scope.pollDown.isFavourited = false;
	});
};

$scope.checkIfPollDownIsFavourited = function(){
	$scope.pollDown.isFavourited = false;
	PollService.getPollsForHistory().then(function(data){
		$scope.pollsFromHistory = data;
		for(poll in $scope.pollsFromHistory){
			if($scope.pollsFromHistory[poll].id == $scope.pollDown.id){
				$scope.pollDown.isFavourited = true;
			}
		}
	},function(status) {
		console.log("impossible de récupérer l'historique des sondages");
	});
};


$scope.getPollsToBeLoaded = function(callback){
	// faire route server qui récupére 6 sondages lié à l'algo de distribution des polls
	$scope.pollsToBeLoaded.push({id : "5540cc128add14a403000008"});
	$scope.pollsToBeLoaded.push({id : "5540a52c8add14a403000005"});
	callback();
};

$scope.getInfosUsersAndPollPhoto = function(pollArray, callback){
	async.parallel([function(callback){$scope.getInfoPhotoPollAnswerZonder($scope.pollsToBeLoaded, callback)}, function(callback){$scope.getUsersInfos($scope.pollsToBeLoaded, callback)}, function(callback){$scope.getUsersPhoto($scope.pollsToBeLoaded, callback)}], function(err, res){
		callback();
	});
}

$scope.getPollsInfosAnswerZonder = function(pollArray, callback){
  if(pollArray.length){
    angular.forEach(pollArray, function(poll, key){ 
      var q = function(callback){
        PollService.getPollFromId(poll.id).then(function(d){
          angular.forEach(pollArray, function(p, k){
            if(p.id == poll.id){
              p.author = new Array();
              p.author.id = d.author;
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

              p.timeElapsed = new Array();
              p.timeElapsed = $scope.getTimeHoursMinutesFromPoll(p);
            }
          });
          callback();
        }, function(status){
          console.log("Impossible de récuperer les infos basic du sondage");
          callback();
        });
      };
      $scope.queriesForPollsInfosAnswerZonder.push(q);
    });
    callback();
  }
  else {
    callback();
  }
};

$scope.getInfoPhotoPollAnswerZonder = function(pollArray, callback){
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
                callback();
              };
            },function(callback){
              imageRight.onload = function(){
                p.imageWidthRight = imageRight.width;
                p.imageHeightRight = imageRight.height;
                callback();
              };
            }], function(err, res){
              callback();
            });
          }
        }); 
      }
      $scope.queriesForPollsInfosPhotoAnswerZonder.push(q);
    });
    callback();
  }
  else {
    callback();
  }
};

$scope.queriesExecPollsInfosAnswerZonder = function(callback){
  async.parallel($scope.queriesForPollsInfosAnswerZonder,function(err, res){
    callback();
  });
};

$scope.queriesParallelRequestInfoPollAnswerZonder = function(callback){
  async.parallel([$scope.queriesExecPollsInfosAnswerZonder], function(err, res){
    callback();
  });
};

$scope.queriesExecPollsInfosPhotoAnswerZonder = function(callback){
  async.parallel($scope.queriesForPollsInfosPhotoAnswerZonder,function(err, res){
    callback();
  });
};


$scope.getUsersInfos = function(pollArray, callback){
	angular.forEach(pollArray, function(poll, key){
		var q = function(callback){
			UserService.getFriendInfoFromId(poll.author.id).then(function(d){
				angular.forEach(pollArray, function(p, k){
					if(p.id == poll.id){
						p.author.pseudo = d.pseudo;
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
			UserService.getFriendPhotoFromId(poll.author.id).then(function(d){
				angular.forEach(pollArray, function(p, k){
					if(p.id == poll.id){
						p.author.photo = d.photo;
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

$scope.queriesParallelInfosUsersAndPollPhoto = function(callback) {
	async.parallel([$scope.queriesExecUsersInfos, $scope.queriesExecUsersPhoto, $scope.queriesExecPollsInfosPhotoAnswerZonder], function(err, res){
		callback();
	});
};

$scope.updateInformationsPolls = function(callback){
	async.series([$scope.getPollsToBeLoaded, function(callback){$scope.getPollsInfosAnswerZonder($scope.pollsToBeLoaded, callback)}, $scope.queriesParallelRequestInfoPollAnswerZonder, function(callback){$scope.getInfosUsersAndPollPhoto($scope.pollsToBeLoaded, callback)}, $scope.queriesParallelInfosUsersAndPollPhoto], 
		function(err, result){
			angular.forEach($scope.pollsToBeLoaded, function(poll, key){
				$scope.pollsLoaded.push(poll);
			});
			$scope.pollsToBeLoaded.splice(0,$scope.pollsToBeLoaded.length);
			$scope.queriesForUserInfo.splice(0,$scope.queriesForUserInfo.length);
			$scope.queriesForUserPhoto.splice(0,$scope.queriesForUserPhoto.length);
			$scope.queriesForPollsInfosAnswerZonder.splice(0,$scope.queriesForPollsInfosAnswerZonder.length);
			$scope.queriesForPollsInfosPhotoAnswerZonder.splice(0,$scope.queriesForPollsInfosPhotoAnswerZonder.length);
			callback();
		});
};

$scope.firstLoadPoll = function(){
	async.series([$scope.updateInformationsPolls,$scope.getNextPollUp,$scope.getNextPollDown],
		function(err, result){
			$scope.checkIfPollUpIsFavourited();
			$scope.checkIfPollDownIsFavourited();
			console.log("affect up and down poll");
		});
};

$scope.getNextPollUp = function(callback){
	$scope.pollUp = $scope.pollsLoaded.shift();
	$scope.imgPollUpLeftInfo = $scope.setPositionImageAnswerZonder($scope.pollUp.imageWidthLeft, $scope.pollUp.imageHeightLeft);
	$scope.imgPollUpRightInfo = $scope.setPositionImageAnswerZonder($scope.pollUp.imageWidthRight, $scope.pollUp.imageHeightRight);
	console.log("$scope.imgPollUpLeftInfo" + JSON.stringify($scope.imgPollUpLeftInfo));
	console.log("$scope.imgPollUpRightInfo" + JSON.stringify($scope.imgPollUpRightInfo));
	callback();
};

$scope.getNextPollDown = function(callback){
	$scope.pollDown = $scope.pollsLoaded.shift();
	$scope.imgPollDownLeftInfo = $scope.setPositionImageAnswerZonder($scope.pollDown.imageWidthLeft, $scope.pollDown.imageHeightLeft);
	$scope.imgPollDownRightInfo = $scope.setPositionImageAnswerZonder($scope.pollDown.imageWidthRight, $scope.pollDown.imageHeightRight);
	console.log("$scope.imgPollDownLeftInfo" + JSON.stringify($scope.imgPollDownLeftInfo));
	console.log("$scope.imgPollDownRightInfo" + JSON.stringify($scope.imgPollDownRightInfo));
	callback();
};

$scope.checkLengthAndGetMorePoll = function(){
	if($scope.pollsLoaded.length <= 2){
		$scope.updateInformationsPolls();
	}
};

window.setTimeout(function(){
  $scope.firstLoadPoll();
}, 2000);

///////////// Action sheet option poll ////////////
$scope.showActionsheetAnswerZonderUp = function() {
	$ionicActionSheet.show({
		buttons: [
		{ text: 'Share' },
		{ text: 'Report this poll' },
		],
		cancelText: 'Annuler',
		cancel: function() {
		},
		buttonClicked: function(index) {
			if(index == 0){
			}
			if(index == 1){
				$scope.reportThisPoll($scope.pollUp.id);
			}
			return true;
		}
	});
};

$scope.showActionsheetAnswerZonderDown = function() {
	$ionicActionSheet.show({
		buttons: [
		{ text: 'Share' },
		{ text: 'Report this poll' },
		],
		cancelText: 'Annuler',
		cancel: function() {
		},
		buttonClicked: function(index) {
			if(index == 0){
			}
			if(index == 1){
				$scope.reportThisPoll($scope.pollDown.id);
			}
			return true;
		}
	});
};

$scope.imgPollUpLeftInfo = new Array();
$scope.imgPollUpRightInfo = new Array();

$scope.imgPollDownLeftInfo = new Array();
$scope.imgPollDownRightInfo = new Array();



///// set position and info image //////////////////

$scope.setPositionImageAnswerZonder = function(imgWidth, imgHeight){
  var imgInfo = new Array();

  var viewportWidth = window.screen.width * 0.40;
  var viewportHeight = window.screen.width * 0.30;
  console.log("viewportHeight" + viewportHeight);
  console.log("viewportWidth" + viewportWidth);
  console.log("imgWidth" + imgWidth);
  console.log("imgHeight" + imgHeight);

  if(imgWidth <= imgHeight){
    console.log("portrait");
    imgInfo = $scope.resizeImageWidth(imgWidth, imgHeight, viewportWidth, viewportHeight);
  }
  else{
    console.log("lanscape");
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
	var imgWidthFinal = divWidth;
	var imgHeightFinal = finalHeightImg;

	if(imgHeightFinal < divHeight){
 		var imgInfoResizeHeight = new Array();
		imgInfoResizeHeight = $scope.resizeImageHeight(imgWidthFinal, imgHeightFinal, divWidth, divHeight);
		return {"positionLeft": imgInfoResizeHeight.positionLeft, "positionTop": imgInfoResizeHeight.positionTop, "imgWidth": imgInfoResizeHeight.imgWidth, "imgHeight": imgInfoResizeHeight.imgHeight};
	}

	return {"positionLeft": positionLeft, "positionTop": positionTop, "imgWidth": imgWidthFinal, "imgHeight": imgHeightFinal};
};

$scope.resizeImageHeight = function(imgWidth, imgHeight, divWidth, divHeight){
	var heightIncreaseFactor = divHeight / imgHeight;

	var finalWidthImg = heightIncreaseFactor * imgWidth;
	var posTopLeftX = (divWidth - finalWidthImg) / 2;

	var positionLeft = posTopLeftX;
	var positionTop = 0;
	var imgWidthFinal = finalWidthImg;
	var imgHeightFinal = divHeight;

	if(imgWidthFinal < divWidth){
		console.log("jy suissssss");
 		var imgInfoResizeWidth = new Array()
		imgInfoResizeWidth = $scope.resizeImageWidth(imgWidthFinal, imgHeightFinal, divWidth, divHeight);
		console.log("imgInfoResizeWidth" + JSON.stringify(imgInfoResizeWidth));
		return {"positionLeft": imgInfoResizeWidth.positionLeft, "positionTop": imgInfoResizeWidth.positionTop, "imgWidth": imgInfoResizeWidth.imgWidth, "imgHeight": imgInfoResizeWidth.imgHeight};
	}

	return {"positionLeft": positionLeft, "positionTop": positionTop, "imgWidth": imgWidthFinal, "imgHeight": imgHeightFinal};
};


});