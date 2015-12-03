(function() {

  'use strict';

  var app = angular.module("SimApp", 
    [
      'backlog', 
      'design', 
      'production', 
      'complete', 
      'common.days', 
      'common.backlog', 
      'common.design', 
      'common.production', 
      'common.complete',
      'common.invoice',
      'common.cash',
      'common.chart',
      'chart.js',
      'chart'
    ])

    .controller('MainCtrl', function(
      $rootScope, 
      $scope, 
      $interval, 
      DaysService, 
      BacklogService, 
      DesignService, 
      CompleteService, 
      ProductionService,
      InvoiceService,
      CashService,
      ChartService
      )
    {
      
      var periodInterval;
      var backlogInterval;
      var interationInterval;

      var days          = 365;
      var hours         = days * 24;
      var iterations    = 2;
      
      resetPeriod();
      resetSimulation();

      //$scope.monte        = MontecarloService.setMonte();

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

      $scope.runSimMonteCarlo = function()
      {
        resetPeriod();
        resetSimulation();
        interationInterval = $interval(runInterations, $scope.period.iterationSpeed);
      }

      function runInterations()
      {

        if($scope.period.iterations <= 0 )
        {
            $scope.showStartBtn = true;
            $interval.cancel(interationInterval);
        } 
        else 
        {
            $interval.cancel(periodInterval);
            $scope.period.iterations -= 1;
            $scope.period.curIteration += 1;

            var numJobs = DaysService.getNumJobs(days);

            var jobData = DaysService.setJobs(numJobs);

            jobData.forEach(function(job, index) 
            {
              job.releaseTime = DaysService.getReleaseTime(hours);
              $scope.period.jobs.push(job);
            });
            
            //build release data
            $scope.period.releaseTimes = DaysService.buildReleaseSchedule($scope.period.jobs);

            var i;

            for(i=0;i<=hours;i++)
            {
              runSimulation();
            }

        }

      }

      function resetPeriod()
      {
        $scope.period             = DaysService.period(days,iterations);
      }

      function resetSimulation()
      {
        $scope.period             = DaysService.period(days,iterations);
        $scope.backlog            = BacklogService.setBacklog();
        $scope.design             = DesignService.setDesign();
        $scope.production         = ProductionService.setProduction();
        $scope.complete           = CompleteService.setComplete();
        $scope.invoiced           = InvoiceService.setInvoice();
        $scope.paid               = CashService.setCash();
        $scope.chart              = ChartService.setChart();
      }

      function runSimulation()
        {

            //hide run button
            $scope.showStartBtn = false;

            
            

              $scope.period.hourCounter += 1;
              $scope.period.monthCounter += 1;
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

              if($scope.period.monthCounter == 720)
              {

                var moneyOut = 10000;
                //Number(($scope.production.costs + $scope.design.costs + $scope.invoiced.costs).toFixed(0));

                var randMoneyOut = InvoiceService.getMonthlyOpCosts(moneyOut);

                var totalMoneyOut = Number( ($scope.paid.moneyOut + randMoneyOut).toFixed(0) );
                
                $scope.paid.moneyOut = totalMoneyOut;
         
                var monthOut = randMoneyOut;
         
                var monthIndex = $scope.period.currentMonth - 1;

                $scope.paid.month = Number( ( $scope.paid.money - $scope.paid.month ).toFixed(2) );
                
                var monthIn = $scope.paid.month;

                $scope.chart.labels[monthIndex] = 'Month ' + $scope.period.currentMonth;

                if($scope.chart.data[0][monthIndex] == undefined)
                {
                  $scope.chart.data[0][monthIndex] = 0;
                }

                if($scope.chart.data[1][monthIndex] == undefined)
                {
                  $scope.chart.data[1][monthIndex] = 0;
                }

                $scope.chart.data[0][monthIndex] += monthIn;
                $scope.chart.data[1][monthIndex] += monthOut;

                /*
                if($scope.monte.monthData[0][monthIndex] == undefined)
                {
                  $scope.monte.monthData[0][monthIndex] = 0;
                }

                if($scope.monte.cumMonthData[0][monthIndex] == undefined)
                {
                  $scope.monte.cumMonthData[0][monthIndex] = 0;
                }

                if($scope.monte.monthData[1][monthIndex] == undefined)
                {
                  $scope.monte.monthData[1][monthIndex] = 0;
                }

                if($scope.monte.cumMonthData[1][monthIndex] == undefined)
                {
                  $scope.monte.cumMonthData[1][monthIndex] = 0;
                }

                var monteCumMonthData = $scope.monte.cumMonthData[0][monthIndex];
                var monteCumMonthOutData = $scope.monte.cumMonthData[1][monthIndex];

                var curMonthData      = monthIn;
                var curMonthOutData   = monthOut;

                var cumMonth          = monteCumMonthData + curMonthData;
                var cumMonthOut       = monteCumMonthOutData + curMonthOutData;

                var avgMonth          = cumMonth / $scope.monte.curIteration;
                var avgMonthOut       = cumMonthOut / $scope.monte.curIteration;

                $scope.monte.cumMonthData[0][monthIndex] = cumMonth;
                $scope.monte.cumMonthData[1][monthIndex] = cumMonthOut;

                $scope.monte.monthData[0][monthIndex] = avgMonth;
                $scope.monte.monthData[1][monthIndex] = avgMonthOut;
                */
                $scope.period.monthCounter = 0;
                $scope.period.monthTotalCounter += 1;
                $scope.period.currentMonth += 1;

                if($scope.period.currentMonth >= 13)
                {
                  $scope.period.currentMonth = 1;
                }

              }

              if( $scope.period.releaseTimes[$scope.period.hourTotalCount] != undefined )
              {
                
                var jobIdx = $scope.period.releaseTimes[$scope.period.hourTotalCount];

                var newJob = $scope.period.jobs[jobIdx];

                var handoffIncrement = newJob.handoff;
                newJob.handoff = $scope.period.hourTotalCount + handoffIncrement;
                
                $scope.backlog.jobs.push(newJob);
                $scope.backlog.jobCount = $scope.backlog.jobs.length;
                $scope.complete.potentialValue +=  Number((newJob.estimate).toFixed(2)) ;

                //console.log(newJob);
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

                  }

                });
               
              }

              /* create the work day */

              if( $scope.period.workingHours.indexOf( $scope.period.currentHour ) >= 0 )
              {
                  /* ensure we have jobs for designers to work on */
                  if($scope.design.jobs.length)
                  {
                      var designers = $scope.design.workers;
                      var i;

                      for(i=0; i<designers; i++)
                      {

                        /* assuming we have enough jobs to go around */
                        if( $scope.design.jobs[i] != undefined )
                        {
                          var designWork = $scope.design.jobs[i];

                          var designWorkHours = designWork.stations.design.hours;
                          var designWorkHoursWorked = designWork.stations.design.hoursWorked;

                          if(designWorkHours <= 0)
                          {
                            
                            $scope.production.jobs.push( designWork );
                            $scope.production.jobCount = $scope.production.jobs.length;

                            //$scope.complete.actualValue += DaysService.getCost( productionWork.stations.development.hoursEstimated );

                            $scope.design.jobs.splice(i,1);
                            $scope.design.jobCount = $scope.design.jobs.length;
                            

                          } else {

                            var hourObj = DesignService.doWork(designWorkHours, designWorkHoursWorked)

                            //we update our job ticket
                            $scope.design.jobs[i].stations.design.hours       = hourObj.hours;
                            $scope.design.jobs[i].stations.design.hoursWorked = hourObj.hoursWorked;
                            $scope.design.jobs[i].stations.design.log.push(hourObj.log);

                            //console.log( $scope.design.jobs[i] );

                          }
                           
                        }

                      }


                  }
                  
                  /* PRODUCTIOIN */
                  if($scope.production.jobs.length)
                  {
                    var engineers = $scope.production.workers;
                    var i;

                    for(i=0; i<engineers; i++)
                    {

                      /* assuming we have enough jobs to go around */
                      if( $scope.production.jobs[i] != undefined )
                      {
                        var productionWork = $scope.production.jobs[i];

                        var productionWorkHours = productionWork.stations.development.hours;
                        var productionWorkHoursWorked = productionWork.stations.development.hoursWorked;

                        if(productionWorkHours <= 0)
                        {
                          
                          productionWork.invoiceOn = DaysService.invoiceOn($scope.period.hourTotalCount);

                          $scope.complete.jobs.push( productionWork );
                          $scope.complete.jobCount = $scope.complete.jobs.length;


                          var designInvoice = DaysService.getCost( productionWork.stations.design.hoursEstimated );
                          var productionInvoice = DaysService.getCost( productionWork.stations.development.hoursEstimated );
                          var totalInvoice = designInvoice + productionInvoice;

                          $scope.complete.actualValue += totalInvoice;
                          
                          $scope.production.jobs.splice(i,1);
                          $scope.production.jobCount = $scope.production.jobs.length;
                          

                        } else {

                          var hourObj = ProductionService.doWork(productionWorkHours, productionWorkHoursWorked);

                          //we update our job ticket
                          $scope.production.jobs[i].stations.development.hours       = hourObj.hours;
                          $scope.production.jobs[i].stations.development.hoursWorked = hourObj.hoursWorked;
                          $scope.production.jobs[i].stations.development.log.push(hourObj.log);

                        }
                         
                      }

                    }

                  }

                  /* COMPLETE */
                  if($scope.complete.jobs.length)
                  {
                  
                      $scope.complete.jobs.forEach(function(project,index) 
                      {

                        if(project.invoiceOn == $scope.period.hourTotalCount)
                        {
                            //remove from completed
                            //$scope.complete.jobs.splice(i,1);
                            //$scope.complete.jobCount = $scope.complete.jobs.length;

                            project.paidOn = DaysService.paidOn($scope.period.hourTotalCount);

                            var designInvoice = DaysService.getCost( project.stations.design.hoursEstimated );
                            var productionInvoice = DaysService.getCost( project.stations.development.hoursEstimated );
                            var totalInvoice = designInvoice + productionInvoice;

                            $scope.invoiced.jobs.push( project );
                            $scope.invoiced.jobCount = $scope.invoiced.jobs.length;
                            $scope.invoiced.money += totalInvoice;

                        }

                      });
                    

                  }

                  /* INVOICED */
                  if($scope.invoiced.jobs.length)
                  {
                
                    $scope.invoiced.jobs.forEach(function(project,index) 
                    {

                      if(project.paidOn == $scope.period.hourTotalCount)
                      {
                          //remove from completed
                          //$scope.complete.jobs.splice(i,1);
                          //$scope.complete.jobCount = $scope.complete.jobs.length;

                          var designInvoice = DaysService.getCost( project.stations.design.hoursEstimated );
                          var productionInvoice = DaysService.getCost( project.stations.development.hoursEstimated );
                          var totalInvoice = designInvoice + productionInvoice;

                          $scope.paid.jobs.push( project );
                          $scope.paid.jobCount = $scope.paid.jobs.length;
                          $scope.paid.money += totalInvoice;

                      }

                    });
                    
                  }


              


            }

        }
     
        $rootScope.title = 'Cool'

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

  angular.module('chart', [])

    .controller('ChartController', function($scope,$timeout) 
    {
      
      
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

(function() 
{

  'use strict';

  angular.module('production', [])

  	.controller('ProductionController', function($scope, $interval) {
	  
	  

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

        backlog.jobs        = [];
        backlog.jobCount    = 0;
        backlog.speed       = speed;

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

  function cashService() 
  {

    return {
      
      setCash: function()
      {

        var cash = {};

        cash.jobs             = [];
        cash.jobCount         = 0;
        cash.month            = 0;
        cash.money            = 0;
        cash.moneyOut         = 0;

        return cash;

      }


    };

  }

  angular.module('common.cash', [])
    .factory('CashService', cashService);

})();
(function() {
  'use strict';

  function chartService() 
  {

    return {
      
      setChart: function()
      {

        var cols = 12;
        var chart = {};
        var i;

        chart.labels = [];
        chart.series = ['Income', 'Expenses'];
        chart.data = [];
        chart.data[0] = [];
        chart.data[1] = [];

        chart.cumulativelabels = ['Income vs. Expense'];
        chart.cumulativedata = [];
        chart.cumulativedata[0] = [];
        chart.cumulativedata[1] = [];

        /*
        for(i=0;i<cols;i++)
        {
          chart.labels.push('Month ' + i );
          chart.data[0].push(0);
          chart.data[1].push(0);
        }
        */
        return chart;

      }


    };

  }

  angular.module('common.chart', [])
    .factory('ChartService', chartService);

})();
(function() {
  'use strict';

  function completeService() 
  {

    function getInvoiceTime()
    {
     
      var min,max;

      min = 1;
      max = 30;

      return Math.floor(Math.random()*(max-min+1)+min);

    }

    return {
      
      setComplete: function()
      {

        var complete = {};

        complete.jobs             = [];
        complete.jobCount         = 0;
        complete.potentialValue   = 0;
        complete.actualValue      = 0;
        complete.invoice          = getInvoiceTime();

        return complete;

      }


    };

  }

  angular.module('common.complete', [])
    .factory('CompleteService', completeService);

})();
(function() {
  'use strict';

  function daysService() {

    var hourSpeed = 10;
    var iterationSpeed = 10;
    var rate = 125;
    var startupCapital = 0;
    var invoice_terms = [0,30];
    var net_terms = [30,90];

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

      workstations = {};

      designHours = 1;

      if(hours > 2)
      {
        var randSplit = randomIntFromInterval(2,3);
        designHours       = Math.floor(hours / randSplit);
      }

      developmentHours  = Math.floor(hours - designHours);
     
      workstations.design = {'hoursEstimated':designHours, 'hoursWorked':0, 'hours':designHours,'log':[] }
      workstations.development = {'hoursEstimated':developmentHours, 'hoursWorked':0, 'hours':developmentHours, 'log':[] }

      return workstations

    }

    function getInvoiceOn(hours)
    {
      
      var time = randomIntFromInterval(invoice_terms[0],invoice_terms[1]);

      return hours + (time * 24);

    }


    function getPaidOn(hours)
    {
      
      var time = randomIntFromInterval(net_terms[0],net_terms[1]);

      return hours + (time * 24);

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

      var num = 1;//Math.floor(Math.random() * 3);

      var size          = options[num];
      var hours         = 1; //getJobHours(size);
      var handoff       = 1; //getHandoff(size);
      var workstations  = getWorkstations(hours);

      job.size        = size;
      job.hours       = hours;
      job.estimate    = hours * rate;
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
          /*
          var release = {};
          release.time = num;
          release.jobIdx = index;
          */
          releaseTimes[index] = num;
      });
        
      return releaseTimes;

    }

    return {
      
      period : function(numDays,numIterations)
      {

        var period = {};
        
        period.iterations          = numIterations;
        period.curIteration        = 1;
        period.iterationSpeed      = iterationSpeed;


        period.days                = numDays;
        period.hours               = numDays * 24;
        period.currentDay          = 1;
        period.currentHour         = 1;
        period.currentMonth        = 1;
        period.hourSpeed           = hourSpeed;
        period.hourCounter         = 0;
        period.monthCounter        = 0;
        period.monthTotalCounter   = 0;
        period.startupCapital      = startupCapital;
        period.hourTotalCount      = 0;
        period.workingHours        = [8,9,10,11,12,13,14,15,16];

        //var numJobs                = 50; //setNumJobs(numDays);
        //var jobdata                = 
        period.numJobs             = 0;
        period.jobs                = [];
        period.releaseTimes        = []; //buildReleaseTimes(period.hours,jobdata);

        return period;

      },

      getNumJobs : function(days)
      {
        return 50; //setNumJobs(days);
      },

      setJobs : function(numJobs)
      {
        return buildJobs(numJobs);
      },

      buildReleaseSchedule : function(jobs)
      {
        var releaseTimes = {};
        jobs.forEach(function(job,index)
        {
          releaseTimes[job.releaseTime] = index;
        });

        return releaseTimes;
      },

      getReleaseTime : function(hours)
      {
        return randomIntFromInterval(1,hours);
      },

      getCost : function(hours)
      {

        return Number((hours * rate).toFixed(2));
      },

      invoiceOn : function(hours)
      {
        return  getInvoiceOn(hours);
      },

      paidOn : function(hours)
      {
        return  getPaidOn(hours);
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

    var speed     = 5000;
    var avgSalary = 45000;
    var resources = 1;

    return {
      
      setDesign: function()
      {

        var design = {};

        design.jobs           = [];
        design.jobCount       = 0;
        design.speed          = speed;
        design.costperhour    = (avgSalary / 365) / 24;
        design.cost           = 0;
        design.workers        = resources;
        design.costs          = ((avgSalary / 365) * 30) * resources;

        return design;

      },

      doWork: function(hours, hoursWorked)
      {
        var work = {};

        work.hours        = hours - 1;
        work.hoursWorked  = hoursWorked + 1;
        work.log = 'An hours worth of effort completed we now have ' + work.hours + ' hours left in design';

        return work;

      }

    };

  }

  angular.module('common.design', [])
    .factory('DesignService', designService);

})();
(function() {
  'use strict';

  function invoiceService() 
  {

    var avgSalary = 45000;
    var resources = 1;
    var overhead  = 10000;

    function fluxuateCosts(cost)
    {

      var min,max;

      min = cost - 5000;
      max = cost + 5000;

      return cost; //Math.floor(Math.random()*(max-min+1)+min);

    }

    return {
      
      setInvoice: function()
      {

        var invoice = {};

        invoice.jobs             = [];
        invoice.jobCount         = 0;
        invoice.potentialValue   = 0;
        invoice.money            = 0;
        invoice.costs            = (((avgSalary / 365) * 30) * resources) + overhead;

        return invoice;

      },

      getMonthlyOpCosts: function(cost)
      {
        return fluxuateCosts(cost);
      }


    };

  }

  angular.module('common.invoice', [])
    .factory('InvoiceService', invoiceService);

})();
(function() {
  'use strict';

  function montecarloService() 
  {

    var iterations = 2;
    var speed = 200;

    return {
      
      setMonte: function()
      {

        var monte = {};

        monte.speed             = speed;
        monte.iterationStart    = iterations;
        monte.iterations        = iterations;
        monte.curIteration      = 0;
        monte.CumIncome         = 0;
        monte.CumExpenses       = 0;
        monte.income            = 0;
        monte.expenses          = 0;
        monte.margin            = 100;
        monte.seed              = 0;

        monte.monthData         = [];
        monte.monthData[0]      = [];
        monte.monthData[1]      = [];

        monte.cumMonthData         = [];
        monte.cumMonthData[0]      = [];
        monte.cumMonthData[1]      = [];

        return monte;

      },

      

    };

  }

  angular.module('common.montecarlo', [])
    .factory('MontecarloService', montecarloService);

})();

(function() {
  'use strict';

  function productionService() 
  {

    var speed     = 5000;
    var avgSalary = 45000;
    var resources = 1;

    return {
      
      setProduction: function()
      {

        var production = {};

        production.jobs           = [];
        production.jobCount       = 0;
        production.speed          = speed;
        production.costperhour    = (avgSalary / 365) / 24;
        production.cost           = 0;
        production.workers        = resources;
        production.costs          = ((avgSalary / 365) * 30) * resources;

        return production;

      },

      doWork: function(hours, hoursWorked)
      {
        var work = {};

        work.hours        = hours - 1;
        work.hoursWorked  = hoursWorked + 1;
        work.log = 'An hours worth of effort completed we now have ' + work.hours + ' hours left in design';

        return work;

      }

    };

  }

  angular.module('common.production', [])
    .factory('ProductionService', productionService);

})();