var app = require("../server.js").app
	, conf = app.get("conf");

exports.attach = function(app) {
	app.get('/', function(req, res) {
  		res.render('index');
	});

	app.get('/home', function(req, res) {
  		res.render('home');
	});

	app.get('/privacy', function(req, res) {
  		res.render('privacy');
	});

	app.get('/support', function(req, res) {
  		res.render('support');
	});

	app.get('/tos', function(req, res) {
  		res.render('tos');
	});

	app.get('/about', function(req, res) {
  		res.render('about');
	});
};
