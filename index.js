var Twitter = require('twitter');
var config = require('./config.js');
var noisesList = require('./noises.js');
var client = new Twitter(config);
var sinceId = null;
var replyQueue = [];
var LIMIT_TIME = 15 * 60 * 1000;
var LIMIT_POST = 90;
var LIMIT_GET = 10;

function getRandomNoise() {
  return noisesList[Math.floor(Math.random() * noisesList.length)];
}

function createNoises(startsWith) {
  var noise = startsWith || getRandomNoise();
  var maxLength = 140;
  var next = noise + ' ' + getRandomNoise();

  while (next.length < maxLength) {
    noise = next;
    next = noise + ' ' + getRandomNoise();
  }

  return noise;
}

function publish() {
  var content = {};
  var replyTo;
  do {
    replyTo = replyQueue.shift();
  }
  while (replyTo && !!replyTo.retweeted_status);

  console.log('Post started.')
  if (replyTo) {
    console.log('Reply to: @' + replyTo.user.screen_name);
    console.log('Current queue length: ' + replyQueue.length);
    content.status = createNoises('@' + replyTo.user.screen_name);
    content.in_reply_to_status_id = ''  + replyTo.id_str;
  }
  else {
    content.status = createNoises();
  }

  client.post('statuses/update', content, function (err, response) {
    if (err) {
      handleError(err);
    }
    else {
      console.log('Post successful.')
      if (!sinceId) {
        sinceId = response.id;
        search();
      }
    }
  });
}

function search() {
  if (!!sinceId) {
    console.log('Search started.');
    client.get('search/tweets', {
      q: 'cacerolada',
      since_id: sinceId
    }, function (err, response) {
      console.log('Search response received.');
      if (err) {
        handleError(err);
      }
      else {
        sinceId = response.search_metadata.max_id || sinceId;
        replyQueue = replyQueue.concat(response.statuses);
        console.log('Current queue length: ' + replyQueue.length);
      }
    });
  }
}

function handleError(err) {
  console.error('Handling error!');
  console.error(err);
}

(function initialize() {
  var searchInterval = setInterval(search, LIMIT_TIME / LIMIT_GET);
  var publishInterval = setInterval(publish, LIMIT_TIME / LIMIT_POST);
  setTimeout(function () {
    clearInterval(searchInterval);
    clearInterval(publishInterval);
  }, LIMIT_TIME);
})();
