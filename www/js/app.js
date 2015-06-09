// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var zonder = angular.module('zonder', ['ionic', 'ngCordova'])

zonder.run(function($ionicPlatform, $rootScope, $cordovaSplashscreen, $cordovaStatusbar) {
  $rootScope.animateTooltip = false;

  $ionicPlatform.ready(function() {
    $cordovaSplashscreen.hide();
     $rootScope.showHome = false;
    $rootScope.loadingLogIn = false;
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  if (window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
  }

  $rootScope.friends = new Array();
  $rootScope.requestFriends = new Array();
  $rootScope.addFriends = new Array();
  $rootScope.pollsVoted = new Array();
  $rootScope.myPolls = new Array();

  $rootScope.lengthTab = 0;

  $rootScope.friendsHaveChanged = false;

  $rootScope.pictureSource = Camera.PictureSourceType.CAMERA;
  $rootScope.destinationType = Camera.DestinationType.DATA_URL;
  $rootScope.sideMenuIsOpen = false;
});
});

zonder.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $httpProvider.interceptors.push('TokenInterceptor');

  $stateProvider
  .state('animatedSplashscreen', {
    url: "/animatedSplashscreen",
    templateUrl: "templates/animatedSplashscreen.html"
  })
  .state('home', {
    url: "/home",
    templateUrl: "templates/home.html"
  })
  .state('pollInfo', {
    url: "/pollInfo",
    templateUrl: "templates/pollInfo.html"
  });
  // if none of the above states are matched, use this as the fallback

  if(window.localStorage['isLog'] == "true") {
    $urlRouterProvider.otherwise('/home');
  }
  else{
    $urlRouterProvider.otherwise('/animatedSplashscreen');
  }
});
