(function() {
  'use strict';

  function daysService() {

    var hourSpeed = 10;
    var iterationSpeed = 1000;
    var rate = 125;
    var startupCapital = 0;
    var invoice_terms = [0,30];
    var net_terms = [30,90];

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

    function getInvoiceOn(hours)
    {
      
      var time = randomIntFromInterval(invoice_terms[0],invoice_terms[1]);

      return hours + (time * 24);

    }


    function getPaidOn(hours)
    {
      
      var time = randomIntFromInterval(net_terms[0],net_terms[1]);

      return hours + (time * 24);

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

      var num = 1;//Math.floor(Math.random() * 3);

      var size          = options[num];
      var hours         = 1; //getJobHours(size);
      var handoff       = 1; //getHandoff(size);
      var workstations  = getWorkstations(hours);

      job.size        = size;
      job.hours       = hours;
      job.estimate    = hours * rate;
      job.handoff     = handoff;
      job.stations    = workstations;

      //console.log(job);
      return job;

    }

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


    function buildJobs(val)
    {

      var data = {};
      var i;
      for(i=0;i<val;i++)
      {

        var job = getAJob();

        var jobkey = generateUUID();

        data[jobkey] = job;

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
          /*
          var release = {};
          release.time = num;
          release.jobIdx = index;
          */
          releaseTimes[index] = num;
      });
        
      return releaseTimes;

    }

    return {
      
      period : function(numDays,numIterations)
      {

        var period = {};
        
        period.iterations          = numIterations;
        period.curIteration        = 0;
        period.iterationSpeed      = iterationSpeed;

        period.totalhours          = numDays * 24;
        period.days                = numDays;
        period.hours               = numDays * 24;
        period.currentDay          = 1;
        period.currentHour         = 1;
        period.currentMonth        = 1;
        period.hourSpeed           = hourSpeed;
        period.hourCounter         = 0;
        period.monthCounter        = 0;
        period.monthTotalCounter   = 0;
        period.startupCapital      = startupCapital;
        period.hourTotalCount      = 0;
        period.workingHours        = [8,9,10,11,12,13,14,15,16];

        //var numJobs                = 50; //setNumJobs(numDays);
        //var jobdata                = 
        period.numJobs             = 0;
        period.jobs                = {};
        period.releaseTimes        = {}; //buildReleaseTimes(period.hours,jobdata);

        return period;

      },

      getNumJobs : function(days)
      {
        return 50; //setNumJobs(days);
      },

      setJobs : function(numJobs)
      {
        return buildJobs(numJobs);
      },

      buildReleaseSchedule : function(jobs)
      {
        var releaseTimes = {};
        for (var index in jobs)     
        {
          releaseTimes[jobs[index].releaseTime] = index;
        }

        return releaseTimes;
      },

      getReleaseTime : function(hours)
      {
        return randomIntFromInterval(1,hours);
      },

      getCost : function(hours)
      {

        return Number((hours * rate).toFixed(2));
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

  angular.module('common.days', [])
    .factory('DaysService', daysService);

})();
