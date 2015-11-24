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
        cash.money            = 0;
        cash.moneyOut         = 0;

        return cash;

      }


    };

  }

  angular.module('common.cash', [])
    .factory('CashService', cashService);

})();