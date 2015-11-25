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