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
        $scope.period     = DaysService.period(runFor);
        $scope.backlog    = BacklogService.setBacklog();
        $scope.design      = DesignService.setDesign();

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

              if($scope.period.hourCounter == 24)
              {
                $scope.period.hourCounter = 0;
                //increment a day
                $scope.period.days -= 1;
                $scope.period.currentDay += 1;
                $scope.period.currentHour = 1;
              }

              if( $scope.period.releaseTimes[$scope.period.hourTotalCount] != undefined )
              {
                
                var jobIdx = $scope.period.releaseTimes[$scope.period.hourTotalCount];

                var newJob = $scope.period.jobs[jobIdx];

                var handoffIncrement = newJob.handoff;
                newJob.handoff = $scope.period.hourTotalCount + handoffIncrement;
                
                $scope.backlog.jobs.push(newJob);
                $scope.backlog.jobCount = $scope.backlog.jobs.length;

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
(function() 
{

  'use strict';

  angular.module('backlog', [])
    .config(function(){

    });

})();

(function() 
{

  'use strict';

  angular.module('complete', [])

  	.controller('CompleteController', ['$scope', function($scope) {
	  
	}]);

    
})();

(function() 
{

  'use strict';

  angular.module('design', [])

  	.controller('DesignController', function($scope, $interval) {
	  
	  

	});
    
})();

(function() {
  'use strict';

  function backlogService() 
  {

    var speed = 5000;

    return {
      
      setBacklog: function()
      {

        var backlog = {};

        backlog.jobs      = [];
        backlog.jobCount  = 0;
        backlog.speed     = speed;

        return backlog;

      },

      setHandoff: function()
      {

        
      }

    };

  }

  angular.module('common.backlog', [])
    .factory('BacklogService', backlogService);

})();

(function() {
  'use strict';

  function daysService() {

    var hourSpeed = 10;

    function getJobHours(size)
    {
      var min,max;

      switch(size)
      { 

        case 'small':
          min = 2;
          max = 5;
        break;
        
        case 'medium':
          min = 15;
          max = 60;
        break;

        case 'large':
          min = 80;
          max = 200;
        break;

      }

      return randomIntFromInterval(min,max)

    }

    function getHandoff(size)
    {
      var min,max;

      switch(size)
      { 

        case 'small':
          min = 4;
          max = 24;
        break;
        
        case 'medium':
          min = 24;
          max = 72;
        break;

        case 'large':
          min = 72;
          max = 168;
        break;

      }

      return randomIntFromInterval(min,max)

    }

    function getWorkstations(hours)
    {
      var workstations, designHours,developmentHours;

      workstations = [];

      designHours = 1;

      if(hours > 2)
      {
        var randSplit = randomIntFromInterval(2,3);
        designHours       = Math.floor(hours / randSplit);
      }

      developmentHours  = Math.floor(hours - designHours);
     
      workstations[0] = {'name':'design','hours':designHours}
      workstations[1] = {'name':'development','hours':developmentHours}

      return workstations

    }


    function getAJob()
    {
      
      //we have just recieved a job we can start on we now need to know
      /*
      1) [GOOD] When will we start the job (random based on job size)
      2) [GOOD] What is the path it will take through our shop (assume we hit all workstations)
      3) [GOOD] How long will each workstation require (random)
      4) When will we finish the job (random based on how long each workstation needs)
      5) [GOOD] what is the cost of the job (total hours * hourly rate)
      6) [GOOD] How many total hours were estimated (total hours estimated per workstation)
      */

      var job = {};

      var options = ['small','medium','large'];

      var num = Math.floor(Math.random() * 3);

      var size          = options[num];
      var hours         = getJobHours(size);
      var handoff       = getHandoff(size);
      var workstations  = getWorkstations(hours);

      job.size        = size;
      job.hours       = hours;
      job.estimate    = hours * 125;
      job.handoff     = handoff;
      job.stations    = workstations;

      //console.log(job);
      return job;

    }

    function buildJobs(val)
    {

      var data = [];
      var i;
      for(i=0;i<val;i++)
      {

        var job = getAJob();
        
        data.push(job);

      };

      return data;
    
    }

    function randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    function setNumJobs(numDays)
    {

      var jobsPerYear = 50;
      var jobsPerDay =  Math.round((jobsPerYear / 365)*100)/100;

      var avgJobsPerPeriod =  Math.ceil(jobsPerDay * numDays);

      var min = 1;
      var max = 2;

      if(avgJobsPerPeriod >= 3)
      {
        min = avgJobsPerPeriod - Math.floor((avgJobsPerPeriod*50)/100);
      }

      max = avgJobsPerPeriod + Math.ceil((avgJobsPerPeriod*50)/100);

      return randomIntFromInterval(min,max);

    }

    function buildReleaseTimes(numHours,jobData)
    {

      var releaseTimes = [];

      jobData.forEach(function(entry, index) 
      { 
          var num = randomIntFromInterval(1,numHours);

          releaseTimes[num] = index;
      });
        
      return releaseTimes;

    }

    return {
      
      period : function(numDays)
      {

        var period = {};
        period.days                = numDays;
        period.hours               = numDays * 24;
        period.currentDay          = 1;
        period.currentHour         = 1;
        period.hourSpeed           = hourSpeed;
        period.hourCounter         = 0;
        period.hourTotalCount      = 0;

        var numJobs                = setNumJobs(numDays);
        var jobdata                = buildJobs(numJobs);
       
        period.jobs                = jobdata;
        period.releaseTimes        = buildReleaseTimes(period.hours,jobdata);

        return period;

      }

    };

  }

  angular.module('common.days', [])
    .factory('DaysService', daysService);

})();

(function() {
  'use strict';

  function designService() 
  {

    var speed = 5000;

    return {
      
      setDesign: function()
      {

        var design = {};

        design.jobs      = [];
        design.jobCount  = 0;
        design.speed     = speed;

        return design;

      }

    };

  }

  angular.module('common.design', [])
    .factory('DesignService', designService);

})();