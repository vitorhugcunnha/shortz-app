var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
var expressLayouts = require("express-ejs-layouts");
var videoRoutes = require("./modules/video/videoRoutes");
require("./config/associations"); 

var indexRouter = require("./routes/index");
var userRoutes = require("./modules/user/userRoutes"); 

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views/pages"));         // [linha MODIFICADA] 
app.set("layout", path.join(__dirname, "views/layouts/main")); // [linha adicionada] 
app.use(expressLayouts); 
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);
app.use("/", userRoutes);
app.use("/", videoRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use((req, res, next) => {
    res.locals.messages = req.flash();
    res.locals.user = req.session.user || null; // [ADICIONAR] 
    next();
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//
//
// Tenta conectar com o database
//
//

const sequelize = require('./configuration/database');

sequelize.sync({ alter: true })
    .then(() => console.log('Banco de dados sincronizado!'))
    .catch(err => console.error('Erro ao sincronizar banco:', err));

module.exports = app;
