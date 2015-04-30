zonder.controller('homeCtrl', function($scope, $state, $window, $ionicSlideBoxDelegate, $rootScope,$ionicSideMenuDelegate, PollService) {

	$scope.sliderVote = true;
	$scope.sliderPolls = false;
	$scope.sliderFriends = false;

	$scope.divOpacity = false;

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
	}
};



//////////////////////// Loading Poll  /////////////////////////
$scope.bufferPolls = new Array();
$scope.nbLoads = 0;
$scope.displayPolls = new Array();
$scope.displayInfiniteScroll = false;


$scope.firstBufferPolls = function(isLoadMorePoll, callback){
	console.log("2");

	if(!$scope.displayPolls.length){
		console.log("3");

		$scope.displayPolls = $rootScope.pollsVoted;
		console.log("displayPolls" + JSON.stringify($scope.displayPolls));
		callback();
	}
	else{
		callback();
	}
};


$scope.stat = true;

$scope.getStatusForPoll = function(data){

	if(data.lengthGlobal != $rootScope.lengthTab){
		console.log("length diff");
		return true;
	}
	else{
		for(var i = 0; i < data.poll.length; i++){
			console.log("test diff tab");
			if(data.poll[i].id != $rootScope.pollsVoted[i].id){
				console.log("test diff tab1");
				return true;
			}
		}
		console.log("test diff tab2");
		return false;
	}
};

$scope.getUserAndPhotosInfos = function(pollArray, callback){
	console.log("1");
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
						// $scope.$apply();
						console.log("beforeForEach");
						angular.forEach($scope.bufferPolls, function(p, k){
							$scope.displayPolls.push(p);
						});
						$scope.bufferPolls.splice(0, $scope.bufferPolls.length);
						console.log("finverifiyChangeAndUpdate");
						callback();
					});
		}
		else {
				console.log("displayInfiniteScroll");
				$scope.displayInfiniteScroll = false;
				callback();
			}

		}, function(status){
			callback();
		});
};


/// comparer id toppolls et id data && vérifier meme taille si pareil alors 304 si un différent alors 200
$scope.verifiyChangeAndUpdateFirstTime = function(isLoadMorePoll, callback){
	console.log("4");

	PollService.getPollsVoted(0).then(function(data){
		console.log("lengthGlobal" + data.lengthGlobal);
		$scope.stat = $scope.getStatusForPoll(data);
		console.log("status" + $scope.stat);
		if($scope.stat){
			console.log("5");
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
						// $scope.$apply();
						$scope.displayPolls = angular.copy($scope.bufferPolls);
						$scope.bufferPolls.splice(0, $scope.bufferPolls.length);
						callback();
					});
			}
			else {
				console.log("displayInfiniteScroll");
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
	console.log("loadPollsCtrl");
	if(isLoadMorePoll){
		console.log("isLoadMorePoll");
		$scope.nbLoads++;
		async.series([$scope.verifiyChangeAndUpdate],
			function(err, res){
				$scope.queriesForPollsInfos.splice(0, $scope.queriesForPollsInfos.length);
				$scope.queriesForInfoPhoto.splice(0, $scope.queriesForInfoPhoto.length);
				$scope.queriesForUserPhoto.splice(0, $scope.queriesForUserPhoto.length);
				$scope.queriesForUserInfo.splice(0, $scope.queriesForUserInfo.length);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.$apply();
			console.log("fininfinitescroll");
		});
	}
	else{
		console.log("1");
		async.series([
			function(callback){$scope.firstBufferPolls(isLoadMorePoll, callback);}, 
			function(callback){$scope.verifiyChangeAndUpdateFirstTime(isLoadMorePoll, callback);}], 
			function(err, res){
				$scope.queriesForPollsInfos.splice(0, $scope.queriesForPollsInfos.length);
				$scope.queriesForInfoPhoto.splice(0, $scope.queriesForInfoPhoto.length);
				$scope.queriesForUserPhoto.splice(0, $scope.queriesForUserPhoto.length);
				$scope.queriesForUserInfo.splice(0, $scope.queriesForUserInfo.length);
			if($scope.displayPolls.length > 4){
				$scope.displayInfiniteScroll = true;
			}
			$scope.$apply();
			console.log("fin3");
		});
	}
};


$scope.fillQueuesBasicAndInfoForRefresh = function(pollArray, callback){
	async.parallel([function(callback){$scope.getInfoPollsBasic(pollArray, callback);}, 
		function(callback){$scope.getInfoPhoto(pollArray, callback);}], 
		function(err, res){
			callback();
		});
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
			console.log("Fin refresh");
		});
};

});