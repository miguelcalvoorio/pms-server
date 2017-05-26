require('rootpath')();
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var port           = process.env.PORT || 80;
var address        = process.env.IP || "0.0.0.0";
//var database       = require('./config/database');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var expressJwt     = require('express-jwt');
var config         = require('config.json');

// Configuration
//mongoose.connect(database.url);

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

// use JWT auth to secure the api
//app.use(expressJwt({ secret: config.secret }).unless({ path: ['/users/authenticate', '/users/register'] }));

// routes
//require('./app/routes.js')(app);
app.use('/users', require('./controllers/users.controller'));

// start server
var server = app.listen(port, address, function () {
    var addr = server.address();
    console.log("Chat server listening at", addr.address + ":" + addr.port);
});