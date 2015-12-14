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