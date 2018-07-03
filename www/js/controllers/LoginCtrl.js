angular.module('starter.controllers.login', [])
  .controller('LoginCtrl', function($scope, $window, $ionicPlatform, $stateParams, $ionicPopup, $state, $cordovaSQLite) {

/*
    $scope.insert = function(firstname, lastname) {
      var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
      $cordovaSQLite.execute(db, query, [firstname, lastname]).then(function(res) {
      }, function (err) {
        console.error(err);
      });
    }
*/

/*    $scope.select = function(lastname) {
      var query = "SELECT firstname, lastname FROM people WHERE lastname = ?";
      $cordovaSQLite.execute(db, query, [lastname]).then(function(res) {
        if(res.rows.length > 0) {
          console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
        } else {
          console.log("No results found");
        }
      }, function (err) {
        console.error(err);
      });
    }*/


    $scope.signupEmail = function(){
      var email = $("#email").val();
      var password = $("#password").val();

      cordova.plugins.firebase.auth.createUserWithEmailAndPassword(email, password).then(function(userInfo, error) {
        console.log(userInfo);
      }).catch(function(error) {
        $ionicPopup.alert({
          title: 'Error',
          template: error
        });
      });

    };

    $scope.loginEmail = function(){
      var email = $("#email").val();
      var password = $("#password").val();
      cordova.plugins.firebase.auth.signInWithEmailAndPassword(email, password).then(function(userInfo) {
        console.log(userInfo);

        $ionicPopup.alert({
          title: 'Success',
          template: 'You are log'
        });

      }).catch(function(error) {
        console.log(error);
        $ionicPopup.alert({
          title: 'Error',
          template: error
        });
      });

    };


  });
