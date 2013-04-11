var app = require("../server.js").app
	, conf = app.get("conf");

exports.attach = function(app) {
	app.get('/', function(req, res) {
  		res.render('index', {user: req.user});
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
