/**
 * Module dependencies.
 */

var express = require('express')
  , app = exports.app = express()
  , http = require('http')
  , path = require('path')
  , nconf = require('nconf')
  , passport = require('passport');

app.configure(function(){
  app.set("configFile", "config.json");
  app.set('conf', nconf);
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.set("configFile", "config_development.json");
  app.use(express.errorHandler());
});


nconf.env().file({ file: app.get("configFile") });

var routes = require('./routes')
  , user = require('./routes/user')
  , auth = require('./routes/auth');

  
app.get('/', routes.index);
app.get('/users', user.list);

auth.attach(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
