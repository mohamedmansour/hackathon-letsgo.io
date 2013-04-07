var app = require("../server.js").app
	, conf = app.get("conf")
    , azure = require('azure')
    , async = require('async')
    , User = require('../models/user.js');


var user = new User(
    azure.createTableService(conf.get("STORAGE_NAME"), conf.get("STORAGE_KEY"))
    , conf.get("TABLE_NAME")
    , conf.get("PARTITION_KEY"));


var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: conf.get('FACEBOOK_APP_ID'),
    clientSecret: conf.get('FACEBOOK_APP_SECRET'),
    callbackURL: conf.get('FACEBOOK_CALLBACK_URL')
  },
  function(accessToken, refreshToken, profile, done) {
	
	profile.accessToken = accessToken;

	findOrCreateUser(profile);

	return done(null, profile);
  }
));


exports.attach = function(app){
	app.get('/auth', passport.authenticate('facebook'));
	app.get('/auth/callback', passport.authenticate('facebook', { successRedirect: '/home'}));
	app.get('/auth/logout', function(req, res){ 
		req.logout();
  		res.redirect('/');
	});
}


function findOrCreateUser (profile){
	var query = azure.TableQuery
      .select()
      .from(user.tableName)
      .where('FacebookID eq ?', profile.id);

    user.find(query, function (err, items) {
		//console.log("found query", items, "err", err);
		if (!err) {
			if (items.length) {
				console.log("Items found ", items.length);	
			}
			else {
				var item = {
					"Name": profile.displayName,
					"FacebookID": profile.id,
					"FacebookAccessToken": profile.accessToken
				};
				user.addItem(item, function(err) {
					if (err) {
						console.error("Error occurred while adding", err);	
					}
					else {
						console.log("Added user!", item);
					}
				});
			}
		}
		else {
			console.error("Error occurred ", err);	
		}
    });
}