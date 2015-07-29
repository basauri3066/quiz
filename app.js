var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var routes = require('./routes/index');
var methodOverride = require('method-override');
var session = require('express-session');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false })); En quizz 11 paso 3 quitado el extended
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());





app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Helpers dinamicos
app.use(function(req, res, next){
        //Guardar path en session.redir para despues del login hacer la redirección
        if (!req.session.redir) {                                // si no existe lo inicializa
             req.session.redir = '/';
        }
        if (!req.path.match(/\/login|\/logout/)){ 
            //console.log('b-->'+ req.path.toString() + '<---b')
            req.session.redir = req.path;}
        //Hacemos visible req.session en las vistas
        res.locals.session = req.session;
        next();
});

//Control de Timeout

app.use(function(req, res, next){
  // Lo vamos a hacer solo si hemos hecho el login
  if(req.session.user){   
    var now = new Date();
    
    // Voy a poner un timeout de 30 sg para poder hacer las pruebas
    if((now.getTime() - req.session.horaOperacion) > (30000)){  //pongo el tiempo en Ms
      
      delete req.session.user;  //Eliminamos la sesion
      
    }
    // Almacenamos la hora de la transaccion actual
    req.session.horaOperacion = now.getTime();
  }
  next();
});



app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors:[]
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors:[]
    });
});


module.exports = app;
