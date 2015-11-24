(function() {
  'use strict';

  function designService() 
  {

    var speed = 5000;
    var avgSalary = 45000;

    return {
      
      setDesign: function()
      {

        var design = {};

        design.jobs           = [];
        design.jobCount       = 0;
        design.speed          = speed;
        design.costperhour    = (avgSalary / 365) / 24;
        design.cost           = 0;

        return design;

      }

    };

  }

  angular.module('common.design', [])
    .factory('DesignService', designService);

})();