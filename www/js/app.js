angular.module('starter', ['ionic', 'starter.controllers.login', 'starter.controllers.programme', 'starter.controllers', 'ngCordova', 'starter.controllers.chat'])

.run(function($ionicPlatform, $cordovaSQLite, $rootScope, $location) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    cordova.plugins.firebase.auth.onAuthStateChanged(function (userInfo) {
      if (userInfo && userInfo.uid) {
        $rootScope.userInfo = userInfo;
        $location.path('/app');
      } else {
        $location.path('/login/signin');
      }
      $rootScope.$apply()
    });
  });
  $rootScope.signOut = function() {
    cordova.plugins.firebase.auth.signOut();
  };
})

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('chat', {
      url: '/chat',
      templateUrl: 'templates/chat.html',
      controller: 'Messages'
    })

      .state('signin', {
        url: '/login/signin',
        templateUrl: 'templates/signin.html',
        controller: 'LoginCtrl'
      })

      .state('signup', {
        url: '/login/signup',
        templateUrl: 'templates/signup.html',
        controller: 'LoginCtrl'
      })

      .state('programme', {
        url: '/programme',
        templateUrl: 'templates/showProgramme.html',
        controller: 'ProgrammeCtrl'
      })

      .state('createProgramme', {
        url: '/programme/create',
        templateUrl: 'templates/createProgramme.html',
        controller: 'ProgrammeCtrl'
      })

      .state('selectProgramme', {
      url: '/programme/:name',
      templateUrl: 'templates/selectProgramme.html',
      controller: 'ProgrammeCtrl'
    });

    $urlRouterProvider.otherwise('/app');
  });

