angular.module('starter.controllers.programme', ['firebase'])
  .controller('ProgrammeCtrl', function($scope, $rootScope, $window, $ionicPlatform, $stateParams, $ionicPopup, $state, $cordovaSQLite, $timeout, $interval, $rootScope, $cordovaFile) {
    $rootScope.programmes = [];
    firebase.database().ref('prog/' +   $rootScope.userInfo.uid).once('value').then(function(snapshot) {
      $timeout(function(){
        $.each(snapshot.val(), function(index, value) {
          $rootScope.programmes.push(value);
        });
      }, 100);

    });

    $scope.delete = function(selectProg) {
      firebase.database().ref('prog/' +   $rootScope.userInfo.uid + '/' + selectProg.name).remove();
      $scope.doRefresh();
      $timeout(function() {
        $state.go('programme');
      }, 100);

    };

    $scope.download = function() {
      var data =
        "Name: " + $rootScope.selectProg.name + "\n" +
        "Exercice: " + $rootScope.selectProg.exercice + "\n" +
        "Repetition: " + $rootScope.selectProg.repetition + "\n" +
        "Nombre de repetition: " + $rootScope.selectProg.nb_repetition + "\n" +
        "Pause(seconde): " + $rootScope.selectProg.pause;
      var title = $rootScope.selectProg.name + ".txt";
      $cordovaFile.writeFile(cordova.file.externalDataDirectory, title, data, true)
        .then(function (success) {
          $rootScope.fileProg = cordova.file.externalDataDirectory + title;
        }, function (error) {
          // error
          console.log(error);
        });
    };


    $scope.share = function() {
      var data =
        "Name: " + $rootScope.selectProg.name + "\n" +
        "Exercice: " + $rootScope.selectProg.exercice + "\n" +
        "Repetition: " + $rootScope.selectProg.repetition + "\n" +
        "Nombre de repetition: " + $rootScope.selectProg.nb_repetition + "\n" +
        "Pause(seconde): " + $rootScope.selectProg.pause;
      window.plugins.socialsharing.share(data, null, null, null);
    };

    $scope.select = function(selectProg) {
      $rootScope.selectProg = selectProg;
    };

    $scope.$on('show', function () {
      $scope.select();
    });


    $scope.doRefresh = function() {
      firebase.database().ref('prog/' +   $rootScope.userInfo.uid).once('value').then(function(snapshot) {
        $timeout(function(){
          $rootScope.programmes = [];
          $.each(snapshot.val(), function(index, value) {
            $rootScope.programmes.push(value);
          });
          $scope.$broadcast('scroll.refreshComplete');
        }, 100);
      });
    };



    $scope.create = function(data) {
      $scope.messageError = {};
      $scope.messageError.text = "";
      $scope.messageError.enable = false;

      firebase.database().ref('prog/' +   $rootScope.userInfo.uid + '/' + data.name).set({
        name: data.name,
        exercice: data.exercice,
        repetition: data.repetition,
        nb_repetition:  data.nbRepetition,
        pause: data.pause
      }, function(error) {
        if (error) {
          console.log(error);
        } else {
          $state.go('programme');
        }
      });
    };

    if ($state.current.url === "/programme")
      $scope.select();

  });
