var app = require("../server.js").app
	, conf = app.get("conf")
    , geoip = require('geoip-lite')
    , os = require('os');


// http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
function getCoordinates(req) {
	var ret;
	var geo = geoip.lookup(req.ip);
	if (!geo) {
		ret = {
			city: "San Francisco",
			ll: [122, 38]
		};
	}
	else {
		ret = {
			city: geo.city,
			ll: geo.ll
		};
	}
	return JSON.stringify(ret);
}

exports.attach = function(app) {
	app.get('/', function(req, res) {
  		res.render('index', {user: req.user, location: getCoordinates(req)});
	});

	app.get('/home', function(req, res) {
  		res.render('home', {user: req.user});
	});

	app.get('/privacy', function(req, res) {
  		res.render('privacy', {user: req.user});
	});

	app.get('/support', function(req, res) {
  		res.render('support', {user: req.user});
	});

	app.get('/tos', function(req, res) {
  		res.render('tos', {user: req.user});
	});

	app.get('/about', function(req, res) {
  		res.render('about', {user: req.user});
	});
};
