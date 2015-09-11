zonder.controller('pollsCtrl', function($scope, $ionicModal, $ionicSlideBoxDelegate, UserService, CommentService, PollService, $rootScope, $window, $ionicActionSheet, $cordovaStatusbar, $state, $ionicLoading){

	$scope.commentToDisplay = new Array();

	$scope.imgLeftInfoPollModal = new Array();
	$scope.imgRightInfoPollModal = new Array();

///////////////////////////////  slide 1 ///////////////////////////
$scope.openPollModal = function(poll) {
	$scope.loadingPollModal = $ionicLoading.show({
			template:'<ion-spinner class="spinnerLoading" icon="spiral"></ion-spinner>',
			animation: 'fade-in',
			showBackdrop: true
		});

	$ionicModal.fromTemplateUrl('modals/pollModal.html', {
		scope: $scope,
		animation: 'slide-in-right',
		backdropClickToClose: false
	}).then(function(modal) {
		$scope.pollModal = modal;
		$scope.openPollModalFunction(poll);
	});
};

$scope.openPollModalFunction = function(poll) {
	$scope.displaySectionComments = false;
	$scope.displaySectionVotes = false;
	$scope.loadWhoVotedWhatLeft = false;
	$scope.loadWhoVotedWhatRight = false;
	$scope.displayPourcentageAndOpacity = true;

	$scope.$apply();

	$scope.cptLeft = 0;
	$scope.nbLoadsLeft = 0;
	$scope.ligneImpairLeft = true;
	$scope.positionLeft = false;
	$scope.firstPositionPairLeft = false;

	$scope.cptRight = 0;
	$scope.nbLoadsRight = 0;
	$scope.ligneImpairRight = true;
	$scope.positionRight = false;
	$scope.firstPositionPairRight = false;

	$scope.displayInfiniteScrollVotedLeft = false;
	$scope.bufferVotedLeft = new Array();

	$scope.displayInfiniteScrollVotedRight = false;
	$scope.bufferVotedRight = new Array();

	// $scope.loadingVote = false;
	// $scope.loadVote = true;

	$scope.pollToDisplay = angular.copy(poll);

	$scope.imgLeftInfoPollModal = $scope.setPositionImageInCommentsAndPollModal($scope.pollToDisplay.imageWidthLeft, $scope.pollToDisplay.imageHeightLeft);
	$scope.imgRightInfoPollModal = $scope.setPositionImageInCommentsAndPollModal($scope.pollToDisplay.imageWidthRight, $scope.pollToDisplay.imageHeightRight);

	$scope.refreshPoll($scope.pollToDisplay);

	$scope.pollModal.show();

	// $scope.queriesForPhotoFriendsLeft.splice(0, $scope.queriesForPhotoFriendsLeft.length);
	// $scope.queriesForPhotoFriendsRight.splice(0, $scope.queriesForPhotoFriendsRight.length);
	// $scope.displayVoteFriends($scope.pollToDisplay);
	$cordovaStatusbar.hide();
	$scope.$apply();
};

$scope.closePollModal = function(){
    $scope.pollModal.remove();
    $scope.clearPollModal();
    console.log("remove poll modal");
};

$scope.clearPollModal = function() {
	$scope.cptLeft = 0;
	$scope.nbLoadsLeft = 0;
	$scope.ligneImpairLeft = true;
	$scope.positionLeft = false;
	$scope.firstPositionPairLeft = false;

	$scope.cptRight = 0;
	$scope.nbLoadsRight = 0;
	$scope.ligneImpairRight = true;
	$scope.positionRight = false;
	$scope.firstPositionPairRight = false;

	$scope.displayInfiniteScrollVotedLeft = false;
	$scope.displayInfiniteScrollVotedRight = false;

	$scope.displaySectionComments = false;
	$scope.displaySectionVotes = false;
	// $scope.loadingVote = false;
	// $scope.loadVote = true;

	$scope.displayPourcentageAndOpacity = true;

	$scope.pollToDisplay.writeComment = "";
	$scope.pollToDisplay = {};
	// $cordovaStatusbar.show();
};

$scope.$on('$destroy', function() {
	console.log("destroy");
	$scope.pollModal.remove();
});

$scope.$on('modal.hidden', function() {
	console.log("hidden poll modal");
});

$scope.$on('modal.removed', function() {
	console.log("remove poll modal");
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

	console.log("calculateTimePoll");
	callback();
};

$scope.getPollsInfos = function(poll, callback){
	PollService.getPollFromId(poll.id).then(function(d){
		poll.votes = d.votes;

		// poll.whoVotedWhat = d.whoVotedWhat;
		poll.whoVotedLeft = new Array();
		poll.whoVotedRight = new Array();
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
			window.setTimeout(function(){
				$scope.loadingPollModal.hide();
				$scope.$apply();
			}, 150);
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


$scope.displayComments = function(poll){
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
			var pollTmp = {};
			pollTmp.author = d.comment.author;
			pollTmp.comment = d.comment.comment;
			pollTmp.id = d.comment._id;
			pollTmp.photoAuthorComments = $window.localStorage['photo'];

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
	async.parallel([function(callback){$scope.getPhotoForFriendsLeft(poll, callback)}, function(callback){$scope.getPhotoForFriendsRight(poll, callback)}], function(err, res){
		callback();
	});
};

$scope.getPhotoForFriendsLeft = function(votedLeft, callback){
	console.log("getPhotoForFriendsLeft");
	angular.forEach(votedLeft, function(friend, key){
		var q = function(callback){
			UserService.getFriendPhotoFromId(friend.id).then(function(d){
				angular.forEach(votedLeft, function(f, k){
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

$scope.getPhotoForFriendsRight = function(votedRight, callback){
	angular.forEach(votedRight, function(friend, key){
		var q = function(callback){
			UserService.getFriendPhotoFromId(friend.id).then(function(d){
				angular.forEach(votedRight, function(f, k){
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
	console.log("execLEft");
	async.parallel($scope.queriesForPhotoFriendsLeft,function(err, res){
		console.log("fin execLEft");
		callback();
	});
};

$scope.queriesExecPhotoFriendsRight= function(callback){
	console.log("execRight");
	async.parallel($scope.queriesForPhotoFriendsRight,function(err, res){
		console.log("fin execRight");
		callback();
	});
};

// $scope.queriesParallelPhotoFriends = function(callback) {
// 	async.parallel([$scope.queriesExecPhotoFriendsLeft, $scope.queriesExecPhotoFriendsRight], function(err, res){
// 		callback();
// 	});
// };


$scope.positionWhoVotedLeft = function(votedLeft, callback){
	for(who in votedLeft){
		if($scope.cptLeft == 5 && $scope.ligneImpairLeft == false){
			$scope.cptLeft = 0;
			$scope.ligneImpairLeft = true;
		}
		if($scope.cptLeft == 6 && $scope.ligneImpairLeft == true){
			$scope.cptLeft = 0;
			$scope.ligneImpairLeft = false;
		}
		if($scope.cptLeft == 1 && $scope.ligneImpairLeft == false){
			$scope.positionLeft = true;
		}

		if($scope.positionLeft == false && $scope.ligneImpairLeft == false){
			$scope.firstPositionPairLeft = true;
		}

		$scope.bufferVotedLeft.push({id : votedLeft[who].id, firstPositionPair : $scope.firstPositionPairLeft, photo : "img/louis.png", ligneImpair: $scope.ligneImpairLeft, position : $scope.positionLeft, isClicked : false});
		$scope.cptLeft++;
		$scope.firstPositionPairLeft = false;
		if($scope.positionLeft && $scope.cptLeft == 5){
			$scope.positionLeft = false;
		}
	}
	callback();
};

$scope.loadWhoVotedLeft = function(callback){
	console.log("loads" + $scope.nbLoadsLeft);
	PollService.getNextVotesLeft($scope.nbLoadsLeft, $scope.pollToDisplay.id).then(function(data){
	console.log("data" + JSON.stringify(data));
		if(data.votesLeft != "allVotesLeftLoaded"){
			$scope.queriesForPhotoFriendsLeft.splice(0, $scope.queriesForPhotoFriendsLeft.length);
			async.series([function(callback){$scope.positionWhoVotedLeft(data.votesLeft, callback);}, 
				function(callback){$scope.getPhotoForFriendsLeft($scope.bufferVotedLeft, callback)},
				$scope.queriesExecPhotoFriendsLeft
				],
				function(err, res){
					angular.forEach($scope.bufferVotedLeft, function(p, k){
						$scope.pollToDisplay.whoVotedLeft.push(p);
					});
					
					$scope.bufferVotedLeft.splice(0, $scope.bufferVotedLeft.length);
					$scope.queriesForPhotoFriendsLeft.splice(0, $scope.queriesForPhotoFriendsLeft.length);
					console.log("fin load voted left");
					callback();
				});
		}
		else {
			console.log("lol allVotesLeftLoaded");
			$scope.displayInfiniteScrollVotedLeft = false;
			callback();
		}
	}, function(status){
		callback();
	});
};

$scope.getStatusForWhoVotedLeft = function(data){
	console.log("data.lengthGlobal" + data.lengthGlobal);
	console.log("$scope.pollToDisplay.whoVotedLeft.length" + $scope.pollToDisplay.whoVotedLeft.length);
	var modulo33 = $scope.pollToDisplay.whoVotedLeft.length % 33;
	if($scope.pollToDisplay.whoVotedLeft.length == 0 && data.lengthGlobal > 0){
		return true;
	}
	else if(data.lengthGlobal != $scope.pollToDisplay.whoVotedLeft.length){
		if(data.lengthGlobal < 34){
			return true;
		}
		else if(modulo33 != 0)
		{
			return true;
		}
		else{
			return false;
		}
	}
	else{
		return false;
	}
};

$scope.firstLoadWhoVotedLeft = function(callback){
	var nbLoadsLeft = 0;
	PollService.getNextVotesLeft(nbLoadsLeft, $scope.pollToDisplay.id).then(function(data){
		$scope.statVoted = $scope.getStatusForWhoVotedLeft(data);
		if($scope.statVoted){
			if(data.votesLeft != "allVotesLeftLoaded"){
				$scope.queriesForPhotoFriendsLeft.splice(0, $scope.queriesForPhotoFriendsLeft.length);
				async.series([function(callback){$scope.positionWhoVotedLeft(data.votesLeft, callback);}, 
					function(callback){$scope.getPhotoForFriendsLeft($scope.bufferVotedLeft, callback)},
					$scope.queriesExecPhotoFriendsLeft
					],
					function(err, res){
						console.log("fin load voted left");
						$scope.pollToDisplay.whoVotedLeft = angular.copy($scope.bufferVotedLeft);
						$scope.bufferVotedLeft.splice(0, $scope.bufferVotedLeft.length);
						$scope.queriesForPhotoFriendsLeft.splice(0, $scope.queriesForPhotoFriendsLeft.length);

						if($scope.pollToDisplay.whoVotedLeft.length > 32){
							console.log("yes");
							$scope.displayInfiniteScrollVotedLeft = true;
						}
						else{
							$scope.displayInfiniteScrollVotedLeft = false;
						}
						callback();
					});
			}
			else {
				console.log("lol allVotesLeftLoaded");
				$scope.displayInfiniteScrollVotedLeft = false;
				callback();
			}
		}
		else if(!$scope.statVoted){
			callback();
		}
	}, function(status){
		callback();
	});
};

$scope.retrieveWhoVotedLeft = function(loadMoreWhoVoted){
	if(loadMoreWhoVoted){
		if($scope.displayInfiniteScrollVotedLeft){
			$scope.nbLoadsLeft++;
			console.log("go retrieve voted left");
			async.series([$scope.loadWhoVotedLeft],
				function(err, res){
					console.log("fin fin fin fin who voted left load more");
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.$apply();
				});
		}
	}
	else{
		console.log("go retrieve voted left");
		async.series([$scope.firstLoadWhoVotedLeft],
			function(err, res){
				$scope.loadWhoVotedWhatLeft = false;
				$scope.$apply();
		});
	}
};

$scope.positionWhoVotedRight = function(votedRight, callback){
	for(who in votedRight){
		if($scope.cptRight == 5 && $scope.ligneImpairRight == false){
			$scope.cptRight = 0;
			$scope.ligneImpairRight = true;
		}
		if($scope.cptRight == 6 && $scope.ligneImpairRight == true){
			$scope.cptRight = 0;
			$scope.ligneImpairRight = false;
		}
		if($scope.cptRight == 1 && $scope.ligneImpairRight == false){
			$scope.positionRight = true;
		}

		if($scope.positionRight == false && $scope.ligneImpairRight == false){
			$scope.firstPositionPairRight = true;
		}

		$scope.bufferVotedRight.push({id :  votedRight[who].id, firstPositionPair : $scope.firstPositionPairRight, photo : "img/louis.png", ligneImpair: $scope.ligneImpairRight, position : $scope.positionRight, isClicked : false});
		$scope.cptRight++;
		$scope.firstPositionPairRight = false;
		if($scope.positionRight && $scope.cptRight == 5){
			$scope.positionRight = false;
		}
	}
	callback();
};

$scope.loadWhoVotedRight = function(callback){
	console.log("loads" + $scope.nbLoadsRight);
	PollService.getNextVotesRight($scope.nbLoadsRight, $scope.pollToDisplay.id).then(function(data){
	console.log("data" + JSON.stringify(data));
		if(data.votesRight != "allVotesRightLoaded"){
			$scope.queriesForPhotoFriendsRight.splice(0, $scope.queriesForPhotoFriendsRight.length);
			async.series([function(callback){$scope.positionWhoVotedRight(data.votesRight, callback);}, 
				function(callback){$scope.getPhotoForFriendsRight($scope.bufferVotedRight, callback)},
				$scope.queriesExecPhotoFriendsRight
				],
				function(err, res){
					angular.forEach($scope.bufferVotedRight, function(p, k){
						$scope.pollToDisplay.whoVotedRight.push(p);
					});
					
					$scope.bufferVotedRight.splice(0, $scope.bufferVotedRight.length);
					$scope.queriesForPhotoFriendsRight.splice(0, $scope.queriesForPhotoFriendsRight.length);
					console.log("fin load voted right");
					callback();
				});
		}
		else {
			console.log("lol allVotesRightLoaded");
			$scope.displayInfiniteScrollVotedRight = false;
			callback();
		}
	}, function(status){
		callback();
	});
};

$scope.getStatusForWhoVotedRight = function(data){
	var modulo33 = $scope.pollToDisplay.whoVotedRight.length % 33;
	if($scope.pollToDisplay.whoVotedRight.length == 0 && data.lengthGlobal > 0){
		return true;
	}
	else if(data.lengthGlobal != $scope.pollToDisplay.whoVotedRight.length){
		if(data.lengthGlobal < 34){
			return true;
		}
		else if(modulo33 != 0)
		{
			return true;
		}
		else{
			return false;
		}
	}
	else{
		return false;
	}
};

$scope.firstLoadWhoVotedRight = function(callback){
	var nbLoadsRight = 0;
	PollService.getNextVotesRight(nbLoadsRight, $scope.pollToDisplay.id).then(function(data){
		$scope.statVotedRight = $scope.getStatusForWhoVotedRight(data);
		if($scope.statVotedRight){
			console.log("load right");
			if(data.votesRight != "allVotesRightLoaded"){
				console.log("load 2 right");
				$scope.queriesForPhotoFriendsRight.splice(0, $scope.queriesForPhotoFriendsRight.length);
				async.series([function(callback){$scope.positionWhoVotedRight(data.votesRight, callback);}, 
					function(callback){$scope.getPhotoForFriendsRight($scope.bufferVotedRight, callback)},
					$scope.queriesExecPhotoFriendsRight
					],
					function(err, res){
						console.log("fin load voted right");
						console.log("bufferVotedRight" + JSON.stringify($scope.bufferVotedRight));
						$scope.pollToDisplay.whoVotedRight = angular.copy($scope.bufferVotedRight);
						$scope.bufferVotedRight.splice(0, $scope.bufferVotedRight.length);
						$scope.queriesForPhotoFriendsRight.splice(0, $scope.queriesForPhotoFriendsRight.length);

						if($scope.pollToDisplay.whoVotedRight.length > 32){
							console.log("yes");
							$scope.displayInfiniteScrollVotedRight = true;
						}
						else{
							$scope.displayInfiniteScrollVotedRight = false;
						}
						callback();
					});
			}
			else {
				console.log("lol allVotesRightLoaded");
				$scope.displayInfiniteScrollVotedRight = false;
				callback();
			}
		}
		else if(!$scope.statVotedRight){
			callback();
		}
	}, function(status){
		callback();
	});
};

$scope.retrieveWhoVotedRight = function(loadMoreWhoVoted, callback){
	if(loadMoreWhoVoted){
		if($scope.displayInfiniteScrollVotedRight){
			$scope.nbLoadsRight++;
			console.log("go retrieve voted Right");
			async.series([$scope.loadWhoVotedRight],
				function(err, res){
					console.log("fin fin fin fin who voted right load more");
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.$apply();
					callback();
				});
		}
	}
	else{
		console.log("go firstLoadWhoVotedRight");
		async.series([$scope.firstLoadWhoVotedRight],
			function(err, res){
				$scope.loadWhoVotedWhatRight = false;
				$scope.$apply();
				callback();
		});
	}
};

$scope.displayWhoVoted = function(){
	console.log("debut")
	$scope.displaySectionComments = false;
	$scope.displaySectionVotes = !$scope.displaySectionVotes;
	$scope.displayPourcentageFunction();
	// $scope.$apply();
	$scope.queriesForPhotoFriendsLeft.splice(0, $scope.queriesForPhotoFriendsLeft.length);
	// $scope.queriesForPhotoFriendsRight.splice(0, $scope.queriesForPhotoFriendsRight.length);
	if($scope.displaySectionVotes){ 
		$scope.loadWhoVotedWhatLeft = true;
		$scope.loadWhoVotedWhatRight = true;
		async.parallel([function(callback){$scope.retrieveWhoVotedLeft(false, callback);},
			function(callback){$scope.retrieveWhoVotedRight(false, callback);}
			],
			function(err, res){
		});
	}
};


});