angular.module('starter.controllers', ['ui.rCalendar', 'ion-datetime-picker', 'firebase'])
  .controller('AppCtrl', function($scope, $rootScope, $location, $ionicPopup, $timeout, $interval, $state) {
    $scope.connect = false;

    $scope.today = function () {
      $scope.selectedDate = new Date();
    };

    var int = $interval(function(){
      if ($rootScope.userInfo) {
        $rootScope.eventSource = [];
        firebase.database().ref('events/' +   $rootScope.userInfo.uid + '/').once('value').then(function(events) {
          $timeout(function(){
            $.each(events.val(), function(index, value) {
            $.each(value, function(i, v) {
              $rootScope.eventSource.push({
                title: v.title,
                startTime: new Date(v.startTime),
                endTime: new Date(v.endTime),
                allDay: v.allDay,
                nameRemove: v.nameRemove
              });
            });
          });
            $scope.today();

          }, 1000);
        });
        $interval.cancel(int);
      }
    }, 500);

    $scope.signOut = function() {
      cordova.plugins.firebase.auth.signOut();
    };

    $scope.showPopup = function() {
      $rootScope.programmes = [];
      firebase.database().ref('prog/' +   $rootScope.userInfo.uid).once('value').then(function(snapshot) {
        $timeout(function(){
          $.each(snapshot.val(), function(index, value) {
            $rootScope.programmes.push(value);
          });
        }, 100);

      });
      $scope.dataPopup = {};

      var popupSave = $ionicPopup.show({
        templateUrl: 'templates/popup.html',
        title: 'Add event',
        scope: $scope,

        buttons: [
          { text: 'Cancel' }, {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {

              if (!$scope.dataPopup) {
                e.preventDefault();
              } else {
                return $scope.dataPopup;
              }
            }
          }
        ]
      });

      popupSave.then(function(res) {
        var dateVal;
        if (res.datetimeValue) {
          dateVal = new Date(res.datetimeValue);
          var startTime = dateVal;
          var endTime = new Date(Date.UTC(dateVal.getFullYear(), dateVal.getMonth(), dateVal.getDate(), dateVal.getHours(), dateVal.getMinutes()));
        } else {
          dateVal = new Date();
          var startTime = new Date(Date.UTC(dateVal.getUTCFullYear(), dateVal.getUTCMonth(), dateVal.getUTCDate(), dateVal.getHours(), dateVal.getMinutes()));
          var endTime = new Date(Date.UTC(dateVal.getUTCFullYear(), dateVal.getUTCMonth(), dateVal.getUTCDate(), dateVal.getHours() + 1, dateVal.getMinutes()));
        }
        var e = document.getElementById("selectPopUp");
        var prog = e.options[e.selectedIndex].text;
        firebase.database().ref('events/' +   $rootScope.userInfo.uid + '/' + dateVal.getFullYear() + "-" + dateVal.getMonth() + "-" + dateVal.getDate() + "/" + prog).set({
          title: res.name + ": " + prog,
          startTime: startTime.toString(),
          endTime: endTime.toString(),
          allDay: false,
          nameRemove: dateVal.getFullYear() + "-" + dateVal.getMonth() + "-" + dateVal.getDate() + "/" + prog
        }, function(error) {
          if (error) {
            console.log(error);
          } else {
            if (!$rootScope.eventSource)
              $rootScope.eventSource = [];
            firebase.database().ref('events/' +   $rootScope.userInfo.uid + '/').once('value').then(function(events) {
              $timeout(function(){
                $.each(events.val(), function(index, value) {
                  $.each(value, function(i, v) {
                    $rootScope.eventSource.push({
                      title: v.title,
                      startTime: new Date(v.startTime),
                      endTime: new Date(v.endTime),
                      allDay: v.allDay,
                      nameRemove: v.nameRemove
                    });
                  });
                });
                $scope.today();

              }, 1000);
            });
          }
        });
      });
    };



    $scope.selectedDate = new Date();

    $scope.onViewTitleChanged = function (title) {
      $scope.mounth = title;
    };

    $scope.onEventSelected = function (event) {
      $scope.event = event;
      $scope.popupEvent = $ionicPopup.show({
        templateUrl: 'templates/popupEvent.html',
        title: 'Add event',
        scope: $scope,
        buttons: [
          { text: 'Cancel' }
        ]
      });
    };


    $scope.loadEvents = function () {
      $rootScope.eventSource = reload();
    };

    $scope.deleteEvent = function() {
      firebase.database().ref('events/' + $rootScope.userInfo.uid + '/' + $scope.event.nameRemove).remove();
    };

    $scope.showEvent = function () {
      $state.go('selectProgramme', {name: $scope.event.nameRemove});
      $scope.popupEvent.close();
    };

    function reload() {
      var e = [];
      firebase.database().ref('events/' +   $rootScope.userInfo.uid + '/').once('value').then(function(events) {
        $.each(events.val(), function(index, value) {
          $.each(value, function(i, v) {
            e.push({
              title: v.title,
              startTime: new Date(v.startTime),
              endTime: new Date(v.endTime),
              allDay: v.allDay,
              nameRemove: v.nameRemove
            });
          });
        });
      });
      return e;
    }
  });

