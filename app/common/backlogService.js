(function() {
  'use strict';

  function backlogService() 
  {

    var speed = 5000;

    return {
      
      setBacklog: function()
      {

        var backlog = {};

        backlog.jobs        = [];
        backlog.jobCount    = 0;
        backlog.speed       = speed;

        return backlog;

      },

      setHandoff: function()
      {

        
      }

    };

  }

  angular.module('common.backlog', [])
    .factory('BacklogService', backlogService);

})();
