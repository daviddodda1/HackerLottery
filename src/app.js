var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

const db = mongoose
  .connect('mongodb://localhost:27017/HackerLottery')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const User = require('./models/Admin');

User.find({}, (error, foundUser) => {
  if (error) {
    console.log(error);
  } else {
    console.log(foundUser);
    console.log('test');
    if (foundUser.length === 0) {
      const newUser = new User();
      newUser.auth = {
        name: 'Admin',
        password: 'AdminPassword',
      };
      newUser.save((err, savedUser) => {
        if (err) {
          console.log(err);
        } else {
          console.log(savedUser);
        }
      });
    }
  }
});

app.options('*', cors()); // include before other routes
app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;