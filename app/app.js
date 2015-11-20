(function() {

  'use strict';

  var app = angular.module("SimApp", ['backlog'])

    .controller('MainCtrl', function($rootScope, $scope, $interval)
    {

      var backlogStart = 20;
      var speed = 100;
      var backlogInterval;

      $scope.backlog = backlogStart;
      $scope.showStartBtn = true;

      $scope.runSim = function()
      {
        $scope.backlog = backlogStart;
        $scope.showStartBtn = false;
        backlogInterval = $interval(startSimulation, speed);
      }

      $rootScope.title = 'Cool'

      function startSimulation()
      {
          if($scope.backlog == 0)
          {
              $scope.showStartBtn = true;
              $interval.cancel(backlogInterval);
          } else {
              $scope.backlog = $scope.backlog - 1;
          }
      }

    });

})();