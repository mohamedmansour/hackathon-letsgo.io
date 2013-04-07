var app = require("../server.js").app,
	conf = app.get("conf");

exports.index = function(req, res) {
	res.send("Authenticating to server  " + conf.get("FACEBOOK_APP_ID"));
};