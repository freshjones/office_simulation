(function() {

  'use strict';

  var app = angular.module("SimApp", 
    [ 
      'common.days',
      'common.chart',
      'chart.js',
      'chart'
    ])

    .controller('MainCtrl', function(
      $rootScope, 
      $scope, 
      $interval, 
      $log,
      DaysService
      )
    {
      
      $scope.bob = 0;
      $scope.sue = 0;

      var interationInterval;

      var iterations,curIteration,days,hours,rate,income,expense;

      var chart                           = {};

      var monthlyIncomeData               = {};
      monthlyIncomeData.monthlyTotals     = [];
      monthlyIncomeData.monthlyAverages   = [];
      
      var monthlyExpenseData              = {};
      monthlyExpenseData.monthlyTotals    = [];
      monthlyExpenseData.monthlyAverages  = [];

      chart.labels                        = [];
      chart.series                        = ['Income', 'Expenses'];
      chart.data                          = [];
      chart.data[0]                       = [];
      chart.data[1]                       = [];

      var totIncome                       = 0;
      var avgIncome                       = 0;

      var totExpense                      = 0;
      var avgExpense                      = 0;

      var counterMonth        = 0;
      var counterDay          = 0;

      var curIteration        = 0;
      var curMonth            = 0;
      var curDay              = 0;
      var curHour             = 0;
      var workingHours        = [8,9,10,11,12,13,14,15];
      var monthlyIncome       = 0;
      var monthlyExpenses     = 0;

      $scope.showStartBtn     = true;
      
      $scope.curIteration     = curIteration;
      //$scope.curMonth          = curMonth;

      $scope.avgIncome        = avgIncome;
      $scope.avgIncomeMo      = avgIncome / 12;

      $scope.avgExpense        = avgExpense;
      $scope.avgExpenseMo      = avgExpense / 12;
      
      $scope.rate              = 125;

      $scope.profit             = 0;
      $scope.profitMo           = 0;
      $scope.grossMargin       = 0;


      $scope.runSim = function()
      {
        
        iterations    = 5;
        days          = 360;

        hours         = days * 24;
        curIteration  = 0;

        
        totIncome     = 0;
        avgIncome     = 0;
        totExpense    = 0;
        avgExpense    = 0;

        counterMonth  = 0;
        counterDay    = 0;

        monthlyIncomeData.monthlyTotals   = [];
        monthlyIncomeData.monthlyAverages = [];
      
        monthlyExpenseData.monthlyTotals   = [];
        monthlyExpenseData.monthlyAverages = [];

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

          iterations      -= 1;
          curIteration    += 1;
          curMonth        = 0;
          curDay          = 0;
          curHour         = 0;

          income          = 0;
          expense         = 0;

          counterMonth    = 0;
          counterDay      = 0;

          for(var i=0;i<hours;i++)
          {
             
             hourSimulation(i);

          }

          totIncome += income;
          avgIncome = totIncome/curIteration;

          totExpense += expense;
          avgExpense = totExpense/curIteration;

          $scope.avgIncome          = avgIncome;
          $scope.avgIncomeMo        = avgIncome / 12;

          $scope.avgExpense         = avgExpense;
          $scope.avgExpenseMo       = avgExpense / 12;

          $scope.profit             = $scope.avgIncome - $scope.avgExpense;
          $scope.profitMo           = $scope.avgIncomeMo - $scope.avgExpenseMo;
          $scope.grossMargin        = ( ($scope.avgIncome - $scope.avgExpense) / $scope.avgIncome ) * 100;

          $scope.curIteration       = curIteration;
          $scope.chart              = chart;

          $scope.bob = 4;
          $scope.sue = 10000;

        }

      }
     
      function hourSimulation(hour)
      {


         counterMonth += 1;
         counterDay += 1;
         curHour += 1;

         if(counterDay==24)
         {
            counterDay = 0;
            curDay += 1;
         }

        if(workingHours.indexOf(counterDay) >= 0 )
        {
          income += $scope.rate;
          monthlyIncome += $scope.rate;

          expense += $scope.rate/2;
          monthlyExpenses += $scope.rate/2;
        }

         if(counterMonth==720)
         {

            if(monthlyIncomeData.monthlyTotals[curMonth] == undefined)
            {
              monthlyIncomeData.monthlyTotals[curMonth] = 0;
            }

            if(monthlyExpenseData.monthlyTotals[curMonth] == undefined)
            {
              monthlyExpenseData.monthlyTotals[curMonth] = 0;
            }

            if(monthlyIncomeData.monthlyAverages[curMonth] == undefined)
            {
              monthlyIncomeData.monthlyAverages[curMonth] = 0;
            }

            if(monthlyExpenseData.monthlyAverages[curMonth] == undefined)
            {
              monthlyExpenseData.monthlyAverages[curMonth] = 0;
            }

            monthlyIncomeData.monthlyTotals[curMonth] += monthlyIncome;
            monthlyExpenseData.monthlyTotals[curMonth] += monthlyExpenses;

            monthlyIncomeData.monthlyAverages[curMonth] = monthlyIncomeData.monthlyTotals[curMonth] / curIteration;
            monthlyExpenseData.monthlyAverages[curMonth] = monthlyExpenseData.monthlyTotals[curMonth] / curIteration;

            var label = curMonth + 1;
            chart.labels[curMonth] = 'Month ' + label;
            chart.data[0] = monthlyIncomeData.monthlyAverages;
            chart.data[1] = monthlyExpenseData.monthlyAverages;

            counterMonth = 0;
            monthlyIncome = 0;
            monthlyExpenses = 0;

            curMonth += 1;
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

  function daysService() 
  {
    return {};

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