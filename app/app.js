(function() {

  'use strict';

  var app = angular.module("SimApp", 
    [ 
      'common.expense',
      'common.sales',
      'common.design',
      'common.production',
      'common.invoice',
      'common.chart',
      'chart.js',
      'chart'
    ])

    .controller('MainCtrl', function(
      $rootScope, 
      $scope, 
      $interval, 
      $log,
      ExpenseService,
      SalesService,
      DesignService,
      ProductionService,
      InvoiceService
      )
    {


      
      $scope.bob = 0;
      $scope.sue = 0;

      var interationInterval;
      var tothour;
      var iterations,curIteration,days,hours,rate,income,expense,jobs;

      var chart                             = {};

      var monthly                           = {};
      monthly.incomeData                    = {};
      monthly.incomeData.monthlyTotals      = [];
      monthly.incomeData.monthlyAverages    = [];
      
      //var monthly.expenseData              = {};
      monthly.expenseData                   = {};
      monthly.expenseData.monthlyTotals     = [];
      monthly.expenseData.monthlyAverages   = [];

      monthly.jobData                       = {};
      monthly.jobData.monthlyTotals         = [];
      monthly.jobData.monthlyAverages       = [];

      chart.labels                          = [];
      chart.series                          = ['Income', 'Expenses'];
      chart.data                            = [];
      chart.data[0]                         = [];
      chart.data[1]                         = [];

      var totIncome                         = 0;
      var avgIncome                         = 0;

      var totExpense                        = 0;
      var avgExpense                        = 0;

      var totJobs                           = 0;
      var avgJobs                           = 0;

      var counterMonth                      = 0;
      var counterDay                        = 0;

      var curIteration                      = 0;
      var curMonth                          = 0;
      var curDay                            = 0;
      var curHour                           = 0;
      var workingHours                      = [8,9,10,11,12,13,14,15];
      var monthlyIncome                     = 0;
      var monthlyExpenses                   = 0;
      
      var jobsPerYear                       = {};

      var officeExpensePerHour              = ExpenseService.getOfficeExpensesPerHour();
     
      $scope.showStartBtn                   = true;
      
      $scope.curIteration                   = curIteration;
 
      $scope.avgIncome                      = avgIncome;
      $scope.avgIncomeMo                    = avgIncome / 12;

      $scope.avgExpense                     = avgExpense;
      $scope.avgExpenseMo                   = avgExpense / 12;
      
      $scope.avgJobs                        = avgJobs;
      $scope.avgJobsMo                      = avgJobs / 12;

      $scope.rate                           = 100;
      $scope.iterations                     = 1;
      $scope.jobs                           = 1;
      $scope.jobratio                        = 5;

      $scope.resources                      = {};
      $scope.resources.designers            = 1;
      $scope.resources.engineers            = 1;

      
      var sales                             = {};
      sales.jobs                            = {};

      var backlog                           = {};
      backlog.jobs                          = {};
      backlog.jobCount                      = 0;

      var design                            = {};
      design.jobs                           = {};
      design.jobCount                       = 0;

      var development                       = {};
      development.jobs                      = {};
      development.jobCount                  = 0;

      var complete                          = {};
      complete.jobs                         = {};
      complete.jobCount                     = 0;

      var invoiced                          = {};
      invoiced.jobs                         = {};
      invoiced.jobCount                     = 0;

      var paid                              = {};
      paid.jobs                             = {};
      paid.jobCount                         = 0;

      $scope.profit                         = 0;
      $scope.profitMo                       = 0;
      $scope.grossMargin                    = 0;

      $scope.runSim = function()
      {
        
        iterations    = $scope.iterations;
        days          = 360;

        hours         = days * 24;
        curIteration  = 0;

        
        totIncome     = 0;
        avgIncome     = 0;
        totExpense    = 0;
        avgExpense    = 0;
        totJobs       = 0;
        avgJobs       = 0;

        counterMonth  = 0;
        counterDay    = 0;

        sales                                 = {};
        sales.jobs                            = {};

        backlog                               = {};
        backlog.jobs                          = {};
        backlog.jobCount                      = 0;

        design                                = {};
        design.jobs                           = {};
        design.jobCount                       = 0;

        development                                = {};
        development.jobs                           = {};
        development.jobCount                       = 0;

        complete                                = {};
        complete.jobs                           = {};
        complete.jobCount                       = 0;

        invoiced                                = {};
        invoiced.jobs                           = {};
        invoiced.jobCount                       = 0;

        paid                                = {};
        paid.jobs                           = {};
        paid.jobCount                       = 0;

        monthly.incomeData.monthlyTotals      = [];
        monthly.incomeData.monthlyAverages    = [];
      
        monthly.expenseData.monthlyTotals     = [];
        monthly.expenseData.monthlyAverages   = [];

        monthly.jobData.monthlyTotals         = [];
        monthly.jobData.monthlyAverages       = [];

        //hide run button
        $scope.showStartBtn       = false;
        $scope.avgIncome          = avgIncome;
        $scope.avgIncomeMo        = avgIncome/12;
        $scope.avgExpense         = avgExpense;
        $scope.avgExpenseMo       = avgExpense / 12;
        $scope.curIteration       = curIteration;
        
        interationInterval        = $interval(runInterations, 10);

      }

      function runInterations()
      {

        if(iterations <= 0 )
        {
            $scope.showStartBtn = true;
            $interval.cancel(interationInterval);

        } 
        else 
        {

          iterations        -= 1;
          curIteration      += 1;
          curMonth          = 0;
          curDay            = 0;
          curHour           = 0;

          income            = 0;
          expense           = 0;
          jobs              = 0;

          counterMonth      = 0;
          counterDay        = 0;

          jobsPerYear       = SalesService.getJobsPerYear($scope.jobs, $scope.jobratio);

          for (var index in jobsPerYear) 
          {
            var releaseHoursMinusNovDec = hours - (720*5);
            jobsPerYear[index].releaseTime    = SalesService.getReleaseTime(releaseHoursMinusNovDec);
            sales.jobs[index]          = jobsPerYear[index];
          }

          sales.numJobs = Object.keys(sales.jobs).length;

          sales.releaseTimes = SalesService.buildReleaseSchedule(sales.jobs);


          for(var i=0;i<hours;i++)
          {
             hourSimulation(i);
          }


          totIncome                 += income;
          avgIncome                 = totIncome/curIteration;

          totExpense                += expense;
          avgExpense                = totExpense/curIteration;

          totJobs                   += jobs;
          avgJobs                   = totJobs/curIteration;

          $scope.avgIncome          = avgIncome;
          $scope.avgIncomeMo        = avgIncome / 12;

          $scope.avgExpense         = avgExpense;
          $scope.avgExpenseMo       = avgExpense / 12;

          $scope.avgJobs            = avgJobs;
          $scope.avgJobsMo          = avgJobs / 12;

          $scope.profit             = $scope.avgIncome - $scope.avgExpense;
          $scope.profitMo           = $scope.avgIncomeMo - $scope.avgExpenseMo;
          $scope.grossMargin        = ( ($scope.avgIncome - $scope.avgExpense) / $scope.avgIncome ) * 100;

          $scope.curIteration       = curIteration;
          $scope.chart              = chart;

          $scope.bob                = 4;
          $scope.sue                = 10000;

        }

      }
     
      function hourSimulation(hour)
      {

         tothour = hour * curIteration;

         counterMonth += 1;
         counterDay += 1;
         curHour += 1;

         if(counterDay==24)
         {
            counterDay = 0;
            curDay += 1;
         }

        /* expenses are always counting */
        expense += officeExpensePerHour;
        monthlyExpenses +=  officeExpensePerHour; //$scope.rate/2;

        if(monthly.jobData.monthlyTotals[curMonth] == undefined)
        {
          monthly.jobData.monthlyTotals[curMonth] = 0;
        }

        if(monthly.jobData.monthlyAverages[curMonth] == undefined)
        {
          monthly.jobData.monthlyAverages[curMonth] = 0;
        }

        if( sales.releaseTimes[hour] != undefined )
        {
          
          var jobsThisHour = sales.releaseTimes[hour];

          jobsThisHour.forEach(function(jobIdx)
          {

            jobs += 1;
            monthly.jobData.monthlyTotals[curMonth] += 1;
            monthly.jobData.monthlyAverages[curMonth] = monthly.jobData.monthlyTotals[curMonth] / curIteration;

            var newJob = sales.jobs[jobIdx];

            var handoffIncrement = newJob.handoff;
            newJob.handoff = hour + handoffIncrement;

            //add the job into the backlog
            backlog.jobs[jobIdx] = newJob;
            backlog.jobCount = Object.keys(backlog.jobs).length;

            //lets remove it from sales since its now a job
            delete sales.jobs[jobIdx];
            sales.numJobs = Object.keys(sales.jobs).length;

            //income += sales.jobs[jobIdx].hours * $scope.rate;
            //monthlyIncome += sales.jobs[jobIdx].hours * $scope.rate;

            /*
            $scope.backlog.jobs.push(newJob);
            $scope.backlog.jobCount = $scope.backlog.jobs.length;
            $scope.complete.potentialValue +=  Number((newJob.estimate).toFixed(2));
            */

          });
          
        } 

        if( backlog.jobCount > 0 )
        {

          for (var jobIdx in backlog.jobs)     
          {

            var thisBacklogJob = backlog.jobs[jobIdx];

            if( thisBacklogJob.handoff ==  hour )
            {

              //income += thisBacklogJob.hours * $scope.rate;
              //monthlyIncome += thisBacklogJob.hours * $scope.rate;

              //add the job into the design backlog
              design.jobs[jobIdx] = thisBacklogJob;
              design.jobCount = Object.keys(design.jobs).length;

              //remove it from the backlog
              delete backlog.jobs[jobIdx];
              backlog.jobCount = Object.keys(backlog.jobs).length;

            }

          }
         
        } 


        /* income only happens at certain hours of the day */
        /* create the work day */

        if(workingHours.indexOf(counterDay) >= 0 )
        {

          /* DESIGN STATION */
          if( design.jobCount > 0 )
          {

            var designJobKeys = Object.keys(design.jobs);

            for(var i=0; i < $scope.resources.designers; i++)
            {

              if( designJobKeys[i] != undefined )
              {
                
                var thisDesignJobIdx = designJobKeys[i];
                var thisDesignJob = design.jobs[thisDesignJobIdx];

                var designWorkHours = thisDesignJob.stations.design.hours;
                var designWorkHoursWorked = thisDesignJob.stations.design.hoursWorked;

                //console.log(designWorkHours + ' - ' + designWorkHoursWorked);

                if(designWorkHours <= 0)
                {
                  
                  development.jobs[thisDesignJobIdx] = thisDesignJob;
                  development.jobCount = Object.keys(development.jobs).length;

                  //remove it from the backlog
                  delete design.jobs[thisDesignJobIdx];
                  design.jobCount = Object.keys(design.jobs).length;


                } else {

                  var hourObj = DesignService.doWork(designWorkHours, designWorkHoursWorked);

                  //we update our job ticket
                  design.jobs[thisDesignJobIdx].stations.design.hours       = hourObj.hours;
                  design.jobs[thisDesignJobIdx].stations.design.hoursWorked = hourObj.hoursWorked;
                  design.jobs[thisDesignJobIdx].stations.design.log.push(hourObj.log);

                  //income += 1 * $scope.rate;
                  //monthlyIncome += 1 * $scope.rate;

                  //console.log( $scope.design.jobs[i] );

                }

              } else {

                //console.log('NO WORK FOR DESIGNER ' + i);
                
              }

            }

          } 


          /* DEVELOPMENT STATION */
          if( development.jobCount > 0 )
          {

            var developmentJobKeys = Object.keys(development.jobs);

            for(var i=0; i < $scope.resources.engineers; i++)
            {

              if( developmentJobKeys[i] != undefined )
              {
                
                var thisDevelopmentJobIdx = developmentJobKeys[i];
                var thisDevelopmentJob = development.jobs[thisDevelopmentJobIdx];

                var developmentWorkHours = thisDevelopmentJob.stations.development.hours;
                var developmentWorkHoursWorked = thisDevelopmentJob.stations.development.hoursWorked;

                if(developmentWorkHours <= 0)
                {
                  
                  thisDevelopmentJob.invoiceOn = InvoiceService.invoiceOn(hour);

                  complete.jobs[thisDesignJobIdx] = thisDevelopmentJob;
                  complete.jobCount = Object.keys(complete.jobs).length;

                  var designInvoice = SalesService.getCost( thisDevelopmentJob.stations.design.hoursEstimated );
                  var productionInvoice = SalesService.getCost( thisDevelopmentJob.stations.development.hoursEstimated );
                  var totalInvoice = designInvoice + productionInvoice;

                  complete.actualValue += totalInvoice;

                  //remove it from the backlog
                  delete development.jobs[thisDevelopmentJobIdx];
                  development.jobCount = Object.keys(development.jobs).length;

                } else {

                  var hourObj = ProductionService.doWork(developmentWorkHours, developmentWorkHoursWorked);

                  //we update our job ticket
                  development.jobs[thisDevelopmentJobIdx].stations.development.hours       = hourObj.hours;
                  development.jobs[thisDevelopmentJobIdx].stations.development.hoursWorked = hourObj.hoursWorked;
                  development.jobs[thisDevelopmentJobIdx].stations.development.log.push(hourObj.log);

                  //income += 1 * $scope.rate;
                  //monthlyIncome += 1 * $scope.rate;

                  //console.log( $scope.design.jobs[i] );

                }

              } else {

                //console.log('NO WORK FOR DEVELOPMENT');

              }

            }

          }

        }

        /* COMPLETE */
        if( complete.jobCount > 0 )
        {
          
          for (var completeJobIdx in complete.jobs)     
          {

            var thisCompletedJob = complete.jobs[completeJobIdx];

            if( thisCompletedJob.invoiceOn ==  hour )
            {
                thisCompletedJob.paidOn = InvoiceService.paidOn(hour);

                var designInvoice = SalesService.getCost( thisCompletedJob.stations.design.hoursEstimated );
                var productionInvoice = SalesService.getCost( thisCompletedJob.stations.development.hoursEstimated );
                var totalInvoice = designInvoice + productionInvoice;

                invoiced.jobs[completeJobIdx] = thisCompletedJob;
                invoiced.jobCount = Object.keys(invoiced.jobs).length;
                invoiced.money += totalInvoice;

                //remove it from the backlog
                delete complete.jobs[completeJobIdx];
                complete.jobCount = Object.keys(complete.jobs).length;

            }

          }

        }

        /* INVOICED */
        if( invoiced.jobCount > 0 )
        {
      
          for (var invoicedJobIdx in invoiced.jobs)     
          {

            var thisInvoicedJob = invoiced.jobs[invoicedJobIdx];

            if(thisInvoicedJob.paidOn == hour)
            {
                //var designInvoice = SalesService.getCost( thisInvoicedJob.stations.design.hoursEstimated );
                //var productionInvoice = SalesService.getCost( thisInvoicedJob.stations.development.hoursEstimated );
                //var totalInvoice = designInvoice + productionInvoice;

                var designHours = thisInvoicedJob.stations.design.hoursEstimated;
                var productionHours = thisInvoicedJob.stations.development.hoursEstimated;

                var totalHours = designHours + productionHours;

                paid.jobs[invoicedJobIdx] = thisInvoicedJob;
                paid.jobCount = Object.keys(paid.jobs).length;
                //paid.money += totalInvoice;

                //income += totalInvoice;
                //monthlyIncome += totalInvoice;
                

                income += totalHours * $scope.rate;
                monthlyIncome += totalHours * $scope.rate;

                //console.log(totalInvoice);
                //remove it from the backlog
                delete invoiced.jobs[invoicedJobIdx];
                invoiced.jobCount = Object.keys(invoiced.jobs).length;

            }

          }
          
        }

        if(counterMonth==720)
        {

          if(monthly.incomeData.monthlyTotals[curMonth] == undefined)
          {
            monthly.incomeData.monthlyTotals[curMonth] = 0;
          }

          if(monthly.expenseData.monthlyTotals[curMonth] == undefined)
          {
            monthly.expenseData.monthlyTotals[curMonth] = 0;
          }

          if(monthly.incomeData.monthlyAverages[curMonth] == undefined)
          {
            monthly.incomeData.monthlyAverages[curMonth] = 0;
          }

          if(monthly.expenseData.monthlyAverages[curMonth] == undefined)
          {
            monthly.expenseData.monthlyAverages[curMonth] = 0;
          }

          monthly.incomeData.monthlyTotals[curMonth] += monthlyIncome;
          monthly.expenseData.monthlyTotals[curMonth] += monthlyExpenses;

          monthly.incomeData.monthlyAverages[curMonth] = monthly.incomeData.monthlyTotals[curMonth] / curIteration;
          monthly.expenseData.monthlyAverages[curMonth] = monthly.expenseData.monthlyTotals[curMonth] / curIteration;

          var label = curMonth + 1;
          chart.labels[curMonth] = 'Month ' + label;
          chart.data[0] = monthly.incomeData.monthlyAverages;
          chart.data[1] = monthly.expenseData.monthlyAverages;

          counterMonth = 0;
          monthlyIncome = 0;
          monthlyExpenses = 0;

          curMonth += 1;
        }
        

        



      }

      $rootScope.title = 'Cool'

    });

})();