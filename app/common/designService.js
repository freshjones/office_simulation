(function() {
  'use strict';

  function designService() 
  {

    var speed = 5000;

    return {
      
      setDesign: function()
      {

        var design = {};

        design.jobs      = [];
        design.jobCount  = 0;
        design.speed     = speed;

        return design;

      }

    };

  }

  angular.module('common.design', [])
    .factory('DesignService', designService);

})();