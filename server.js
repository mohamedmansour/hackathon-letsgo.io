/**
 * Module dependencies.
 */

var express = require('express')
  , app = exports.app = express()
  , http = require('http')
  , path = require('path')
  , nconf = require('nconf');

nconf.env().file({ file: "config.json"});

app.configure(function(){
  app.set('conf', nconf);
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


var routes = require('./routes')
  , user = require('./routes/user')
  , auth = require('./routes/auth');
  
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/auth', auth.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
