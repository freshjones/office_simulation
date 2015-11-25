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

      var runFor          = 365;
      
      $scope.period       = DaysService.period(runFor);
      $scope.backlog      = BacklogService.setBacklog();
      $scope.design       = DesignService.setDesign();
      $scope.production   = ProductionService.setProduction();
      $scope.complete     = CompleteService.setComplete();
      $scope.invoiced     = InvoiceService.setInvoice();
      $scope.paid         = CashService.setCash();
      $scope.chart        = ChartService.setChart();

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
        $scope.production         = ProductionService.setProduction();
        $scope.complete           = CompleteService.setComplete();
        $scope.invoiced           = InvoiceService.setInvoice();
        $scope.paid               = CashService.setCash();
        $scope.chart              = ChartService.setChart();

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
              $scope.period.monthCounter += 1;
              $scope.period.hours -= 1;
              $scope.period.currentHour += 1;
              $scope.period.hourTotalCount += 1;

              //$scope.design.cost = Number( ($scope.design.cost + ( $scope.design.costperhour * $scope.design.workers ) ).toFixed(2) );
              //$scope.production.cost = Number( ($scope.production.cost + ( $scope.production.costperhour * $scope.production.workers ) ).toFixed(2) ) ;

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

                $scope.paid.moneyOut = Number( ($scope.paid.moneyOut + ($scope.production.costs + $scope.design.costs + $scope.invoiced.costs)).toFixed(0) );
         
                var monthOut = Number( ($scope.production.costs + $scope.design.costs + $scope.invoiced.costs).toFixed(0) );
         
                //console.log(' ');
                //console.log('last month: ' + $scope.paid.month);

                $scope.paid.month = Number( ( $scope.paid.money - $scope.paid.month ).toFixed(2) );
                var monthIn = $scope.paid.month;
                
                //console.log('this month: ' + monthIn);

                //console.log('cumulative: ' + $scope.paid.money);
                //console.log(' ');

                //var designIn      = DaysService.getCost( $scope..stations.design.hoursEstimated );
                //var productionIn  = DaysService.getCost( productionWork.stations.development.hoursEstimated );
                //var monthIn       = designInvoice + productionInvoice;


                $scope.chart.labels.push('Month ' + $scope.period.currentMonth );
                $scope.chart.data[0].push(monthIn);
                $scope.chart.data[1].push(monthOut);

                $scope.chart.cumulativedata[0][0] = $scope.paid.money;
                $scope.chart.cumulativedata[1][0] = $scope.paid.moneyOut;


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