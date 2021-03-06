zonder.factory('UserService', function($http, $q) {
    var factory = {
        logIn: function(mail, pass) {
            console.log("login");
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/login', {email : mail, password : pass})
            .success(function(data){
                console.log("login OK "+ data);
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status);
                console.log("login PASOK status"+ status);
                console.log("login PASOK "+ data);
            });
            return deferred.promise;
        },
        getUserInfoForLocalStorage: function() {
            var deferred = $q.defer();
            $http.get("http://90.11.6.61" + '/user/getUserInfoForLocalStorage')
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status);
            });
            return deferred.promise;
        },
        signUp: function(userInfo) {
            var deferred = $q.defer();
            console.log("user" + JSON.stringify(userInfo));
            console.log("user" + userInfo);
            $http.post("http://90.11.6.61" + '/user/signup', {user : userInfo})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status);
         });
            return deferred.promise;
        },
        registerDevice: function(device){
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/registerDevice', {device : device})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status);
            });
            return deferred.promise;
        },
        logOut: function() {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/logout')
            .success(function(data){
                deferred.resolve();
            }).error(function(data, status){
             deferred.reject(status);
         });
            return deferred.promise;
        },
        getUsers: function(data) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/getUsers', {search : data})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status); 
            });
            return deferred.promise;
        },
        addFriend: function(id) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/addFriend', {id : id})
            .success(function(data){
                console.log("AddfriendData  " +  data);
                deferred.resolve(data);
            }).error(function(data, status){
                console.log("AddfriendDataReject  " +  data);
                console.log("Addfriendstatusreject  " +  status);
                deferred.reject(status); 
            });
            return deferred.promise;
        },
        confirmationFriend: function(id) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/confirmationFriend', {id : id})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status);
         });
            return deferred.promise;
        },
        deleteFriend: function(id) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/deleteFriend', {id : id})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status);
         });
            return deferred.promise;
        },
        deleteFriendToDelete: function(id) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/deleteFriendToDelete', {id : id})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status);
         });
            return deferred.promise;
        },
        getFriendsToDelete: function() {
            var deferred = $q.defer();
            $http.get("http://90.11.6.61" + '/user/getFriendsToDelete')
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status);
         });
            return deferred.promise;
        },
        refuseFriend: function(id) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/refuseFriend', {id : id})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status);
         });
            return deferred.promise;
        },
        getFriendInfoFromId: function(id) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/getFriendInfoFromId', {id : id})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status); 
         });
            return deferred.promise;
        },
        getFriendPhotoFromId: function(id) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/getFriendPhotoFromId', {id : id})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status);
         });
            return deferred.promise;
        },
        newPassword: function(oldPassword, newPassword, repeatPassword) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/newPassword', {oldPassword : oldPassword, newPassword : newPassword, repeatPassword : repeatPassword})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status); 
         });
            return deferred.promise;
        },
        notificationFriends: function(bool) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/notificationFriends', {acceptNotificationFriends : bool})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status); 
         });
            return deferred.promise;
        },
        notificationPolls: function(bool) {
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/notificationPolls', {acceptNotificationPolls : bool})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status);
         });
            return deferred.promise;
        },
        getFriends: function(index){
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/getFriends', {index : index})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status); 
         });
            return deferred.promise;
        },
        getAllFriends: function(){
            var deferred = $q.defer();
            $http.get("http://90.11.6.61" + '/user/getAllFriends')
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status); 
         });
            return deferred.promise;
        },
        getRequestFriends: function(){
            var deferred = $q.defer();
            $http.get("http://90.11.6.61" + '/user/getRequestFriends')
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status); 
         });
            return deferred.promise;
        },
        getAddFriends: function(){
            var deferred = $q.defer();
            $http.get("http://90.11.6.61" + '/user/getAddFriends')
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status); 
         });
            return deferred.promise;
        },
        setPhotoUser: function(photo){
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/setPhotoUser', {photo: photo})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status); 
         });
            return deferred.promise;
        },
        getNotificationFriends: function(){
            var deferred = $q.defer();
            $http.get("http://90.11.6.61" + '/user/getNotificationFriends')
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status); 
         });
            return deferred.promise;
        },
        getNotificationPolls: function(){
            var deferred = $q.defer();
            $http.get("http://90.11.6.61" + '/user/getNotificationPolls')
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status); 
         });
            return deferred.promise;
        },
        checkEmail: function(email){
            var deferred = $q.defer();
            $http.post("http://90.11.6.61" + '/user/checkEmail', {email : email})
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getMyId: function(){
            var deferred = $q.defer();
            $http.get("http://90.11.6.61" + '/user/getMyId')
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
             deferred.reject(status); 
         });
            return deferred.promise;
        },
        // getJetons: function(){
        //     var deferred = $q.defer();
        //     $http.get("http://90.11.6.61" + '/user/getJetons')
        //     .success(function(data){
        //         deferred.resolve(data);
        //     }).error(function(data, status){
        //         deferred.reject(status); 
        //     });
        //     return deferred.promise;
        // },
        // changeJetons: function(jetons){
        //     var deferred = $q.defer();
        //     $http.post("http://90.11.6.61" + '/user/changeJetons', {jetons : jetons})
        //     .success(function(data){
        //         deferred.resolve(data);
        //     }).error(function(data, status){
        //      deferred.reject(status); 
        //  });
        //     return deferred.promise;
        // },
        isTokenValid: function(){
            var deferred = $q.defer();
            $http.get("http://90.11.6.61" + '/user/isTokenValid')
            .success(function(data){
                deferred.resolve(data);
            }).error(function(data, status){
                deferred.reject(status); 
            });
            return deferred.promise;
        },
        resetPassword: function(mail){
         var deferred = $q.defer();
         $http.post("http://90.11.6.61" + '/user/resetPassword', {mail : mail})
         .success(function(data){
            deferred.resolve(data);
        }).error(function(data, status){
            deferred.reject(status); 
        });
        return deferred.promise;
    },
    sendSignUpMail: function(mail, password){
     var deferred = $q.defer();
     $http.post("http://90.11.6.61" + '/user/sendSignUpMail', {mail : mail, password: password})
     .success(function(data){
        deferred.resolve(data);
    }).error(function(data, status){
        deferred.reject(status);
    });
    return deferred.promise;
},
deleteAccount: function(){
 var deferred = $q.defer();
 $http.post("http://90.11.6.61" + '/user/deleteAccount')
 .success(function(data){
    deferred.resolve(data);
}).error(function(data, status){
    deferred.reject(status);
});
return deferred.promise; 
},
checkPseudo: function(pseudo){
    var deferred = $q.defer();
    $http.post("http://90.11.6.61" + '/user/checkPseudo', {pseudo : pseudo})
    .success(function(data){
        deferred.resolve(data);
    }).error(function(data, status){
        deferred.reject(status);
    });
    return deferred.promise;
},
getImageFromGoogle: function(query){
    var deferred = $q.defer();
    $http.post("http://90.11.6.61" + '/user/getImageFromGoogle', {query : query})
    .success(function(data){
        deferred.resolve(data);
    }).error(function(data, status){
        deferred.reject(status);
    });
    return deferred.promise;
},
sendNotif: function(){
    var deferred = $q.defer();
    $http.post("http://90.11.6.61" + '/user/sendNotifToAlban')
    .success(function(data){
        deferred.resolve(data);
    }).error(function(data, status){
        deferred.reject(status);
    });
    return deferred.promise;
},
unregisterDevice: function(device){
    var deferred = $q.defer();
    $http.post("http://90.11.6.61" + '/user/unregisterDevice', {device : device})
    .success(function(data){
        deferred.resolve(data);
    }).error(function(data, status){
        deferred.reject(status);
    });
    return deferred.promise;
},
serverEvents: function(){
    var deferred = $q.defer();
    $http.get("http://90.11.6.61" + '/user/serverEvents')
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