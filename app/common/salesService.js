(function() {
  'use strict';

  function salesService() 
  {

    var rate = 125;

    function generateUUID(){
        var d = new Date().getTime();
        if(window.performance && typeof window.performance.now === "function"){
            d += performance.now();; //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    }  

    function randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

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
          min = 25;
          max = 72;
        break;

        case 'large':
          min = 73;
          max = 168;
        break;

      }

      /*
        
      */
      return randomIntFromInterval(min,max)

    }

    function getAJob(ratio)
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

      var large = ratio;
      var small = 10 - ratio;

      var options = [];

      for(var i=0; i<small; i++)
      {
        options.push('small');
      }

      for(var i=0; i<5; i++)
      {
        options.push('medium');
      }

      for(var i=0; i<large; i++)
      {
        options.push('large');
      }

      //console.log(options);
      //['small','medium','medium','large','large','large','large','large'];

      var num = Math.floor(Math.random() * 15);

      var size          = options[num];
      var hours         = 2; //getJobHours(size);
      var handoff       = 1; //getHandoff(size);
      var workstations  = getWorkstations(hours);

      job.size        = size;
      job.hours       = hours;
      job.estimate    = hours * rate;
      job.handoff     = handoff;
      job.stations    = workstations;

      return job;

    }

    function getWorkstations(hours)
    {
      var workstations, designHours,developmentHours;

      workstations = {};

      designHours = 1;

      if(hours > 2)
      {
        var randSplit = randomIntFromInterval(2,3);
        designHours       = Math.floor(hours / randSplit);
      }

      developmentHours  = Math.floor(hours - designHours);
      workstations.design = {'hoursEstimated':designHours, 'hoursWorked':0, 'hours':designHours,'log':[] }
      workstations.development = {'hoursEstimated':developmentHours, 'hoursWorked':0, 'hours':developmentHours, 'log':[] }

      return workstations

    }

    function getJobsPerYear(numJobs, ratio)
    {
      var i, jobs;

      jobs = {};

      for(i = 0; i<numJobs; i++)
      {

        var job = getAJob(ratio);

        var jobID = generateUUID();

        jobs[jobID] = job;

      }

      return jobs;

    }

    function getJobs(numJobs, ratio)
    {
      
      var jobsPerYear = getJobsPerYear(numJobs, ratio);

      /*
      var numJobsPerYear = Object.keys(jobsPerYear).length;
      
      for (var key in jobsPerYear) 
      {
        jobsPerYear[key].month = 1;
      }

      console.log(jobsPerYear);
      */
      return jobsPerYear;

    }
   
    return {
      
      getJobsPerYear: function(numJobs, ratio) {

        return getJobs(numJobs, ratio);

      },

      getReleaseTime : function(hours)
      {
        return randomIntFromInterval(1,hours);
      },

      buildReleaseSchedule : function(jobs)
      {
        /*THIS IS NOT WORKING BECUSE JOBS HAVE SAME RELEASE TIME!*/
        var releaseTimes = {};
        for (var index in jobs)     
        {
          if( releaseTimes[jobs[index].releaseTime] == undefined)
          {
            releaseTimes[jobs[index].releaseTime] = [];
          }
          releaseTimes[jobs[index].releaseTime].push(index);
        }

        return releaseTimes;
      },

      getCost : function(hours)
      {
        return Number((hours * rate).toFixed(2));
      },

    };

  }

  angular.module('common.sales', [])
    .factory('SalesService', salesService);

})();