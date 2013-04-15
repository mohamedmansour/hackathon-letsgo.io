var app = require("../server.js").app
	, conf = app.get("conf");


exports.attach = function(app) {
	app.get('/screenshot', function(req, resp) {
		"use strict";
		var query, webshot, url, options, urlPartsArray, queryParameters, key;
		
		webshot = require('webshot');

		// This function will be executed in the context of the page being screenshot
		var showToFromOverlay = function() {
			document.getElementById('welcomeScreen').style.display = 'block'; 
			document.getElementsByTagName('header')[0].style.visibility = 'hidden';
			
			_gaq.push(['_trackEvent', 'App', 'Screenshot', getUrl()]);
		}

		// This function will be executed in the context of the page being screenshot
		var dontShowToFromOverlay = function() {
			_gaq.push(['_trackEvent', 'App', 'Screenshot', getUrl()]);
		}	

		// Other options here: https://github.com/brenden/node-webshot
		options = {
			screenSize: { width: 1500, height: 900 }
			, shotSize: { width: 1500, height: 900 }
			, userAgent: 'webshot on node.js'//
			//, renderDelay: 500
			, script: dontShowToFromOverlay
		};
		
		queryParameters = req.query;

		url = 'http://' + (req.headers.host || 'localhost' + ':' + app.get('port')) + '/';
		urlPartsArray = [
			"nf=1", // Don't fade in circle photos
			"ScreenShot=true" // Used in Google Analytics to know this query is for a screenshot
		];
		
		// Copy all query parameters from the current url, to the url we will grab
		for (key in queryParameters) { urlPartsArray.push(key + '=' + queryParameters[key]); }
		
		// If there are parameters, join & append them
		if (urlPartsArray.length) { url += "?" + urlPartsArray.join('&'); }
		
		if (urlPartsArray.to && urlPartsArray.to.length && urlPartsArray.q && urlPartsArray.q.length) { options.script = showToFromOverlay; }
		
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