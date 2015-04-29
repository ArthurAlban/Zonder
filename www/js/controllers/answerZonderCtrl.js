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
	$scope.pollsToBeLoaded.push({id : "553f64424c67405c1f000005"});
	$scope.pollsToBeLoaded.push({id : "553f66364c67405c1f000006"});
	callback();
};

$scope.getInfosUsers = function(pollArray, callback){
	async.parallel([function(callback){$scope.getUsersInfos($scope.pollsToBeLoaded, callback)}, function(callback){$scope.getUsersPhoto($scope.pollsToBeLoaded, callback)}], function(err, res){
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

$scope.queriesExecPollsInfosAnswerZonder = function(callback){
  async.parallel($scope.queriesForPollsInfosAnswerZonder,function(err, res){
    callback();
  });
};

$scope.queriesParallelRequestInfoPollAnswerZonder = function(callback){
  async.parallel([$scope.queriesExecPollsInfosAnswerZonder], function(err, res){
    console.log("fin info poll");
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
    console.log("fin photoInfo");
    callback();
  });
};

$scope.queriesExecUsersInfos = function(callback){
  async.parallel($scope.queriesForUserInfo,function(err, res){
    console.log("fin users info");
    callback();
  });
};

$scope.queriesParallelInfosUsers = function(callback) {
	async.parallel([$scope.queriesExecUsersInfos, $scope.queriesExecUsersPhoto], function(err, res){
		callback();
	});
};

$scope.updateInformationsPolls = function(callback){
	async.series([$scope.getPollsToBeLoaded, function(callback){$scope.getPollsInfosAnswerZonder($scope.pollsToBeLoaded, callback)}, $scope.queriesParallelRequestInfoPollAnswerZonder, function(callback){$scope.getInfosUsers($scope.pollsToBeLoaded, callback)}, $scope.queriesParallelInfosUsers], 
		function(err, result){
			angular.forEach($scope.pollsToBeLoaded, function(poll, key){
				$scope.pollsLoaded.push(poll);
			});
			$scope.pollsToBeLoaded.splice(0,$scope.pollsToBeLoaded.length);
			$scope.queriesForUserInfo.splice(0,$scope.queriesForUserInfo.length);
			$scope.queriesForUserPhoto.splice(0,$scope.queriesForUserPhoto.length);
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
	callback();
};

$scope.getNextPollDown = function(callback){
	$scope.pollDown = $scope.pollsLoaded.shift();
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


});