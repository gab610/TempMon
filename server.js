// Require our dependencies
var express = require('express'),
  bodyParser = require("body-parser"),
  exphbs = require('express-handlebars'),
  http = require('http'),
  mongoose = require('mongoose'),
  routes = require('./routes'),
  config = require('./config');
 
// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));

// Set handlebars as the templating engine
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Disable etag headers on responses
app.disable('etag');

// Connect to our mongo database
mongoose.connect('mongodb://localhost/temp-monitor');

// Index Route
app.get('/', routes.index);

// Page Route
app.get('/page/:page/:skip', routes.page);

// Set /public as our static content dir
app.use("/", express.static(__dirname + "/public/"));

// Fire this bitch up (start our server)
var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});

// Initialize socket.io
var io = require('socket.io').listen(server);

// Post Route
app.post('/', routes.post(io));

