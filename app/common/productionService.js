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