zonder.factory('TokenInterceptor', function ($q, $window, $location, $rootScope) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.localStorage['token']) {
                config.headers.Authorization = 'Bearer ' + $window.localStorage['token'];
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        response: function (response) {
            return response || $q.when(response);
        },

        responseError: function(rejection) {
            console.log("rejection" + JSON.stringify(rejection));
            var url = rejection.config.url;
            url = url.split("/");
            var nameRequest = url[url.length-1];
            console.log("nameRequest" + nameRequest);
            if (rejection != null && rejection.status === 0 ) {
                $window.localStorage['isLog'] = false;
                $location.path("/login");
            }
            else if(rejection != null && rejection.status === 500) {
                $window.localStorage['isLog'] = false;
                $location.path("/login");
            }
            else {
                if(nameRequest != "logIn"){
                    $rootScope.displayErrorRequest = true;
                    window.setTimeout(function(){              
                      $rootScope.displayErrorRequest = false;
                      $rootScope.$apply();
                  }, 2000);
                }
            }
            return $q.reject(rejection);
        }
    };
});