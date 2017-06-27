require('rootpath')();
var express        = require('express');
var app            = express();
var port           = process.env.PORT || 80;
var address        = process.env.IP || "0.0.0.0";
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var expressJwt     = require('express-jwt');
var config         = require('config.json');

var cors           = require('cors'); // For testing purpose; to allow CORS calls from another domain.
const corsOptions = {
  origin: 'https://pms-client-miguelcalvo.c9users.io'
}
app.use(cors(corsOptions))


// Configuration
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(bodyParser.json());

// use JWT auth to secure the api
app.use(expressJwt({ secret: config.secret }).unless({ path: ['/users/login', '/users/register'] }));

// routes
app.use('/users', require('./controllers/users.controller'));
app.use('/clients', require('./controllers/clients.controller'));

// start server
var server = app.listen(port, address, function () {
    var addr = server.address();
    console.log("FlexManager server listening at", addr.address + ":" + addr.port);
});