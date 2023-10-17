var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require("express-ejs-layouts");
const cookieSession = require('cookie-session');
const flash = require("connect-flash");

const bodyParser = require('body-parser');


// route
const loginRouter = require('./server/routes/login/index');
const dashboardRouter = require('./server/routes/dashboard/dashboard');
const mahasiswaRouter = require('./server/routes/mahasiswa/mahasiswa');
const orangtuaRouter = require('./server/routes/orangtua/orangtua');
const importwisudawan = require('./server/routes/import/importwisudawan');
const jtinRouter = require('./server/routes/jtin/jtin');
const jtiRouter = require('./server/routes/jti/jti');
const aktpRouter = require('./server/routes/aktp/aktp');


const { isLogin, webProtect } = require("./server/middleware");

var app = express();

app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressLayouts);
app.set("layout", "layouts/index");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set("layout extractScripts", true);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));


const oneDay = 1000 * 60 * 60 * 24;
app.use(
  cookieSession({
    name: "Huhu",
    keys: [process.env.SECRET1, process.env.SECRET2],
    cookie: { maxAge: oneDay },
  })
);

app.use(flash());

app.use('/', isLogin, loginRouter);
app.use('/dashboard', webProtect, dashboardRouter);
app.use('/mahasiswa', webProtect, mahasiswaRouter);
app.use('/orangtua', webProtect, orangtuaRouter);
app.use('/jti', webProtect, jtiRouter);
app.use('/jtin', webProtect, jtinRouter);
app.use('/aktp', webProtect, aktpRouter);
app.use('/import', webProtect, importwisudawan);


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
