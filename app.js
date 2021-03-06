var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , settings = require('./setting')
  , flash = require('connect-flash');

var app = express();

//所有环境下
app.configure(function(){
    //设置端口
    app.set('port', process.env.PORT || 80);
    app.set('views', __dirname + '/view');
    app.set('view engine', 'html');
    app.engine('.html', require('ejs').__express);
    app.use(flash());
    app.use(express.favicon(__dirname+'/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(express.cookieParser());
    app.use(express.session({
        secret: settings.cookieSecret,
        cookie: {maxAge: 900000}
        //store: store
    }));
    app.use(express.static(path.join(__dirname, '/assets')));
    app.use(app.router);
});
//开发环境
app.configure('development', function(){
  app.use(express.errorHandler());
});
//路由
routes(app);

app.use(function(req, res, next){
    var err = req.flash('error')
        , success = req.flash('success');
    res.locals.user = req.session.user;
    res.locals.error = err.length ? err : null;
    res.locals.success = success.length ? success : null;
    next();
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("success!port " + app.get('port'));
});
