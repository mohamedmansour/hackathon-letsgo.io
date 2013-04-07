var app = require("../server.js").app
	, conf = app.get("conf")
	, request = require('request');

exports.attach = function(app) {
	app.get('/api/locationsearch', function(req, resp) {
		var query = req.query.q;
		console.log("locating", query);
		request.get("http://dev.virtualearth.net/REST/v1/Locations?q=" + query + "&key=" + conf.get("BING_MAPS_API")).pipe(resp);
	});
};