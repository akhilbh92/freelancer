"use strict";

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _clientSessions = _interopRequireDefault(require("client-sessions"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _index = _interopRequireDefault(require("./routes/index"));

var _users = _interopRequireDefault(require("./routes/users"));

var _projects = _interopRequireDefault(require("./routes/projects"));

var _bids = _interopRequireDefault(require("./routes/bids"));

var _files = _interopRequireDefault(require("./routes/files"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*var cors = require('cors');*/
var path = require('path');

var app = (0, _express.default)(); //Enable CORS

/*app.use(cors());*/

app.use((0, _clientSessions.default)({
  cookieName: 'mySession',
  // cookie name dictates the key name added to the request object
  secret: 'askjnd3akjnd78fkjd64nfdad',
  // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000,
  // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds

})); // view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use((0, _morgan.default)('dev'));
app.use(_bodyParser.default.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); //Any routes with /uploads will be handled by this for handling static files

app.use('/uploads/', _express.default.static(path.join('./', 'public', 'uploads')));
app.use('/', _index.default);
app.use('/users', _users.default);
app.use('/projects', _projects.default);
app.use('/bids', _bids.default);
app.use('/files', _files.default);
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;