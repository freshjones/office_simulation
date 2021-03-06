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
