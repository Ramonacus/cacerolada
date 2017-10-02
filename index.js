var Twitter = require('twitter');
var config = require('./config.js');
var client = new Twitter(config);
var sinceId = null;
var replyQueue = [];
var LIMIT_TIME = 15 * 60 * 1000;
var LIMIT_POST = 90;
var LIMIT_GET = 10;
var startTime = new Date();

var noisesList = [
  'BAM',
  'BANG',
  'CACHAPLÚN',
  'CACHING',
  'CACHONK',
  'CARRACRAC',
  'CATACROC',
  'CHUNDA',
  'CHUNDA TACHUNDA',
  'CLAC',
  'CLAN',
  'CLANCH',
  'CLANG',
  'CLANK',
  'CLEC',
  'CLEN',
  'CLENCH',
  'CLENG',
  'CLENK',
  'CLIC',
  'CLIN',
  'CLINCH',
  'CLING',
  'CLINK',
  'CLOC',
  'CLON',
  'CLONCH',
  'CLONG',
  'CLONK',
  'CLUC',
  'CLUN',
  'CLUNCH',
  'CLUNG',
  'CLUNK',
  'DOOOONG',
  'DONG',
  'GAN',
  'GAAAN',
  'GON',
  'GONG',
  'GOOONG',
  'KANG',
  'KONCH',
  'NANG',
  'NAAAANG',
  'RAKA RAKA RAKA',
  'TIC',
  'TIIING',
  'TIING',
  'TING',
  'TOC',
  'PATAPÚN',
  'PONCH',
  'PUNCHI',
  'PLAC',
  'PLAK',
  'PLING',
  'PLONK',
  'ZOING',
  'ZONK'
];

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

function getNextTimeout(){
	var now = new Date();
	var waitingTime;
	startTime.setHours(22);
	startTime.setMinutes(0);
	waitingTime = startTime.getTime() - now.getTime();

	if(waitingTime < 0){
		startTime.setDate(startTime.getDate + 1);
		getNextTimeout();
	}

	console.log('Next search starts in '  + waitingTime/(60*1000) + ' minutes.');
	return waitingTime;
}

(function initialize() {
	var nextEjecTime = getNextTimeout();
	
	setTimeout(function(){
		var searchInterval = setInterval(search, LIMIT_TIME / LIMIT_GET);
		var publishInterval = setInterval(publish, LIMIT_TIME / LIMIT_POST);
		setTimeout(function () {
		  clearInterval(searchInterval);
		  clearInterval(publishInterval);
		  initialize();
		}, LIMIT_TIME);
	}, nextEjecTime);
})();
