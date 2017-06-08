'use strict';

var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var bodyParser    = require('body-parser');

var verify        = require(path.join(__dirname, 'include', 'verify.js'));
var randomcountry = require(path.join(__dirname, 'include', 'randomcountry.js'));

var app = express();

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set('port', process.env.PORT || 8889);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({
    verify: function getRawBody(req, res, buf) {
        req.rawBody = buf.toString();
    }
}));

// return exactly what we'd return to alexa
app.get('/',           function(req,res){randomcountry(req, res, "html")});
app.get('/index.html', function(req,res){randomcountry(req, res, "html")});
app.get('/index.json', function(req,res){randomcountry(req, res, "json")});
app.get('/help.html',  function(req,res){res.render("help")});
app.get('/alexa',          randomcountry);
app.post('/alexa', verify, randomcountry);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Hey, I can't find nothing on the radio.");
  err.status = 404;
  err.submessage = "Ah. Yo! Turn it to that station while we look for it.";
  next(err);
});

app.listen(app.get('port'), function() {
  console.log('Random Country is up and running on port %d', app.get('port'));
});

// i don't think anything but 404s are going to hit this. oh well.
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === '__development' ? err : {};
  res.locals.error = {};
  // render the error page
  res.locals.errorno = (err.status || 500);
  res.status(res.locals.errorno);
  res.locals.kind = ((res.locals.errorno==404) ? "404" : "50x");
  res.locals.submessage = (err.submessage || "Something's gone wrong.");
  res.render('error');
});
