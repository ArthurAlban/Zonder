zonder.controller('homeCtrl', function($scope, $state, $window, $ionicActionSheet, $ionicSlideBoxDelegate, $rootScope,$ionicSideMenuDelegate,UserService, PollService) {

	$scope.sliderVote = true;
	$scope.sliderPolls = false;
	$scope.sliderFriends = false;

	$scope.divOpacity = false;

	$scope.$on('reloadFriends', function (event) {
		$scope.loadFriendsCtrl(false);
	});

// si on trouve un moment de mettre les valeurs dans la directive
$scope.$watch(function () {
	return $ionicSideMenuDelegate.getOpenRatio();
},
function (ratio) {
	if(ratio == 0){
		$scope.divOpacity = false;
	}
	else{
		$scope.divOpacity = true;
	}
});

$scope.goToSlide = function(index){
	$ionicSlideBoxDelegate.$getByHandle('homeSlider').slide(index);
};

$scope.slideHasChangedInHomeSlider = function(index) {
	if(index == 0){
		$scope.sliderVote = true;
		$scope.sliderPolls = false;
		$scope.sliderFriends = false;
	}
	if(index == 1){
		$scope.sliderVote = false;
		$scope.sliderPolls = true;
		$scope.sliderFriends = false;
		$scope.loadPollsCtrl(false);
	}
	if(index == 2){
		$scope.sliderVote = false;
		$scope.sliderPolls = false;
		$scope.sliderFriends = true;
		$scope.loadFriendsCtrl(false);
	}
};



//////////////////////// Loading Poll  /////////////////////////
$scope.bufferPolls = new Array();
$scope.nbLoads = 0;
$scope.displayPolls = new Array();
$scope.displayInfiniteScroll = false;


$scope.firstBufferPolls = function(callback){
	if(!$scope.displayPolls.length){
		$scope.displayPolls = $rootScope.pollsVoted;
		callback();
	}
	else{
		callback();
	}
};


$scope.stat = true;

$scope.getStatusForPoll = function(data){

	if(data.lengthGlobal != $rootScope.lengthTab){
		return true;
	}
	else{
		for(var i = 0; i < data.poll.length; i++){
			if(data.poll[i].id != $scope.displayPolls[i].id){
				return true;
			}
		}
		return false;
	}
};

$scope.getUserAndPhotosInfos = function(pollArray, callback){
	async.parallel([function(callback){$scope.getUsersInfos(pollArray, callback)},
		function(callback){$scope.getUsersPhoto(pollArray, callback)}], 
		function(err, res){
			callback();
		});
};

/// comparer id toppolls et id data && vérifier meme taille si pareil alors 304 si un différent alors 200
$scope.verifiyChangeAndUpdate = function(callback){
	PollService.getPollsVoted($scope.nbLoads).then(function(data){
		if(data.poll != "allPollsLoaded"){
			$scope.bufferPolls = data.poll;
			$scope.queriesForPollsInfos.splice(0, $scope.queriesForPollsInfos.length);
			$scope.queriesForInfoPhoto.splice(0, $scope.queriesForInfoPhoto.length);
			$scope.queriesForUserPhoto.splice(0, $scope.queriesForUserPhoto.length);
			$scope.queriesForUserInfo.splice(0, $scope.queriesForUserInfo.length);
			async.series([function(callback){$scope.getPollsInfos($scope.bufferPolls, callback);}, 
				$scope.queriesExecPollsInfos,
				function(callback){$scope.getInfoPhoto($scope.bufferPolls, callback);},
				$scope.queriesExecInfoPhoto,
				function(callback){$scope.getUserAndPhotosInfos($scope.bufferPolls, callback);},
				$scope.queriesExecUsersInfos,
				$scope.queriesExecUsersPhoto
				],
				function(err, res){
					angular.forEach($scope.bufferPolls, function(p, k){
						$scope.displayPolls.push(p);
					});
					$scope.bufferPolls.splice(0, $scope.bufferPolls.length);
					callback();
				});
		}
		else {
			$scope.displayInfiniteScroll = false;
			callback();
		}

	}, function(status){
		callback();
	});
};


/// comparer id toppolls et id data && vérifier meme taille si pareil alors 304 si un différent alors 200
$scope.verifiyChangeAndUpdateFirstTime = function(callback){
	PollService.getPollsVoted(0).then(function(data){
		$scope.stat = $scope.getStatusForPoll(data);
		if($scope.stat){
			if(data.poll != "allPollsLoaded"){
				$scope.nbLoads = 0;
				$rootScope.lengthTab = data.lengthGlobal;
				$scope.bufferPolls = data.poll;
				$scope.queriesForPollsInfos.splice(0, $scope.queriesForPollsInfos.length);
				$scope.queriesForInfoPhoto.splice(0, $scope.queriesForInfoPhoto.length);
				$scope.queriesForUserPhoto.splice(0, $scope.queriesForUserPhoto.length);
				$scope.queriesForUserInfo.splice(0, $scope.queriesForUserInfo.length);
				async.series([function(callback){$scope.getPollsInfos($scope.bufferPolls, callback);}, 
					$scope.queriesExecPollsInfos,
					function(callback){$scope.getInfoPhoto($scope.bufferPolls, callback);},
					$scope.queriesExecInfoPhoto,
					function(callback){$scope.getUserAndPhotosInfos($scope.bufferPolls, callback);},
					$scope.queriesExecUsersInfos,
					$scope.queriesExecUsersPhoto
					],
					function(err, res){
						$scope.displayPolls = angular.copy($scope.bufferPolls);
						$scope.bufferPolls.splice(0, $scope.bufferPolls.length);
						callback();
					});
			}
			else {
				$scope.displayInfiniteScroll = false;
				callback();
			}
		}
		else if(!$scope.stat){
			callback();
		}
	}, function(status){
		callback();
	});
};


$scope.loadPollsCtrl = function(isLoadMorePoll){
	if(isLoadMorePoll){
		$scope.nbLoads++;
		async.series([$scope.verifiyChangeAndUpdate],
			function(err, res){
				$scope.queriesForPollsInfos.splice(0, $scope.queriesForPollsInfos.length);
				$scope.queriesForInfoPhoto.splice(0, $scope.queriesForInfoPhoto.length);
				$scope.queriesForUserPhoto.splice(0, $scope.queriesForUserPhoto.length);
				$scope.queriesForUserInfo.splice(0, $scope.queriesForUserInfo.length);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$apply();
			});
	}
	else{
		async.series([
			$scope.firstBufferPolls, 
			$scope.verifiyChangeAndUpdateFirstTime], 
			function(err, res){
				$scope.queriesForPollsInfos.splice(0, $scope.queriesForPollsInfos.length);
				$scope.queriesForInfoPhoto.splice(0, $scope.queriesForInfoPhoto.length);
				$scope.queriesForUserPhoto.splice(0, $scope.queriesForUserPhoto.length);
				$scope.queriesForUserInfo.splice(0, $scope.queriesForUserInfo.length);
				if($scope.displayPolls.length > 4){
					$scope.displayInfiniteScroll = true;
				}
				$scope.$apply();
			});
	}
};


$scope.pullToRefresh = function(){
	$scope.queriesForPollsInfos.splice(0, $scope.queriesForPollsInfos.length);
	$scope.queriesForInfoPhoto.splice(0, $scope.queriesForInfoPhoto.length);
	$scope.queriesForUserPhoto.splice(0, $scope.queriesForUserPhoto.length);
	$scope.queriesForUserInfo.splice(0, $scope.queriesForUserInfo.length);
	async.series([function(callback){$scope.getPollsInfos($scope.displayPolls, callback);}, 
		$scope.queriesExecPollsInfos,
		],
		function(err, res){
			$scope.queriesForPollsInfos.splice(0, $scope.queriesForPollsInfos.length);
			$scope.queriesForInfoPhoto.splice(0, $scope.queriesForInfoPhoto.length);
			$scope.queriesForUserPhoto.splice(0, $scope.queriesForUserPhoto.length);
			$scope.queriesForUserInfo.splice(0, $scope.queriesForUserInfo.length);
			$scope.$broadcast('scroll.refreshComplete');
		});
};

///////////////////// Loading Friends /////////////////////////


$scope.displayFriends = new Array();
// $scope.displayAddFriends = new Array();
$scope.displayRequestFriends = new Array();

$scope.friendStatus = true;
// $scope.addFriendStatus = true;
$scope.requestFriendStatus = true;

$scope.nbLoadsFriends = 0;

$scope.bufferFriends = new Array();
// $scope.bufferAddFriends = new Array();
$scope.bufferRequestFriends = new Array();

$scope.confirmFriend = false;

$scope.displayInfiniteScrollForFriends = false;


$scope.firstBufferFriends = function(isLoadMoreFriends, callback){
	if(!$scope.displayFriends.length && !$scope.displayRequestFriends.length){
		console.log("2 inside");
		$scope.displayFriends = $rootScope.friends;
		// $scope.displayAddFriends = $rootScope.addFriends;
		$scope.displayRequestFriends = $rootScope.requestFriends;
		// console.log("friends2" + JSON.stringify($scope.displayFriends));
      	// console.log("addFriends2" + JSON.stringify($scope.displayAddFriends));
      	// console.log("requestFriends2" + JSON.stringify($scope.displayRequestFriends));
      	callback();
      }
      else{
      	console.log("2 outside");
      	callback();
      }
  };

  $scope.getStatusForFriends = function(data){
  	console.log("8");

  	if($rootScope.friendsHaveChanged){
  		return true;
  	}

	var lengthToString = $scope.displayFriends.length.toString();
	var nbLoadsMax = $scope.displayFriends.length / 10;

	console.log("$scope.confirmFriend" + $scope.confirmFriend);

  	if($scope.confirmFriend){
  		console.log("confirmFriend" + $scope.confirmFriend);
  		if(lengthToString.slice(-1) != "0"){
  			return true;
  		}
  		else if($scope.nbLoadsFriends == nbLoadsMax) {
  			console.log("$scope.nbLoadsFriends" + $scope.nbLoadsFriends);
  			$scope.nbLoadsFriends--;
  		}
  	}

  	if(!$scope.confirmFriend){
  		if(lengthToString.slice(-1) != "0"){
  			if(data.lengthGlobal != $scope.displayFriends.length){
  				return true;
  			}
  		}
  	}
  	

	console.log("9 outside");
	return false;
};


// $scope.getStatusForAddFriends = function(data){
// 	if(data.lengthGlobal != $rootScope.addFriends.length){
// 		return true;
// 	}
// 	else{
// 		for(var i = 0; i < data.addFriends.length; i++){
// 			if(data.addFriends[i].id != $rootScope.addFriends[i].id){
// 				return true;
// 			}
// 		}
// 		return false;
// 	}
// };


$scope.getStatusForRequestFriends = function(data){
	console.log("data" + JSON.stringify(data));
	console.log("4");


	if(data.requestFriends.length != $scope.displayRequestFriends.length){
		console.log(" 5 change tab request friends1");
		return true;
	}
	else{
		for(var i = 0; i < data.requestFriends.length; i++){
			if(data.requestFriends[i].id != $scope.displayRequestFriends[i].id){
				console.log(" 5 change tab request friends2");
				return true;
			}
		}
		console.log("5");
		return false;
	}
};


// /// comparer id toppolls et id data && vérifier meme taille si pareil alors 304 si un différent alors 200
$scope.loadMoreFriends = function(callback){
	console.log("je fais un load more friends");
	console.log("$scope.nbLoadsFriends" + $scope.nbLoadsFriends);
	UserService.getFriends($scope.nbLoadsFriends).then(function(data){
		console.log("data" +  JSON.stringify(data));
		if(data.friend != "allFriendsLoaded"){
			console.log("je charge");
			$scope.bufferFriends = data.friend;
			$scope.queriesForRequestFriendInfo.splice(0, $scope.queriesForRequestFriendInfo.length);
			$scope.queriesForRequestFriendPhoto.splice(0, $scope.queriesForRequestFriendPhoto.length);
			async.series([function(callback){$scope.fillQueriesAllFriends($scope.bufferFriends, callback);}],
				function(err, res){
					console.log("bufferFriends" + $scope.bufferFriends);
					angular.forEach($scope.bufferFriends, function(p, k){
						$scope.displayFriends.push(p);
					});
					$scope.bufferFriends.splice(0, $scope.bufferFriends.length);
					$scope.queriesForRequestFriendInfo.splice(0, $scope.queriesForRequestFriendInfo.length);
					$scope.queriesForRequestFriendPhoto.splice(0, $scope.queriesForRequestFriendPhoto.length);
					console.log("displayFriends" + $scope.displayFriends);
					callback();
				});
		}
		else {
			$scope.displayInfiniteScrollForFriends = false;
			callback();
		}

	}, function(status){
		callback();
	});
};

$scope.fillQueriesAllFriends = function(pollArray, callback){
	async.series([function(callback){$scope.getPseudoPhotoFriends(pollArray, callback);},
		$scope.queriesParallelRequest],
		function(err, result){
			$scope.queriesForRequestFriendInfo.splice(0, $scope.queriesForRequestFriendInfo.length);
			$scope.queriesForRequestFriendPhoto.splice(0, $scope.queriesForRequestFriendPhoto.length);
			callback();
		});
};


/// comparer id toppolls et id data && vérifier meme taille si pareil alors 304 si un différent alors 200
$scope.checkAndLoadFriends = function(callback){
	console.log("7");
	UserService.getFriends(0).then(function(data){
		$scope.friendStatus = $scope.getStatusForFriends(data);
		console.log("status" + $scope.friendStatus);
		if($scope.friendStatus){
			console.log("10 inside");
			if(data.friend != "allFriendsLoaded"){
				$scope.nbLoadsFriends = 0;
				$scope.bufferFriends = data.friend;
				$scope.queriesForRequestFriendInfo.splice(0, $scope.queriesForRequestFriendInfo.length);
				$scope.queriesForRequestFriendPhoto.splice(0, $scope.queriesForRequestFriendPhoto.length);
				async.series([function(callback){$scope.fillQueriesAllFriends($scope.bufferFriends, callback);}],
					function(err, res){
						$scope.displayFriends = angular.copy($scope.bufferFriends);
						console.log("friends3" + JSON.stringify($scope.displayFriends));
						$scope.queriesForRequestFriendInfo.splice(0, $scope.queriesForRequestFriendInfo.length);
						$scope.queriesForRequestFriendPhoto.splice(0, $scope.queriesForRequestFriendPhoto.length);
						$scope.bufferFriends.splice(0, $scope.bufferFriends.length);
						console.log("ça va looooooooooooo");
						callback();
					});
			}
			else {
				$scope.displayInfiniteScrollForFriends = false;
				callback();
			}
		}
		else if(!$scope.friendStatus){
			console.log("10 outside");
			callback();
		}
	}, function(status){
		callback();
	});
};

/// comparer id toppolls et id data && vérifier meme taille si pareil alors 304 si un différent alors 200
// $scope.checkAndLoadAddFriends = function(callback){
// 	UserService.getAddFriends().then(function(data){
// 		$scope.addFriendStatus = $scope.getStatusForAddFriends(data);
// 		if($scope.addFriendStatus){
// 			$scope.bufferAddFriends = data.addFriends;
// 			$scope.queriesForRequestFriendInfo.splice(0, $scope.queriesForRequestFriendInfo.length);
// 			$scope.queriesForRequestFriendPhoto.splice(0, $scope.queriesForRequestFriendPhoto.length);
// 			async.series([function(callback){$scope.fillQueriesAllFriends($scope.bufferAddFriends, callback);}],
// 				function(err, res){
// 					$scope.displayAddFriends = angular.copy($scope.bufferAddFriends);
// 					$scope.queriesForRequestFriendInfo.splice(0, $scope.queriesForRequestFriendInfo.length);
// 					$scope.queriesForRequestFriendPhoto.splice(0, $scope.queriesForRequestFriendPhoto.length);
// 					$scope.bufferAddFriends.splice(0, $scope.bufferAddFriends.length);
// 					callback();
// 				});
// 		}
// 		else if(!$scope.addFriendStatus){
// 			callback();
// 		}
// 	}, function(status){
// 		callback();
// 	});
// };

/// comparer id toppolls et id data && vérifier meme taille si pareil alors 304 si un différent alors 200
$scope.checkAndLoadRequestFriends = function(callback){
	UserService.getRequestFriends().then(function(data){
		console.log("3");
		$scope.requestFriendStatus = $scope.getStatusForRequestFriends(data);
		if($scope.requestFriendStatus){
			console.log("6 inside");
			$scope.bufferRequestFriends = data.requestFriends;
			$scope.queriesForRequestFriendInfo.splice(0, $scope.queriesForRequestFriendInfo.length);
			$scope.queriesForRequestFriendPhoto.splice(0, $scope.queriesForRequestFriendPhoto.length);
			async.series([function(callback){$scope.fillQueriesAllFriends($scope.bufferRequestFriends, callback);}],
				function(err, res){
					$scope.displayRequestFriends = angular.copy($scope.bufferRequestFriends);
					$scope.queriesForRequestFriendInfo.splice(0, $scope.queriesForRequestFriendInfo.length);
					$scope.queriesForRequestFriendPhoto.splice(0, $scope.queriesForRequestFriendPhoto.length);
					$scope.bufferRequestFriends.splice(0, $scope.bufferRequestFriends.length);
					console.log("ça va laaaaaaaaaa");
					callback();
				});
		}
		else if(!$scope.requestFriendStatus){
			console.log("6 outside");
			callback();
		}
	}, function(status){
		callback();
	});
};

$scope.loadFriendsCtrl = function(isLoadMoreFriends){

	if(isLoadMoreFriends){
		console.log("2");
		$scope.nbLoadsFriends++;
		console.log("je commence le load");
		async.series([$scope.loadMoreFriends],
			function(err, res){
				$scope.queriesForRequestFriendInfo.splice(0, $scope.queriesForRequestFriendInfo.length);
				$scope.queriesForRequestFriendPhoto.splice(0, $scope.queriesForRequestFriendPhoto.length);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				console.log("load fini");
				$scope.$apply();
			});
	}
	else{
		console.log("1");
		async.series([
			function(callback){$scope.firstBufferFriends(isLoadMoreFriends, callback);},
			$scope.checkAndLoadRequestFriends,
		// $scope.checkAndLoadAddFriends,
		$scope.checkAndLoadFriends
		], 
		function(err, res){
			console.log("11");
			$scope.queriesForRequestFriendInfo.splice(0, $scope.queriesForRequestFriendInfo.length);
			$scope.queriesForRequestFriendPhoto.splice(0, $scope.queriesForRequestFriendPhoto.length);
			if($scope.displayFriends.length > 9){
				$scope.displayInfiniteScrollForFriends = true;
			}
			$rootScope.friendsHaveChanged = false;
			$scope.confirmFriend = false;
			console.log("finFFFFFFRIIIIENNNDSS");
			$scope.$apply();
		});
	}
};

// $scope.$watch($rootScope.friendsHaveChanged, $scope.loadFriendsCtrl(false));

$scope.showActionSheetRequestFriends = function(id) {

	$ionicActionSheet.show({
		buttons: [
		{ text: 'Confirm <i class="icon ion-checkmark-circled"></i>' },
		{ text: 'Refuse <i class="icon ion-close-circled"></i>' },

		],
		cancelText: 'Cancel',
		cancel: function() {
		},
		buttonClicked: function(index) {
			if(index == 0){
				$scope.confirmationFriend(id);
			}
			if(index == 1){
				$scope.refuseFriend(id);
			}
			return true;
		}
	});
};

$scope.showActionSheetFriends = function(id) {

	$ionicActionSheet.show({
		buttons: [
		{ text: 'Delete <i class="icon ion-close-circled"></i>' },
		],
		cancelText: 'Cancel',
		cancel: function() {
		},
		buttonClicked: function(index) {
			if(index == 0){
				$scope.deleteFriend(id);
			}
			return true;
		}
	});
};

$scope.confirmationFriend = function(id) {
	UserService.confirmationFriend(id).then(function(data){
		console.log("confirm");
		$scope.deleteRequestFriendInRequestFriendInApp(id);
		console.log("confirm2");
		$scope.confirmFriend = true;
		console.log("$scope.confirmFriend" + $scope.confirmFriend);
		$scope.loadFriendsCtrl(false);
		$scope.$apply();
	},function(status){
		console.log("Impossible d'accepter la demande d'amis de l'utilisateur");
	});
};

$scope.deleteRequestFriendInRequestFriendInApp = function(id){
	var cpt = 0;
	var ind = "";
	angular.forEach($scope.displayRequestFriends, function(fFriend, key){
		if(id == fFriend.id){
			ind = cpt;
		}
		cpt++;
	});
	$scope.displayRequestFriends.splice(ind, 1);
};

$scope.refuseFriend = function(id){
	UserService.refuseFriend(id).then(function(data){
		$scope.deleteRequestFriendInRequestFriendInApp(id);
		$scope.$apply();
	},function(status){
		console.log("Impossible de refuser la demande d'amis de l'utilsiateur");
	});
};

$scope.deleteFriend = function(id){
	UserService.deleteFriend(id).then(function(data){
		var ind = "";
		for(var i=0; i < $scope.displayFriends.length ; i++){
			if($scope.displayFriends[i].id == id ) {
				ind = i;
			}
		}
		$scope.displayFriends.splice(ind, 1);
		// $scope.$apply();
	},function(status){
		console.log("Impossible de supprimer l'utilisateur");
	});
};


});