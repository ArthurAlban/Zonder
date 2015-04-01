// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var zonder = angular.module('zonder', ['ionic', 'ngCordova'])

zonder.run(function($ionicPlatform, $cordovaSplashscreen) {
  $ionicPlatform.ready(function() {
    console.log("hidebefore");
    $cordovaSplashscreen.hide();
    console.log("hideafter");

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

zonder.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('animatedSplashscreen', {
    url: "/animatedSplashscreen",
    templateUrl: "templates/animatedSplashscreen.html"
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/animatedSplashscreen');
});
