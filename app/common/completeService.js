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