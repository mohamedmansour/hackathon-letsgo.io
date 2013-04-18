/**
 * Module dependencies.
 */

var express = require('express')
  , app = exports.app = express()
  , http = require('http')
  , path = require('path')
  , nconf = require('nconf')
  , passport = require('passport')
  , geoip = require('geoip-lite')
  , routes = require('./routes'); 

function getCoordinates(req) {
  var ret,
      geo,
      ip = req.ip,
      portIndex = ip.indexOf(":");
  
  if (portIndex != -1) {
    ip = ip.substring(0, portIndex);
  }
  
  geo = geoip.lookup(ip);

  if (!geo) {
    ret = { city: "San Francisco", ll: [37.47,-122.13], ip: ip };
  }
  else {
    ret = { city: geo.city, ll: geo.ll, ip: ip };
  }
  return JSON.stringify(ret);
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

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
    res.locals.location = getCoordinates(req);
    res.locals.mapsKey = nconf.get("BING_MAPS_API");
    next();
  });

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
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
