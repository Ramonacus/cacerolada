var Twitter = require('twitter');
var config = require('./config.js');
var noises = require('./noises.js');
var client = new Twitter(config);
var LIMIT_TIME = 15 * 60 * 1000;
var LIMIT_POST = 60;
var START_TIME_HOURS = 22;
var START_TIME_MINUTES = 0;
var MAX_TWEET_LENGTH = 140;

function publish() {
  var content = {
    status: noises.createNoises(MAX_TWEET_LENGTH)
  };

  console.log('Post started.');

  client.post('statuses/update', content, function (err, response) {
    if (err) {
      console.error('Handling error!');
      console.error(err);
    }
    else {
      console.log('Post successful.');
    }
  });
}

function getNextExecutionTime() {
  var now = new Date();
  var startTime = new Date();
  var waitingTime;

  startTime.setHours(START_TIME_HOURS);
  startTime.setMinutes(START_TIME_MINUTES);
  waitingTime = startTime.getTime() - now.getTime();

  while (waitingTime <= 0) {
    waitingTime += 24 * 60 * 60 * 1000;
  }

  console.log('Next CLANK-fest starts in ' + waitingTime / (60 * 1000) + ' minutes.');
  return waitingTime;
}

(function initialize() {
  setTimeout(function () {
    var publishInterval = setInterval(publish, LIMIT_TIME / LIMIT_POST);

    setTimeout(function () {
      clearInterval(publishInterval);
      initialize();
    }, LIMIT_TIME);
  }, getNextExecutionTime());
})();
