var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var livrosRouter = require('./routes/livros');
var editorasRouter = require('./routes/editoras');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); 

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/livros', livrosRouter);
app.use('/editoras', editorasRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
