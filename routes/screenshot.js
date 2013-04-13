var app = require("../server.js").app
	, conf = app.get("conf");


exports.attach = function(app) {
	app.get('/screenshot', function(req, resp) {
		"use strict";
		
		var query, webshot, url, options, urlPartsArray = [], queryParameters, key;
		
		webshot = require('webshot');

		options = {
			screenSize: { width: 1024, height: 768 }, 
			shotSize: { width: 1024, height: 768 },
			userAgent: 'webshot on node.js'
		}
		
		queryParameters = req.query

		url = 'http://localhost:' + app.get('port') + '/';
		
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