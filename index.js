var request = require('request');
var cheerio = require('cheerio');
// CONFIGURATION BELOW
var twilio = require('twilio')('YOUR_KEY', 'YOUR_TOKEN');

var keywords = []; // empty array to check for all keywords
var toNumber = '+320000000000';
var fromNumber = '+320000000000';
// END CONFIGURATION

var currentTitle = '';


getIbood();

function getIbood() {
	console.log('Fetch ibood');
	request('http://www.ibood.com/be/nl/', function(err, res, body) {
		var $ = cheerio.load(body);
		if(currentTitle !== $('title').text()) {
			currentTitle = $('title').text();
			console.log('New title: ' + currentTitle);
			matchTitle(currentTitle);
		} else {
			console.log('No change');
		}

		setTimeout(function() {
			getIbood();

		}, 10*1000);


	});

}

function matchTitle(title) {
	if(keywords.length === 0) {
		sendSms(title);
	} else {
		keywords.forEach(function(keyword) {
			if(title.toLowerCase().indexOf(keyword) !== -1) {
				sendSms(title);
			}
		})
	}

}

function sendSms(title) {
	console.log('MATCH - send SMS');
	twilio.sendMessage({
		to: toNumber, // Any number Twilio can deliver to
		from: fromNumber, // A number you bought from Twilio and can use for outbound communication
		body: title // body of the SMS message
	}, function(err, responseData) {	
		//console.log(responseData);

	})
}