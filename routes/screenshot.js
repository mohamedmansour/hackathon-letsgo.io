var app = require("../server.js").app
	, conf = app.get("conf");


exports.attach = function(app) {
	app.get('/screenshot', function(req, resp) {
		"use strict";
		
		var query, webshot, url, options, urlPartsArray, queryParameters, key;
		
		webshot = require('webshot');


		// Other options here: https://github.com/brenden/node-webshot
		options = {
			screenSize: { width: 1500, height: 900 }, 
			shotSize: { width: 1500, height: 900 },
			userAgent: 'webshot on node.js'//,
			//renderDelay: 500,
			//script: function() {
			//	setTimeout(appDeactivate,1000);
			//}
		}
		
		queryParameters = req.query

		url = 'http://' + (req.headers.host || 'localhost' + ':' + app.get('port')) + '/';
		urlPartsArray = [
			"nf=1", // Don't fade in circle photos
			"ScreenShot=true" // Used in Google Analytics to know this query is for a screenshot
		];
		
		// Copy all query parameters from the current url, to the url we will grab
		for (key in queryParameters) { urlPartsArray.push(key + '=' + queryParameters[key]); }
		
		// If there are parameters, join & append them
		if (urlPartsArray.length) { url += "?" + urlPartsArray.join('&'); }
		
		resp.type("image/png");
		webshot(url, options, function(err, renderStream) {
			
			// Copy chunks of the image data until finished
			renderStream.on('data', function(data) {
				resp.write(data.toString('binary'),'binary')
			});

			// Send response & close stream
			renderStream.on('end', function() {
				resp.end();
			});
		  
		});
	});
};