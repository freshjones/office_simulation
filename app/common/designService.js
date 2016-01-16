(function() {
  'use strict';

  function designService() 
  {


    return {
      
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