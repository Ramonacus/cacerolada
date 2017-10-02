var Twitter = require('twitter');
var config = require('./config.js');
var noisesList = require('./noises.js');
var client = new Twitter(config);
var LIMIT_TIME = 15 * 60 * 1000;
var LIMIT_POST = 60;

function getRandomNoise() {
  return noisesList[Math.floor(Math.random() * noisesList.length)];
}

function createNoises() {
  var maxLength = 140;
  var next = getRandomNoise();
  var noise;

  do {
    noise = next;
    next += ' ' + getRandomNoise();
  } while (next.length < maxLength);

  return noise;
}

function publish() {
  var content = {
    status: createNoises()
  };

  console.log('Post started.');

  client.post('statuses/update', content, function (err, response) {
    if (err) {
      handleError(err);
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

  startTime.setHours(22);
  startTime.setMinutes(0);
  waitingTime = startTime.getTime() - now.getTime();

  while (waitingTime <= 0) {
    waitingTime += 24 * 60 * 60 * 1000;
  }

  console.log('Next search starts in ' + waitingTime / (60 * 1000) + ' minutes.');
  return waitingTime;
}

function handleError(err) {
  console.error('Handling error!');
  console.error(err);
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
