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
      DaysService
      )
    {
      
      var interationInterval;

      var iterations,curIteration,days,hours,rate,income,expense;

      var chart               = {};

      chart.labels = [];
      chart.series = ['Income', 'Expenses'];
      chart.data = [];
      chart.data[0] = [];
      chart.data[1] = [];

      var totIncome           = 0;
      var avgIncome           = 0;

      var totExpense          = 0;
      var avgExpense          = 0;

      var counterMonth        = 0;
      var counterDay          = 0;

      var curIteration        = 0;
      var curMonth            = 0;
      var curDay              = 0;
      var curHour             = 0;

      $scope.showStartBtn     = true;
      
      $scope.curIteration     = curIteration;
      //$scope.curMonth          = curMonth;

      $scope.avgIncome        = avgIncome;
      $scope.avgExpense        = avgExpense;

      $scope.runSim = function()
      {
        
        iterations    = 2;
        days          = 365;

        hours         = days * 24;
        curIteration  = 0;
       
        rate          = 100;
        totIncome     = 0;
        avgIncome     = 0;
        totExpense    = 0;
        avgExpense    = 0;

        counterMonth  = 0;
        counterDay    = 0;

        //hide run button
        $scope.showStartBtn       = false;
        $scope.avgIncome          = avgIncome;
        $scope.avgExpense         = avgExpense;
        $scope.curIteration       = curIteration;
        

        interationInterval        = $interval(runInterations, 1000);

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
          curHour         = 0;
          income          = 0;
          expense         = 0;
          curMonth        = 0;

          counterMonth    = 0;
          counterDay      = 0;

          for(var i=0;i<hours;i++)
          {
             hourSimulation(i)

             counterMonth += 1;
             
             if(counterMonth==730)
             {
              counterMonth = 0;
              curMonth += 1;

              chart.data[0].push(income);
              chart.data[1].push(expense);
              
              chart.labels.push('Month ' + curMonth );

              console.log(chart);
              //$scope.curMonth = curMonth;

             }

          }

          totIncome += income;
          avgIncome = totIncome/curIteration;

          totExpense += expense;
          avgExpense = totExpense/curIteration;

          $scope.avgIncome        = avgIncome;
          $scope.avgExpense       = avgExpense;
          $scope.curIteration     = curIteration;
          $scope.chart            = chart;
         
        }

      }
     
      function hourSimulation(hour)
      {

        curHour += 1;
        
        income += rate;
        expense += 50;

      }

      $rootScope.title = 'Cool'

    });

})();