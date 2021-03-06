(function() {
  'use strict';

  function invoiceService() 
  {

    var avgSalary = 45000;
    var resources = 1;
    var overhead  = 10000;

    function fluxuateCosts(cost)
    {

      var min,max;

      min = cost - 5000;
      max = cost + 5000;

      return cost; //Math.floor(Math.random()*(max-min+1)+min);

    }

    return {
      
      setInvoice: function()
      {

        var invoice = {};

        invoice.jobs             = [];
        invoice.jobCount         = 0;
        invoice.potentialValue   = 0;
        invoice.money            = 0;
        invoice.costs            = (((avgSalary / 365) * 30) * resources) + overhead;

        return invoice;

      },

      getMonthlyOpCosts: function(cost)
      {
        return fluxuateCosts(cost);
      }


    };

  }

  angular.module('common.invoice', [])
    .factory('InvoiceService', invoiceService);

})();