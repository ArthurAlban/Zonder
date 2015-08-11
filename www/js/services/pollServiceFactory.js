zonder.factory('PollService', function($http, $q) {
    var factory = {
        createPoll: function(poll) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/poll/createPoll', {poll : poll})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getPollFromId: function(id) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/poll/getPollFromId', {id : id})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status); 
            });
            return deferred.promise;
        },
        getInfoPollsStatic: function(id) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/poll/getInfoPollsStatic', {id : id})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status); 
            });
            return deferred.promise;
        },
        getPollComment: function(id) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/poll/getPollComment', {id : id})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status); 
            });
            return deferred.promise;
        },
        getAllInfoPollsDynamic: function(id) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/poll/getAllInfoPollsDynamic', {id : id})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status); 
            });
            return deferred.promise;
        },
        getInfoPollsBasic: function(id) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/poll/getInfoPollsBasic', {id : id})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status); 
            });
            return deferred.promise;
        },
        sendComment: function(idPoll,author,comment) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/poll/sendComment', {idPoll : idPoll, comment : comment, author : author})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status); 
            });
            return deferred.promise;
        },
        getPollsVoted: function(index) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/poll/getPollsVoted', {index : index})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status); 
            });
            return deferred.promise;
        },
        getMyPolls: function(index) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/poll/getMyPolls', {index : index})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status); 
            });
            return deferred.promise;
        },
        deletePollInPollsVoted: function(id){
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/poll/deletePollInPollsVoted', {id : id})     
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status);
            });
            return deferred.promise;
        },
         getNextVotesLeft: function(index, id){
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/poll/getNextVotesLeft', {index : index, id : id})     
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status);
            });
            return deferred.promise;
        },
         getNextVotesRight: function(index, id){
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/poll/getNextVotesRight', {index : index, id : id})     
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status);
            });
            return deferred.promise;
        },
        voteAndUpdatePoll: function(idPoll, choice){
         var deferred = $q.defer();
         $http.post("http://90.11.6.61" + '/poll/voteAndUpdatePoll', {idPoll : idPoll, choice : choice})     
         .success(function(data){
            deferred.resolve(data);
        }).error(function(data, status){
            deferred.reject(status); 
        }); 
        return deferred.promise;
    },
    reportThisPoll: function(idPoll){
        var deferred = $q.defer();
        $http.post("http://90.11.6.61" + '/poll/reportThisPoll', {idPoll : idPoll})     
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