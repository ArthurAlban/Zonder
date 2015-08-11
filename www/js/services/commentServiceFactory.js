zonder.factory('CommentService', function($http, $q) {
	var factory = {
		getCommentsInfoById: function(id){
			var deferred = $q.defer();
			$http.post("http://90.11.6.61" + '/comment/getCommentsInfoById', {id : id})     
			.success(function(data){
				deferred.resolve(data);
			}).error(function(data, status){
				deferred.reject(status);
			});
			return deferred.promise;
		}
	};

	return factory;
});