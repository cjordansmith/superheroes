var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var port = 3000;

var app = express();

var routes = require('./app/routes/index')();

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };
mongoose.connect('mongodb://heroku_z6dfdq0f:68iqfflk05i534h79hg0kkimru@ds013584.mlab.com:13584/heroku_z6dfdq0f', options);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

//Log with Morgan
app.use(morgan('dev'));
//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

//Static files
app.use(express.static(__dirname + '/public'));

app.route('/superhero')
	.post(routes.post)
	.get(routes.getAll);
app.route('/superhero/:id')
	.get(routes.getOne);

app.listen(port);
console.log('listening on port ' + port);
