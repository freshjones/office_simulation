(function() {

  'use strict';

  var app = angular.module("SimApp", ['backlog','design','complete'])

    .controller('MainCtrl', function($rootScope, $scope, $interval)
    {

      var backlogStart = 50;
      var speed = 365;

      var backlogInterval;

      var designSpeed = 800;
      var designInterval;

      var backlogInit = buildBacklog(backlogStart);
      var designWIP = [];
      var backlogArray = [];

      var completedWork = [];

      angular.extend(backlogArray, backlogInit);

      $scope.backlog = backlogArray;
      $scope.backlogCount = $scope.backlog.length;
      $scope.showStartBtn = true;

      $scope.intervalCount = 0;

      $scope.design = designWIP;
      $scope.designCount = 0;

      $scope.completed = completedWork;
      $scope.completedCount = 0;
      $scope.completedTotals = 0;

      $scope.runSim = function()
      {
        
        angular.extend(backlogArray, backlogInit);

        $scope.backlog = backlogArray;
        $scope.backlogCount = backlogArray.length;

        designWIP = [];
        $scope.design = designWIP;
        $scope.designCount  = 0;

        completedWork = [];
        $scope.completed = completedWork;
        $scope.completedCount = 0;

        $scope.showStartBtn = false;
        backlogInterval = $interval(startSimulation, speed);

      }

      $scope.$watch("designCount", function(newValue, oldValue) {
        if ($scope.designCount == 1) {
          $interval.cancel(designInterval);
          designInterval = $interval(processDesignWip, designSpeed);
        }
      });


      $rootScope.title = 'Cool'

      function buildBacklog(val)
      {

        var options = [];

        options[0] = {'name':'large','value':25000};
        options[1] = {'name':'medium','value':10000};
        options[2] = {'name':'small','value':5000};

        var data = [];
        var i;
        for(i=0;i<val;i++)
        {
          
          var num = Math.floor(Math.random() * 3);

          var jobSize = options[num];
          data.push(jobSize);
        };

        return data;
      
      }

      function startSimulation()
      {
          if($scope.backlog.length <= 0 )
          {
              $scope.showStartBtn = true;
              $interval.cancel(backlogInterval);
          } else {

              var nextJob = $scope.backlog.shift();
              designWIP.push(nextJob);

              $scope.design       = designWIP;
              $scope.designCount  = $scope.design.length;

              $scope.backlogCount = $scope.backlog.length;
          }
      }

      function processDesignWip()
      {
         
          if($scope.design.length == 0 )
          {
              //$scope.showStartBtn = true;
              $interval.cancel(designInterval);
          } else {

              var nextJob = $scope.design.shift();

              completedWork.push(nextJob);

              $scope.completed    = completedWork;
              $scope.completedCount  = $scope.completed.length;
              $scope.completedTotals = $scope.completedTotals + nextJob.value;

              $scope.designCount  = $scope.design.length;
          }
          
      }

    });

})();