var app = require("../server.js").app
	, conf = app.get("conf")
	, request = require('request');

exports.attach = function(app) {
	app.get('/api/locationsearch', function(req, resp) {
		var query = req.query.q;
		console.log("locating", query);

		if (query instanceof Array) {
			var latlongs = [];

			var queryLength = query.length;

			query.forEach(function(data) {
				request.get("http://dev.virtualearth.net/REST/v1/Locations?q=" + encodeURIComponent(data) + "&key=" + conf.get("BING_MAPS_API"), function(err, res, body) {
					console.log(queryLength);
					body = JSON.parse(body);
					if (body.statusCode === 200 && body.resourceSets.length) {
						var coord = body.resourceSets[0].resources[0].point.coordinates;
						latlongs.push({
							query: data,
							latitude: coord[0],
							longitude: coord[1]
						});
					}
					else {
						resp.send({error: "Cannot get data"});
					}

					if (--queryLength === 0) {
						resp.send({
							coordinates: latlongs
						});
					}
				});
			});
		}
		else {
			request.get("http://dev.virtualearth.net/REST/v1/Locations?q=" + encodeURIComponent(query) + "&key=" + conf.get("BING_MAPS_API"), function(err, res, body) {
				body = JSON.parse(body);
				if (body.statusCode === 200 && body.resourceSets.length) {
					var coord = body.resourceSets[0].resources[0].point.coordinates;
					resp.send({
						coordinates: {
							query: query,
							latitude: coord[0],
							longitude: coord[1]
						}
					});
				}
				else {
					resp.send({error: "Cannot get data"});
				}
			});
		}
	});
};