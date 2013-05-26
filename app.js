/**
 * Module dependencies.
 */
 var express = require('express')
 , routes = require('./routes')
 , user = require('./routes/user')
  , editor = require('./routes/editor')
 , http = require('http')
 , path = require('path');
 var app = express();
 var hbs = require('hbs');
 var fs = require('fs');
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
//use .html extension
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());`
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
// app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));
//think about the case for client-side
hbs.registerPartial('footer', fs.readFileSync(__dirname + '/views/footer.html', 'utf8'));
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}
app.get('/template', function(req,res){
	res.render('template',{
		output:'123'
	});

})
app.get('/fbchannel', function(req,res){
	res.render('fbchannel',{
	});

})



app.get('/editor', editor.editor);

app.get('/', routes.index);
app.get('/users', user.list);


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
