zonder.controller('answerZonderCtrl', function($scope, $state, $window, $ionicModal, CommentService, PollService, UserService, $ionicActionSheet, $cordovaSocialSharing, $cordovaStatusbar){

///////////////// Récupération des polls ////////////////////////////
//boolean for css fix (max-width)
$scope.displayPhotoTitle = false;

$scope.pollsLoaded = new Array();
$scope.pollsToBeLoaded = new Array();
$scope.pollUp = new Array();
$scope.pollDown = new Array();

$scope.pollUp.isFavourited = false;
$scope.pollUp.isAskingAddInFavourites = false;

$scope.pollDown.isFavourited = false;
$scope.pollDown.isAskingAddInFavourites = false;

$scope.queriesForUserInfoAnswerZonder = new Array();
$scope.queriesForUserPhotoAnswerZonder = new Array();
$scope.queriesForPollsInfosAnswerZonder = new Array();
$scope.queriesForPollsInfosPhotoAnswerZonder = new Array();

$scope.getPollsToBeLoaded = function(callback){
	// faire route server qui récupére 6 sondages lié à l'algo de distribution des polls

	$scope.pollsToBeLoaded.push({id : "55c9facdf786b8f80e000005"});
	$scope.pollsToBeLoaded.push({id : "55c9facdf786b8f80e000005"});
	callback();
};

$scope.getInfosUsersAndPollPhotoAnswerZonder = function(pollArray, callback){
	async.parallel([function(callback){$scope.getInfoPhotoPollAnswerZonder($scope.pollsToBeLoaded, callback)}, function(callback){$scope.getUsersInfosAnswerZonder($scope.pollsToBeLoaded, callback)}, function(callback){$scope.getUsersPhotoAnswerZonder($scope.pollsToBeLoaded, callback)}], function(err, res){
		callback();
	});
};

$scope.getPollsInfosAnswerZonder = function(pollArray, callback){

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

$scope.getUsersInfosAnswerZonder = function(pollArray, callback){
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
		$scope.queriesForUserInfoAnswerZonder.push(q);
	});
	callback();
};

$scope.getUsersPhotoAnswerZonder = function(pollArray, callback){
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
		$scope.queriesForUserPhotoAnswerZonder.push(q);
	});
	callback();
};

$scope.queriesParallelInfosUsersAndPollPhotoAnswerZonder = function(callback) {
	async.parallel([$scope.queriesExecUsersInfosAnswerZonder, $scope.queriesExecUsersPhotoAnswerZonder, $scope.queriesExecPollsInfosPhotoAnswerZonder], function(err, res){
		callback();
	});
};

$scope.queriesExecUsersInfosAnswerZonder = function(callback){
	async.parallel($scope.queriesForUserInfoAnswerZonder,function(err, res){
		callback();
	});
};

$scope.queriesExecUsersPhotoAnswerZonder = function(callback){
	async.parallel($scope.queriesForUserPhotoAnswerZonder,function(err, res){
		callback();
	});
};

$scope.queriesExecPollsInfosPhotoAnswerZonder = function(callback){
	async.parallel($scope.queriesForPollsInfosPhotoAnswerZonder,function(err, res){
		callback();
	});
};


$scope.updateInformationsPolls = function(callback){
	async.series([$scope.getPollsToBeLoaded,
		function(callback){$scope.getPollsInfosAnswerZonder($scope.pollsToBeLoaded, callback)},
		$scope.queriesExecPollsInfosAnswerZonder,
		function(callback){$scope.getInfosUsersAndPollPhotoAnswerZonder($scope.pollsToBeLoaded, callback)},
		$scope.queriesParallelInfosUsersAndPollPhotoAnswerZonder], 
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
			console.log("fin load answer poll");
		});
};

$scope.getNextPollUp = function(callback){
	$scope.pollUp = $scope.pollsLoaded.shift();
	$scope.displayPhotoTitle = true;
	$scope.imgPollUpLeftInfo = $scope.setPositionImageVoteAndZonder($scope.pollUp.imageWidthLeft, $scope.pollUp.imageHeightLeft);
	$scope.imgPollUpRightInfo = $scope.setPositionImageVoteAndZonder($scope.pollUp.imageWidthRight, $scope.pollUp.imageHeightRight);
	callback();
};

$scope.getNextPollDown = function(callback){
	$scope.pollDown = $scope.pollsLoaded.shift();
	$scope.imgPollDownLeftInfo = $scope.setPositionImageVoteAndZonder($scope.pollDown.imageWidthLeft, $scope.pollDown.imageHeightLeft);
	$scope.imgPollDownRightInfo = $scope.setPositionImageVoteAndZonder($scope.pollDown.imageWidthRight, $scope.pollDown.imageHeightRight);
	callback();
};

$scope.checkLengthAndGetMorePoll = function(){
	if($scope.pollsLoaded.length <= 2){
		$scope.updateInformationsPolls();
	}
};

 $scope.firstLoadPoll();

// window.setTimeout(function(){
//   console.log("je lance answer poll");
// }, 1000);

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


$scope.votePollUp = function(pollId, choice){
	PollService.voteAndUpdatePoll(pollId, choice).then(function(data){
	}, function(status){
	});
};

$scope.votePollDown = function(pollId, choice){
	PollService.voteAndUpdatePoll(pollId, choice).then(function(data){
	}, function(status){
	});
};

$scope.imgLeftInfoComments = new Array();
$scope.imgRightInfoComments = new Array();

/////////////// Récupération des commentaires ///////////////////////
$scope.queriesForCommentInfo = new Array();
$scope.queriesForCommentphotoUser = new Array();

$scope.getInfosCommentsAndUser = function(poll, callback){
	async.parallel([function(callback){$scope.getCommentsInfos(poll, callback)}, function(callback){$scope.getCommentsPhotoUser(poll, callback)}], function(err, res){
		callback();
	});
};

$scope.getCommentsInfos = function(poll, callback){
	angular.forEach(poll.comments, function(comment, key){
		var q = function(callback){
			CommentService.getCommentsInfoById(comment.id).then(function(d){
				angular.forEach(poll.comments, function(c, k){
					if(c.id == comment.id){
						c.author = d.author;
						c.comment = d.comment;
						c.idAuthor = d.idAuthor;
						c.photoAuthorComments = "img/louis.png";
					}
				});
				callback();
			}, function(status) {
				console.log("impossible de récuperer les infos du commentaire");
			});
		};
		$scope.queriesForCommentInfo.push(q);
	});
	callback();
};

$scope.getCommentsPhotoUser = function(poll, callback){
	angular.forEach(poll.comments, function(comment, key){
		var q = function(callback){
			UserService.getFriendPhotoFromId(comment.idAuthor).then(function(d){
				angular.forEach(poll.comments, function(c, k){
					if(c.id == comment.id){
						console.log("photoAuthor" + d.photo);
						c.photoAuthorComments = d.photo;
						callback();
					}
				});
			},function(status) {
				console.log("impossible de récupérer la photo d'un utilisateur");
			});
		};
		$scope.queriesForCommentphotoUser.push(q);
	});
	callback();
};


$scope.queriesExecInfoComment = function(callback){
	async.parallel($scope.queriesForCommentInfo,function(err, res){
		// $scope.loadingComments = false;
		callback();
	});
};

$scope.queriesExecPhotoUserComment = function(callback){
	async.parallel($scope.queriesForCommentphotoUser,function(err, res){
		callback();
	});
};

$scope.queriesParallel = function(callback) {
	async.series([$scope.queriesExecInfoComment, $scope.queriesExecPhotoUserComment], function(err, res){
		callback();
	});
};


$scope.displayComments = function(poll){
		// $scope.loadingComments = true;
		$scope.queriesForCommentInfo.splice(0, $scope.queriesForCommentInfo.length);
		$scope.queriesForCommentphotoUser.splice(0, $scope.queriesForCommentphotoUser.length);
		// A faire quand on change de sondage $scope.comments.splice(0, $scope.comments.length);
		async.series([function(callback){$scope.getInfosCommentsAndUser(poll, callback)}, $scope.queriesParallel], 
			function(err, result){
				console.log("fin displayComments");
				$scope.queriesForCommentInfo.splice(0, $scope.queriesForCommentInfo.length);
				$scope.queriesForCommentphotoUser.splice(0, $scope.queriesForCommentphotoUser.length);
				$scope.$apply();
			});
	};

/////////////////////////  Comments modal Up ////////////////////////////////


$scope.openCommentsModalUp = function() {
	$ionicModal.fromTemplateUrl('modals/commentsModalUp.html', {
		scope: $scope,
		animation: 'slide-in-right',
		backdropClickToClose: false
	}).then(function(modal) {
		console.log("open comments modal up");
		$scope.commentsModalUp = modal;
		$scope.pollUp.writeComment = "";
		$scope.imgLeftInfoComments = $scope.setPositionImageInCommentsAndPollModal($scope.pollUp.imageWidthLeft, $scope.pollUp.imageHeightLeft);
		$scope.imgRightInfoComments = $scope.setPositionImageInCommentsAndPollModal($scope.pollUp.imageWidthRight, $scope.pollUp.imageHeightRight);

		if($scope.pollUp.comments.length){
			$scope.displayComments($scope.pollUp);
		}

		$scope.commentsModalUp.show();
		$cordovaStatusbar.hide();
	});
};

$scope.closeCommentsModalUp = function() {
	console.log("remove comments modal up");
	$scope.queriesForCommentInfo.splice(0, $scope.queriesForCommentInfo.length);
	$scope.queriesForCommentphotoUser.splice(0, $scope.queriesForCommentphotoUser.length);
  	$scope.pollUp.writeComment = "";
    $scope.commentsModalUp.hide();
	$scope.commentsModalDown.remove();
	$cordovaStatusbar.show();
	console.log("remove2 comments modal up");
};


 //  $scope.openCommentsModalUp = function() {
 //  	console.log("comments" + JSON.stringify($scope.pollUp.comments));
 //  	$scope.pollUp.writeComment = "";
	// $scope.imgLeftInfoComments = $scope.setPositionImageInCommentsAndPollModal($scope.pollUp.imageWidthLeft, $scope.pollUp.imageHeightLeft);
	// $scope.imgRightInfoComments = $scope.setPositionImageInCommentsAndPollModal($scope.pollUp.imageWidthRight, $scope.pollUp.imageHeightRight);

	// if($scope.pollUp.comments.length){
	// 	$scope.displayComments($scope.pollUp);
	// }

 //    $scope.commentsModalUp.show();
 //    $cordovaStatusbar.hide();
 //  };

 //  $scope.closeCommentsModalUp = function() {
 //  	$scope.queriesForCommentInfo.splice(0, $scope.queriesForCommentInfo.length);
	// $scope.queriesForCommentphotoUser.splice(0, $scope.queriesForCommentphotoUser.length);
 //  	$scope.pollUp.writeComment = "";
 //    $scope.commentsModalUp.hide();
 //    $cordovaStatusbar.show();
 //    $scope.$apply();
 //  };

$scope.$on('$destroy', function() {
	$scope.commentsModalUp.remove();
});

  // $scope.$on('modal.hidden', function() {
  // 	 console.log("hidden comment modal up");
  // });

  // $scope.$on('modal.removed', function() {
  // 	 console.log("removed comment modal up");
  // });

/////////////////////////  Comments modal Down ////////////////////////////////

$scope.openCommentsModalDown = function() {
	$ionicModal.fromTemplateUrl('modals/commentsModalDown.html', {
		scope: $scope,
		animation: 'slide-in-right',
		backdropClickToClose: false
	}).then(function(modal) {
		$scope.commentsModalDown = modal;
		$scope.pollDown.writeComment = "";
		$scope.imgLeftInfoComments = $scope.setPositionImageInCommentsAndPollModal($scope.pollDown.imageWidthLeft, $scope.pollDown.imageHeightLeft);
		$scope.imgRightInfoComments = $scope.setPositionImageInCommentsAndPollModal($scope.pollDown.imageWidthRight, $scope.pollDown.imageHeightRight);

		if($scope.pollDown.comments.length){
			$scope.displayComments($scope.pollDown);
		}

		console.log("open comments modal down");
		$scope.commentsModalDown.show();
		$cordovaStatusbar.hide();
	});
};

$scope.closeCommentsModalDown = function() {
	console.log("remove comments modal down");
	$scope.queriesForCommentInfo.splice(0, $scope.queriesForCommentInfo.length);
	$scope.queriesForCommentphotoUser.splice(0, $scope.queriesForCommentphotoUser.length);
	$scope.pollDown.writeComment = "";
	$scope.commentsModalDown.remove();
	$cordovaStatusbar.show();
	console.log("remove2 comments modal down");
};

// $ionicModal.fromTemplateUrl('modals/commentsModalDown.html', {
//     scope: $scope,
//     animation: 'slide-in-right',
//     backdropClickToClose: false
//   }).then(function(modal) {
//     $scope.commentsModalDown = modal;
//   });

//   $scope.openCommentsModalDown = function() {
//   	$scope.pollDown.writeComment = "";
// 	$scope.imgLeftInfoComments = $scope.setPositionImageInCommentsAndPollModal($scope.pollDown.imageWidthLeft, $scope.pollDown.imageHeightLeft);
// 	$scope.imgRightInfoComments = $scope.setPositionImageInCommentsAndPollModal($scope.pollDown.imageWidthRight, $scope.pollDown.imageHeightRight);

// 	if($scope.pollDown.comments.length){
// 		$scope.displayComments($scope.pollDown);
// 	}
	
//     $scope.commentsModalDown.show();
//     $cordovaStatusbar.hide();
//   };

 //  $scope.closeCommentsModalDown = function() {
 //  	$scope.queriesForCommentInfo.splice(0, $scope.queriesForCommentInfo.length);
	// $scope.queriesForCommentphotoUser.splice(0, $scope.queriesForCommentphotoUser.length);
 //  	$scope.pollDown.writeComment = "";
 //    $scope.commentsModalDown.hide();
 //    $cordovaStatusbar.show();
 //    $scope.$apply();
 //  };


$scope.$on('$destroy', function() {
	$scope.commentsModalDown.remove();
});


  $scope.$on('modal.hidden', function() {
  	 console.log("hidden comments modal down");
  });

  $scope.$on('modal.removed', function() {
  	 console.log("hidden comments modal down");
  });

  ///////////////////////////////// send comment ////////////////////////////////////////////

  $scope.sendCommentUp = function(){
  	PollService.sendComment($scope.pollUp.id, $window.localStorage['pseudo'],$scope.pollUp.writeComment).then(function(d){
  		var pollTmp = {};
  		pollTmp.author = d.comment.author;
  		pollTmp.comment = d.comment.comment;
  		pollTmp.id = d.comment._id;
  		pollTmp.photoAuthorComments = $window.localStorage['photo'];

  		$scope.pollUp.comments.push(pollTmp);
  		$scope.pollUp.writeComment = "";
  		$scope.$apply();
  	}, function(status){
  		console.log("Impossible d'envoyer le commentaire");
  	});
  };

  $scope.sendCommentDown = function(){
  	PollService.sendComment($scope.pollDown.id, $window.localStorage['pseudo'],$scope.pollDown.writeComment).then(function(d){
  		var pollTmp = {};
  		pollTmp.author = d.comment.author;
  		pollTmp.comment = d.comment.comment;
  		pollTmp.id = d.comment._id;
  		pollTmp.photoAuthorComments = $window.localStorage['photo'];

  		$scope.pollDown.comments.push(pollTmp);
  		$scope.pollDown.writeComment = "";
  		$scope.$apply();
  	}, function(status){
  		console.log("Impossible d'envoyer le commentaire");
  	});
  };

});