(function() {

  'use strict';

  var app = angular.module("SimApp", ['backlog','design','complete', 'common.days', 'common.backlog', 'common.design'])

    .controller('MainCtrl', function($rootScope, $scope, $interval, DaysService, BacklogService, DesignService)
    {

      var workingHours = [8,9,10,11,12,13,14,15,16];
      var periodInterval;
      var backlogInterval;

      var runFor          = 7;
      
      $scope.period       = DaysService.period(runFor);
      $scope.backlog      = BacklogService.setBacklog();
      $scope.design      = DesignService.setDesign();


      $scope.showStartBtn = true;

      /*
      var designSpeed = 800;
      var designInterval;

      var designWIP = [];

      var completedWork = [];

      $scope.intervalCount = 0;

      $scope.design = designWIP;
      $scope.designCount = 0;

      $scope.completed = completedWork;
      $scope.completedCount = 0;
      $scope.completedTotals = 0;
      */

      $scope.runSim = function()
      {
        //cancel all intervals
        $interval.cancel();

        //reset period
        $scope.period             = DaysService.period(runFor);
        $scope.backlog            = BacklogService.setBacklog();
        $scope.design             = DesignService.setDesign();
        

        //console.log($scope.period.jobs)
        //start the inteval
        periodInterval = $interval(startSimulation, $scope.period.hourSpeed);

        function startSimulation()
        {

            //hide run button
            $scope.showStartBtn = false;

            //get a backlog of work for the time period
            if($scope.period.hours <= 0 )
            {
                $scope.showStartBtn = true;
                $interval.cancel(periodInterval);
            } 
            else 
            {
              $scope.period.hourCounter += 1;
              $scope.period.hours -= 1;
              $scope.period.currentHour += 1;
              $scope.period.hourTotalCount += 1;

              $scope.design.cost = Number( ($scope.design.cost + $scope.design.costperhour).toFixed(2) );

              if($scope.period.hourCounter == 24)
              {

                $scope.period.hourCounter = 0;
                //increment a day
                $scope.period.days -= 1;
                $scope.period.currentDay += 1;
                $scope.period.currentHour = 1;

                /* 
                we could do calcs every 24 hours ??
                */

              }

              if( $scope.period.releaseTimes[$scope.period.hourTotalCount] != undefined )
              {
                
                var jobIdx = $scope.period.releaseTimes[$scope.period.hourTotalCount];

                var newJob = $scope.period.jobs[jobIdx];

                var handoffIncrement = newJob.handoff;
                newJob.handoff = $scope.period.hourTotalCount + handoffIncrement;
                
                $scope.backlog.jobs.push(newJob);
                $scope.backlog.jobCount = $scope.backlog.jobs.length;
                $scope.backlog.potential =  Number(($scope.backlog.potential + newJob.estimate).toFixed(2)) ;
                //we have just recieved a job we can start on we now need to know
                /*
                1) When will we start the job (random based on job size)
                2) What is the path it will take through our shop (assume we hit all workstations)
                3) How long will each workstation require (random)
                4) When will we finish the job (random based on how long each workstation needs)
                5) what is the cost of the job (total hours * hourly rate)
                6) How many total hours were estimated (total hours estimated per workstation)
                */
                //BacklogService.addBacklogItem($scope.period.jobs[jobIdx]);

              }

              if($scope.backlog.jobs.length > 0 )
              {

                /*
                We have jobs yay! now we get it into the system via the handoff increment
                */

                $scope.backlog.jobs.forEach(function(entry,index){

                  if( entry.handoff ==  $scope.period.hourTotalCount )
                  {
                      //console.log('yay we are releasing a job at hour ' +  $scope.period.hourTotalCount);
                      var designRelease = $scope.backlog.jobs[index];

                     
                      //add the job to the design wip
                      $scope.design.jobs.push(designRelease);
                      $scope.design.jobCount = $scope.design.jobs.length;

                      //remove it from the backlog
                      $scope.backlog.jobs.splice(index, 1);
                      $scope.backlog.jobCount = $scope.backlog.jobs.length;

                      //console.log(designRelease);
                      
                      /*
                      var handoffIncrement = newJob.handoff;
                      newJob.handoff = $scope.period.hourTotalCount + handoffIncrement;
                      
                      $scope.backlog.jobs.push(newJob);
                      $scope.backlog.jobCount = $scope.backlog.jobs.length;

                      */
                  }

                });
               
              }

              /*
              
              */
              //deliver jobs
              // 



            }

        }

        /*
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
        */
      }

      /*
      $scope.$watch("backlog.jobCount", function(newValue, oldValue) {
        if ($scope.backlog.jobCount == 1) {
          //BacklogService.startBacklog();
          $interval.cancel(backlogInterval);
          backlogInterval = $interval(processBacklogItem, $scope.backlog.speed);
        }
      });
      */

      function processBacklogItem()
      {

          if( $scope.backlog.jobs.length <= 0 )
          {
              $interval.cancel(backlogInterval);
          } else {

              var nextBacklogItem = $scope.backlog.jobs.shift();
              //designWIP.push(nextBacklogItem);

              //$scope.design       = designWIP;
              //$scope.designCount  = $scope.design.length;

              $scope.backlog.jobCount = $scope.backlog.jobs.length;
          }
          
      }


      $scope.$watch("designCount", function(newValue, oldValue) {
        if ($scope.designCount == 1) {
          $interval.cancel(designInterval);
          designInterval = $interval(processDesignWip, designSpeed);
        }
      });


      $rootScope.title = 'Cool'

      

      

      

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