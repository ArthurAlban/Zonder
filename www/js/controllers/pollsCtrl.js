zonder.controller('pollsCtrl', function($scope, $ionicModal, $ionicSlideBoxDelegate, UserService, CommentService, PollService, $rootScope, $window, $ionicActionSheet, $cordovaStatusbar, $state){

	$scope.commentToDisplay = new Array();

	$scope.imgLeftInfoPollModal = new Array();
	$scope.imgRightInfoPollModal = new Array();

///////////////////////////////  slide 1 ///////////////////////////
$ionicModal.fromTemplateUrl('modals/pollModal.html', {
	scope: $scope,
	animation: 'slide-in-right'
}).then(function(modal) {
	$scope.pollModal = modal;
});

$scope.$on('$destroy', function() {
	$scope.pollModal.remove();
});

$scope.$on('modal.hidden', function() {
});

$scope.$on('modal.removed', function() {
});

$scope.openPollModal = function(poll) {
	$scope.displaySectionComments = false;
	$scope.displaySectionVotes = false;
	$scope.loadingVote = false;
	$scope.loadVote = true;
	$scope.displayPourcentageAndOpacity = true;

	$scope.pollToDisplay = angular.copy(poll);
	// $scope.pollToDisplay.gender = "female";
	// $scope.pollToDisplay.range = "Monde";

	$scope.imgLeftInfoPollModal = $scope.setPositionImageInCommentsAndPollModal($scope.pollToDisplay.imageWidthLeft, $scope.pollToDisplay.imageHeightLeft);
	$scope.imgRightInfoPollModal = $scope.setPositionImageInCommentsAndPollModal($scope.pollToDisplay.imageWidthRight, $scope.pollToDisplay.imageHeightRight);

	$scope.refreshPoll($scope.pollToDisplay);
	
	$scope.pollModal.show();

	$cordovaStatusbar.hide();
};

$scope.closePollModal = function() {
	$scope.loadVote = true;
	$scope.loadingVote = false;
	$scope.displaySectionComments = false;
	$scope.displaySectionVotes = false;
	$scope.displayPourcentageAndOpacity = true;
	
	// $scope.pollToDisplay.writeComment = "";
	$scope.pollModal.hide();
	$scope.pollToDisplay = {};
	// $cordovaStatusbar.show();
};

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

	console.log("calculateTimePoll");
	callback();
};

$scope.getPollsInfos = function(poll, callback){
	PollService.getPollFromId(poll.id).then(function(d){
		poll.votes = d.votes;
		poll.progression = d.progression;
		poll.timePoll = d.timePoll;
		poll.startDate = d.startDate;
		poll.photoLeftVote = d.photoLeftVote;
		poll.photoRightVote = d.photoRightVote;
		poll.pourcentagePhotoLeft = d.pourcentagePhotoLeft;
		poll.pourcentagePhotoRight = d.pourcentagePhotoRight;
		poll.friendsConcerned = d.friendsConcerned;
		poll.usersConcerned = d.usersConcerned;
		poll.isOver = d.isOver;
		poll.isRemoved = false;

		//poll.whoVotedWhat = new Array();
		poll.comments = d.comments;

		var time = $scope.getTimeHoursMinutesFromPoll(poll);
		poll.timeElapsedHours = time.hours;
		poll.timeElapsedMinutes = time.minutes;

		console.log("getPollsInfos");
		callback();
	}, function(status){
		console.log("Impossible de récuperer les infos basic du sondage");
		callback();
	});
};


$scope.refreshPoll = function(poll){
	async.series([function(callback){
		$scope.getPollsInfos(poll, callback);},
		$scope.calculateTimePoll],
		function(err, res){
			console.log("fin refreshPoll");
		});
};
/////////////// Récupération des commentaires ///////////////////////
$scope.queriesForCommentInfo = new Array();
$scope.queriesForCommentphotoUser = new Array();

$scope.displayComments = function(poll){
	console.log("displayComments");

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
		console.log("comments");
	// $scope.displaySectionVotes = false;
	$scope.displaySectionComments = !displaySectionComments;
	// $scope.displayPourcentageFunction();

	if($scope.displaySectionComments){
		console.log("displaySectionComments");
		$scope.displayComments($scope.pollToDisplay);
	}
};


$scope.sendComment = function(){
	PollService.sendComment($scope.pollToDisplay.id, $window.localStorage['pseudo'],$scope.pollToDisplay.writeComment).then(function(d){
		var commentTmp = {};
		commentTmp.author = d.comment.author;
		commentTmp.comment = d.comment.comment;
		commentTmp.id = d.comment._id;
		commentTmp.photoAuthorComments = $window.localStorage['photo'];

		$scope.pollToDisplay.comments.push(commentTmp);
		$scope.pollToDisplay.writeComment = "";
		$scope.$apply();

	}, function(status){
		console.log("Impossible d'envoyer le commentaire");
	});
};



$scope.getVotesLeft = function(pollId, index){
	console.log("getVotesLeft");
	PollService.getNextsVotesLeft(pollId, index).then(function(data){
		console.log("getNextsVotesLeft" + data);
	}, function(status){

	});
};

$scope.getVotesRight = function(pollId, index){
	console.log("getVotesRight");
	PollService.getNextsVotesRight(pollId, index).then(function(data){
		console.log("getNextsVotesRight" + data);
	}, function(status){

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
	console.log("getInfosCommentsAndUser");
	async.parallel([function(callback){$scope.getCommentsInfos(poll, callback)}, function(callback){$scope.getCommentsPhotoUser(poll, callback)}], function(err, res){
		callback();
	});
};

$scope.getCommentsInfos = function(poll, callback){
	console.log("getCommentsInfos " + JSON.stringify(poll));
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
	async.parallel($scope.queriesForCommentInfo, function(err, res){
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


///////////////////////////////// vote friends ////////////////////////////////////////////

//$scope.queriesForPhotoFriendsLeft = new Array();
//$scope.queriesForPhotoFriendsRight = new Array();

// $scope.getPhotoForFriends = function(poll, callback){
// 	async.parallel([function(callback){$scope.getPhotoForFriendsLeft(poll, callback)}, function(callback){$scope.getPhotoForFriendsRight(poll, callback)}], function(err, res){
// 		callback();
// 	});
// };

// $scope.getPhotoForFriendsLeft = function(poll, callback){
// 	angular.forEach(poll.whoVotedLeft, function(friend, key){
// 		var q = function(callback){
// 			UserService.getFriendPhotoFromId(friend.id).then(function(d){
// 				angular.forEach(poll.whoVotedLeft, function(f, k){
// 					if(f.id == friend.id){
// 						f.photo = d.photo;
// 						callback();
// 					}
// 				});
// 			}, function(status){
// 				console.log("Impossible de récuperer la photo du votant gauche");
// 			});
// 		};
// 		$scope.queriesForPhotoFriendsLeft.push(q);
// 	});
// 	callback();
// };

// $scope.getPhotoForFriendsRight = function(poll, callback){
// 	angular.forEach(poll.whoVotedRight, function(friend, key){
// 		var q = function(callback){
// 			UserService.getFriendPhotoFromId(friend.id).then(function(d){
// 				angular.forEach(poll.whoVotedRight, function(f, k){
// 					if(f.id == friend.id){
// 						f.photo = d.photo;
// 						callback();
// 					}
// 				});
// 			}, function(status){
// 				console.log("Impossible de récuperer la photo du votant droite");
// 			});
// 		};
// 		$scope.queriesForPhotoFriendsRight.push(q);
// 	});
// 	callback();
// };


// $scope.queriesExecPhotoFriendsLeft = function(callback){
// 	async.parallel($scope.queriesForPhotoFriendsLeft,function(err, res){
// 		callback();
// 	});
// };

// $scope.queriesExecPhotoFriendsRight= function(callback){
// 	async.parallel($scope.queriesForPhotoFriendsRight,function(err, res){
// 		callback();
// 	});
// };

// $scope.queriesParallelPhotoFriends = function(callback) {
// 	async.parallel([$scope.queriesExecPhotoFriendsLeft, $scope.queriesExecPhotoFriendsRight], function(err, res){
// 		callback();
// 	});
// };

// $scope.displayVoteFriends = function(poll){
// 	$scope.loadingVote = true;

// 	var ligneImpairLeft = true;
// 	var positionLeft = false;

// 	var ligneImpairRight = true;
// 	var positionRight = false;

// 	var cptLeft = 0;
// 	var cptRight = 0;

// 	var firstPositionPairLeft = false;
// 	var firstPositionPairRight = false;

// 	poll.whoVotedLeft = new Array();
// 	poll.whoVotedRight = new Array();

// 	for(who in poll.whoVotedWhat){
// 		if(poll.whoVotedWhat[who].choice == "left"){
// 			if(cptLeft == 5 && ligneImpairLeft == false){
// 				cptLeft = 0;
// 				ligneImpairLeft = true;
// 			}
// 			if(cptLeft == 6 && ligneImpairLeft == true){
// 				cptLeft = 0;
// 				ligneImpairLeft = false;
// 			}
// 			if(cptLeft == 1 && ligneImpairLeft == false){
// 				positionLeft = true;
// 			}

// 			if(positionLeft == false && ligneImpairLeft == false){
// 				firstPositionPairLeft = true;
// 			}


// 			poll.whoVotedLeft.push({id : poll.whoVotedWhat[who].id, firstPositionPair : firstPositionPairLeft, photo : "img/louis.png", ligneImpair: ligneImpairLeft, position : positionLeft, isClicked : false});
// 			cptLeft++;
// 			firstPositionPairLeft = false;
// 			if(positionLeft && cptLeft == 5){
// 				positionLeft = false;
// 			}

// 		}
// 		else if(poll.whoVotedWhat[who].choice == "right"){
// 			if(cptRight == 5 && ligneImpairRight == false){
// 				cptRight = 0;
// 				ligneImpairRight = true;
// 			}
// 			if(cptRight == 6 && ligneImpairRight == true){
// 				cptRight = 0;
// 				ligneImpairRight = false;
// 			}
// 			if(cptRight == 1 && ligneImpairRight == false){
// 				positionRight = true;
// 			}

// 			if(positionRight == false && ligneImpairRight == false){
// 				firstPositionPairRight = true;
// 			}

// 			poll.whoVotedRight.push({id : poll.whoVotedWhat[who].id, firstPositionPair : firstPositionPairRight, photo : "img/louis.png", ligneImpair : ligneImpairRight, position : positionRight, isClicked : false});
// 			cptRight++;
// 			firstPositionPairRight = false;
// 			if(positionRight && cptRight == 5){
// 				positionRight = false;
// 			}
// 		}
// 	}
// 	$scope.loadingVote = false;
// 	$scope.loadVote = false;
// 	async.series([function(callback){$scope.getPhotoForFriends(poll,callback)}, $scope.queriesParallelPhotoFriends], 
// 		function(err, result){
// 			$scope.queriesForPhotoFriendsLeft.splice(0, $scope.queriesForPhotoFriendsLeft.length);
// 			$scope.queriesForPhotoFriendsRight.splice(0, $scope.queriesForPhotoFriendsRight.length);
// 			console.log("finloading");
// 			$scope.$apply();
// 		});
// };


// $scope.votesTest = function(){
// 	console.log("debut")
// 	$scope.displaySectionComments = false;
// 	console.log("debut 1");
// 	$scope.displaySectionVotes = !$scope.displaySectionVotes;
// 	console.log("$scope.displaySectionVotes" + $scope.displaySectionVotes);

// 	if($scope.displaySectionVotes){
// 		$scope.displayPourcentageAndOpacity = false;
// 		console.log("falssssssssse");
// 	}
// 	else{
// 		$scope.displayPourcentageAndOpacity = true;
// 		console.log("true");
// 	}

/*
	// $scope.displayPourcentageFunction();

	// $scope.$apply();

	// $scope.queriesForPhotoFriendsLeft.splice(0, $scope.queriesForPhotoFriendsLeft.length);
	// $scope.queriesForPhotoFriendsRight.splice(0, $scope.queriesForPhotoFriendsRight.length);
	// if($scope.displaySectionVotes && $scope.pollToDisplay.whoVotedWhat.length && $scope.loadVote && !$scope.loadingVote){ 
	// 	console.log("Loading");
	// 	$scope.loadingVote = true;
	// 	$window.setTimeout(function() {
	// 		console.log("StartTimeOut");
	// 		$scope.displayVoteFriends($scope.pollToDisplay);
	// 	}, 3000);
	// }
	*/
//}; 	

});