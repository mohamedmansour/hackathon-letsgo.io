/**
 * Module dependencies.
 */

var express = require('express')
  , app = exports.app = express()
  , http = require('http')
  , path = require('path')
  , nconf = require('nconf')
  , passport = require('passport')
  , routes = require('./routes')
  , geolocation = require('./models/geolocation.js'); 

app.configure(function() {
  app.set("trust proxy", true); // Azure runs behind a proxy
  app.set('conf', nconf);
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));

  app.use(function (req, res, next) {
    res.locals.user = req.user;
    res.locals.location = geolocation.getCoordinates(req);
    res.locals.mapsKey = nconf.get("BING_MAPS_API");
    next();
  });

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('production', function() {
  nconf.env().file({ file: "config.json" });
});

app.configure('staging', function() {
  nconf.env();
});

app.configure('development', function() {
  nconf.env().file({ file: "config_development.json" });
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

// Attach all the routes.
routes.attach(app);

// Start the server.
http.createServer(app).listen(app.get('port'), function() {
  console.log("Node server listening on port " + app.get('port'));
});
