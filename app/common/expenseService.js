(function() {
  'use strict';

  function expenseService() 
  {

    var days = 360;
    var hours = 360 * 24;

    function getMonthlyExpenses()
    {
      
     return 25000;

    }

    function getYearlyExpenses()
    {
      
       var monthly = getMonthlyExpenses();
      
      return monthly * 12;
      

    }

    function getHourlyExpenses() {

        var yearly = getYearlyExpenses();
        
        var hourlyCost = Math.ceil(yearly / hours);

        return hourlyCost;

      }
    
   
    return {
      
      getOfficeExpensesPerHour: function() {

        return getHourlyExpenses();

      }

    };

  }

  angular.module('common.expense', [])
    .factory('ExpenseService', expenseService);

})();