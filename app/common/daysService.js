(function() {
  'use strict';

  function daysService() {

    var hourSpeed = 10;

    function getJobHours(size)
    {
      var min,max;

      switch(size)
      { 

        case 'small':
          min = 2;
          max = 5;
        break;
        
        case 'medium':
          min = 15;
          max = 60;
        break;

        case 'large':
          min = 80;
          max = 200;
        break;

      }

      return randomIntFromInterval(min,max)

    }

    function getHandoff(size)
    {
      var min,max;

      switch(size)
      { 

        case 'small':
          min = 4;
          max = 24;
        break;
        
        case 'medium':
          min = 24;
          max = 72;
        break;

        case 'large':
          min = 72;
          max = 168;
        break;

      }

      return randomIntFromInterval(min,max)

    }

    function getWorkstations(hours)
    {
      var workstations, designHours,developmentHours;

      workstations = [];

      designHours = 1;

      if(hours > 2)
      {
        var randSplit = randomIntFromInterval(2,3);
        designHours       = Math.floor(hours / randSplit);
      }

      developmentHours  = Math.floor(hours - designHours);
     
      workstations[0] = {'name':'design','hours':designHours}
      workstations[1] = {'name':'development','hours':developmentHours}

      return workstations

    }


    function getAJob()
    {
      
      //we have just recieved a job we can start on we now need to know
      /*
      1) [GOOD] When will we start the job (random based on job size)
      2) [GOOD] What is the path it will take through our shop (assume we hit all workstations)
      3) [GOOD] How long will each workstation require (random)
      4) When will we finish the job (random based on how long each workstation needs)
      5) [GOOD] what is the cost of the job (total hours * hourly rate)
      6) [GOOD] How many total hours were estimated (total hours estimated per workstation)
      */

      var job = {};

      var options = ['small','medium','large'];

      var num = Math.floor(Math.random() * 3);

      var size          = options[num];
      var hours         = getJobHours(size);
      var handoff       = getHandoff(size);
      var workstations  = getWorkstations(hours);

      job.size        = size;
      job.hours       = hours;
      job.estimate    = hours * 125;
      job.handoff     = handoff;
      job.stations    = workstations;

      //console.log(job);
      return job;

    }

    function buildJobs(val)
    {

      var data = [];
      var i;
      for(i=0;i<val;i++)
      {

        var job = getAJob();
        
        data.push(job);

      };

      return data;
    
    }

    function randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    function setNumJobs(numDays)
    {

      var jobsPerYear = 50;
      var jobsPerDay =  Math.round((jobsPerYear / 365)*100)/100;

      var avgJobsPerPeriod =  Math.ceil(jobsPerDay * numDays);

      var min = 1;
      var max = 2;

      if(avgJobsPerPeriod >= 3)
      {
        min = avgJobsPerPeriod - Math.floor((avgJobsPerPeriod*50)/100);
      }

      max = avgJobsPerPeriod + Math.ceil((avgJobsPerPeriod*50)/100);

      return randomIntFromInterval(min,max);

    }

    function buildReleaseTimes(numHours,jobData)
    {

      var releaseTimes = [];

      jobData.forEach(function(entry, index) 
      { 
          var num = randomIntFromInterval(1,numHours);

          releaseTimes[num] = index;
      });
        
      return releaseTimes;

    }

    return {
      
      period : function(numDays)
      {

        var period = {};
        period.days                = numDays;
        period.hours               = numDays * 24;
        period.currentDay          = 1;
        period.currentHour         = 1;
        period.hourSpeed           = hourSpeed;
        period.hourCounter         = 0;
        period.hourTotalCount      = 0;

        var numJobs                = setNumJobs(numDays);
        var jobdata                = buildJobs(numJobs);
       
        period.jobs                = jobdata;
        period.releaseTimes        = buildReleaseTimes(period.hours,jobdata);

        return period;

      }

    };

  }

  angular.module('common.days', [])
    .factory('DaysService', daysService);

})();