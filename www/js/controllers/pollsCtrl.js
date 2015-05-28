zonder.controller('pollsCtrl', function($scope, $ionicModal, $ionicSlideBoxDelegate, UserService, CommentService, PollService, $rootScope, $window, $ionicActionSheet){

	$scope.commentToDisplay = new Array();

	$scope.displaySectionComments = false;
	$scope.displaySectionVotes = false;
	$scope.displayPourcentageAndOpacity = true;

	$scope.imgLeftInfoPollModal = new Array();
	$scope.imgRightInfoPollModal = new Array();

///////////////////////////////  slide 1 ///////////////////////////
$ionicModal.fromTemplateUrl('modals/pollModal.html', {
	scope: $scope,
	animation: 'slide-in-right'
}).then(function(modal) {
	$scope.pollModal = modal;
});

$scope.openPollModal = function(poll) {
	console.log("openPollModal");
	$scope.pollToDisplay = poll;
	$scope.pollToDisplay.gender = "female";
	$scope.pollToDisplay.range = "Monde";

	console.log("1");
	$scope.imgLeftInfoPollModal = $scope.setPositionImageInCommentsAndPollModal($scope.pollToDisplay.imageWidthLeft, $scope.pollToDisplay.imageHeightLeft);
	$scope.imgRightInfoPollModal = $scope.setPositionImageInCommentsAndPollModal($scope.pollToDisplay.imageWidthRight, $scope.pollToDisplay.imageHeightRight);

	console.log("2");
	$scope.refreshPoll($scope.pollToDisplay);
	$scope.pollModal.show();
};

$scope.closePollModal = function() {
	$scope.displaySectionComments = false;
	$scope.displaySectionVotes = false;
	$scope.displayPourcentageAndOpacity = true;
	$scope.pollToDisplay.writeComment = "";
	$scope.pollModal.hide();
};

$scope.$on('$destroy', function() {
	$scope.pollModal.remove();
});

$scope.$on('modal.hidden', function() {
});

$scope.$on('modal.removed', function() {
});

$scope.calculateTimePoll = function(callback){
	var startDate = $scope.pollToDisplay.startDate;
	var timePoll = $scope.pollToDisplay.timePoll;
	var dateNowInMs = Date.now();
	var startDateMs = Date.parse(startDate);
	var timeInMs = dateNowInMs - startDateMs;
	// var timeInHours = timeInMs/3600000;

	var timeInSeconds = timeInMs/1000;

	if (timeInSeconds >= timePoll){
		$scope.pollToDisplay.isOver = true;
	}
	else{
		var timeAfterTimeOutInSeconds = timePoll - timeInSeconds;
		var timeInHours = timeAfterTimeOutInSeconds / 3600;
		timeInHours = timeInHours.toString();
		var tabTime = timeInHours.split('.');
		var timeInMinutes = "0." + tabTime[1]; 
		timeInMinutes = parseFloat(timeInMinutes);

		timeInMinutes = timeInMinutes * 60;
		timeInMinutes = timeInMinutes.toString();

		var tabTimeInMinutes = timeInMinutes.split('.');

		timeInMinutes = tabTimeInMinutes[0];
		timeInHours = tabTime[0];

		$scope.pollToDisplay.minutes = timeInMinutes;
		$scope.pollToDisplay.hours = timeInHours;
	}

	callback();
};



$scope.getPollInfos = function(poll, callback){
	PollService.getPollFromId(poll.id).then(function(d){
		poll.votes = d.votes;
		poll.whoVotedWhat = d.whoVotedWhat;
		poll.progression = d.progression;
		poll.timePoll = d.timePoll;
		poll.startDate = d.startDate;
		poll.photoLeftVote = d.photoLeftVote;
		poll.photoRightVote = d.photoRightVote;
		poll.pourcentagePhotoLeft = d.pourcentagePhotoLeft;
		poll.pourcentagePhotoRight = d.pourcentagePhotoRight;
		poll.comments = d.comments;
		poll.friendsConcerned = d.friendsConcerned;
		poll.usersConcerned = d.usersConcerned;
		poll.isOver = d.isOver;
		poll.isRemoved = false;

		var time = $scope.getTimeHoursMinutesFromPoll(poll);
		poll.timeElapsedHours = time.hours;
		poll.timeElapsedMinutes = time.minutes;
		callback();
	}, function(status){
		console.log("Impossible de récuperer les infos basic du sondage");
		callback();
	});
};


$scope.refreshPoll = function(poll){
	async.series([function(callback){$scope.getPollsInfos(poll, callback);},
		$scope.calculateTimePoll],
		function(err, res){
		});
};

$scope.displayPourcentageFunction = function(){
	if($scope.displaySectionVotes || $scope.displaySectionComments){
		$scope.displayPourcentageAndOpacity = false;
	}
	else if(!$scope.displaySectionVotes && !$scope.displaySectionComments){
		$scope.displayPourcentageAndOpacity = true;
	}
};

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
				$scope.queriesForCommentInfo.splice(0, $scope.queriesForCommentInfo.length);
				$scope.queriesForCommentphotoUser.splice(0, $scope.queriesForCommentphotoUser.length);
				$scope.$apply();
			});
	};

	$scope.comments = function(displaySectionComments){
		$scope.displaySectionVotes = false;
		$scope.displaySectionComments = !displaySectionComments;
		$scope.displayPourcentageFunction();
		if($scope.displaySectionComments && $scope.pollToDisplay.comments.length){
			$scope.displayComments($scope.pollToDisplay);
		}
	}

	$scope.sendComment = function(){
		PollService.sendComment($scope.pollToDisplay.id, $window.localStorage['pseudo'],$scope.pollToDisplay.writeComment).then(function(d){
			console.log("data" + JSON.stringify(d));
			var pollTmp = {};
			pollTmp.author = d.comment.author;
			pollTmp.comment = d.comment.comment;
			pollTmp.photoAuthorComments = $window.localStorage['photo'];
			console.log("pollTmp" + JSON.stringify(pollTmp));

			$scope.pollToDisplay.comments.push(pollTmp);
			$scope.pollToDisplay.writeComment = "";
			$scope.$apply();
		}, function(status){
			console.log("Impossible d'envoyer le commentaire");
		});
	};

///////////////////////////////// vote friends ////////////////////////////////////////////

$scope.queriesForPhotoFriendsLeft = new Array();
$scope.queriesForPhotoFriendsRight = new Array();

$scope.getPhotoForFriends = function(poll, callback){
	console.log("3");
	async.parallel([function(callback){$scope.getPhotoForFriendsLeft(poll, callback)}, function(callback){$scope.getPhotoForFriendsRight(poll, callback)}], function(err, res){
		callback();
	});
};

$scope.getPhotoForFriendsLeft = function(poll, callback){
	angular.forEach(poll.whoVotedLeft, function(friend, key){
		var q = function(callback){
			UserService.getFriendPhotoFromId(friend.id).then(function(d){
				angular.forEach(poll.whoVotedLeft, function(f, k){
					if(f.id == friend.id){
						f.photo = d.photo;
						callback();
					}
				});
			}, function(status){
				console.log("Impossible de récuperer la photo du votant gauche");
			});
		};
		$scope.queriesForPhotoFriendsLeft.push(q);
	});
	callback();
};

$scope.getPhotoForFriendsRight = function(poll, callback){
	angular.forEach(poll.whoVotedRight, function(friend, key){
		var q = function(callback){
			UserService.getFriendPhotoFromId(friend.id).then(function(d){
				angular.forEach(poll.whoVotedRight, function(f, k){
					if(f.id == friend.id){
						f.photo = d.photo;
						callback();
					}
				});
			}, function(status){
				console.log("Impossible de récuperer la photo du votant droite");
			});
		};
		$scope.queriesForPhotoFriendsRight.push(q);
	});
	callback();
};


$scope.queriesExecPhotoFriendsLeft = function(callback){
	async.parallel($scope.queriesForPhotoFriendsLeft,function(err, res){
		callback();
	});
};

$scope.queriesExecPhotoFriendsRight= function(callback){
	async.parallel($scope.queriesForPhotoFriendsRight,function(err, res){
		callback();
	});
};

$scope.queriesParallelPhotoFriends = function(callback) {
	async.parallel([$scope.queriesExecPhotoFriendsLeft, $scope.queriesExecPhotoFriendsRight], function(err, res){
		callback();
	});
};

$scope.displayVoteFriends = function(poll){
	console.log("1");

	var ligneImpairLeft = true;
	var positionLeft = false;

	var ligneImpairRight = true;
	var positionRight = false;

	var cptLeft = 0;
	var cptRight = 0;

	var firstPositionPairLeft = false;
	var firstPositionPairRight = false;

	poll.whoVotedLeft = new Array();
	poll.whoVotedRight = new Array();

	console.log("2");
	for(who in poll.whoVotedWhat){
		if(poll.whoVotedWhat[who].choice == "left"){
			if(cptLeft == 5 && ligneImpairLeft == false){
				cptLeft = 0;
				ligneImpairLeft = true;
			}
			if(cptLeft == 6 && ligneImpairLeft == true){
				cptLeft = 0;
				ligneImpairLeft = false;
			}
			if(cptLeft == 1 && ligneImpairLeft == false){
				positionLeft = true;
			}

			if(positionLeft == false && ligneImpairLeft == false){
				firstPositionPairLeft = true;
			}

			
			poll.whoVotedLeft.push({id : poll.whoVotedWhat[who].id, firstPositionPair : firstPositionPairLeft, photo : "img/louis.png", ligneImpair: ligneImpairLeft, position : positionLeft, isClicked : false});
			console.log("addLeft");
			cptLeft++;
			firstPositionPairLeft = false;
			if(positionLeft && cptLeft == 5){
				positionLeft = false;
			}

		}
		else if(poll.whoVotedWhat[who].choice == "right"){
			if(cptRight == 5 && ligneImpairRight == false){
				cptRight = 0;
				ligneImpairRight = true;
			}
			if(cptRight == 6 && ligneImpairRight == true){
				cptRight = 0;
				ligneImpairRight = false;
			}
			if(cptRight == 1 && ligneImpairRight == false){
				positionRight = true;
			}

			if(positionRight == false && ligneImpairRight == false){
				firstPositionPairRight = true;
			}

			poll.whoVotedRight.push({id : poll.whoVotedWhat[who].id, firstPositionPair : firstPositionPairRight, photo : "img/louis.png", ligneImpair : ligneImpairRight, position : positionRight, isClicked : false});
			console.log("addRight");
			cptRight++;
			firstPositionPairRight = false;
			if(positionRight && cptRight == 5){
				positionRight = false;
			}
		}
	}
	console.log("2");
	async.series([function(callback){$scope.getPhotoForFriends(poll,callback)}, $scope.queriesParallelPhotoFriends], 
		function(err, result){
			console.log("poll.whoVotedRight" + JSON.stringify(poll.whoVotedRight));
			$scope.queriesForPhotoFriendsLeft.splice(0, $scope.queriesForPhotoFriendsLeft.length);
			$scope.queriesForPhotoFriendsRight.splice(0, $scope.queriesForPhotoFriendsRight.length);
			console.log("finvotes");
			$scope.$apply();
		});
};


$scope.votes = function(displaySectionVotes){
	$scope.displaySectionComments = false;
	$scope.displaySectionVotes = !displaySectionVotes;
	$scope.displayPourcentageFunction();
	console.log("LOOOOOOOL");
		// $scope.pollToDisplay.whoVotedLeft.splice(0, $scope.pollToDisplay.whoVotedLeft.length);
		// $scope.pollToDisplay.whoVotedRight .splice(0, $scope.pollToDisplay.whoVotedRight.length);
		$scope.queriesForPhotoFriendsLeft.splice(0, $scope.queriesForPhotoFriendsLeft.length);
		$scope.queriesForPhotoFriendsRight.splice(0, $scope.queriesForPhotoFriendsRight.length);
		console.log("whoVotedWhat" + $scope.pollToDisplay.whoVotedWhat);
		if($scope.displaySectionVotes && $scope.pollToDisplay.whoVotedWhat.length){
			$scope.displayVoteFriends($scope.pollToDisplay);
		}
	};

});