(function() {
  'use strict';

  function invoiceService() 
  {

    var avgSalary = 45000;
    var resources = 1;
    var overhead  = 10000;

    var invoice_terms = [0,30];
    var net_terms = [30,90];

    function fluxuateCosts(cost)
    {

      var min,max;

      min = cost - 5000;
      max = cost + 5000;

      return cost; //Math.floor(Math.random()*(max-min+1)+min);

    }

    function getInvoiceOn(hours)
    {
      
      var time = randomIntFromInterval(invoice_terms[0],invoice_terms[1]);

      var invoiceOn = hours + (time * 24);

      if(invoiceOn >= 8640)
      {
        invoiceOn = invoiceOn - 8640;
      }

      return invoiceOn;
      
    }

    function getPaidOn(hours)
    {
      
      var time = randomIntFromInterval(net_terms[0],net_terms[1]);

      var paidOn = hours + (time * 24);

      if(paidOn >= 8640)
      {
        paidOn = paidOn - 8640;
      }

      return paidOn;

    }

    function randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
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
      },

      invoiceOn : function(hours)
      {
        return  getInvoiceOn(hours);
      },

      paidOn : function(hours)
      {
        return  getPaidOn(hours);
      }

    };

  }

  angular.module('common.invoice', [])
    .factory('InvoiceService', invoiceService);

})();