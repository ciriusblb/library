'use strict';

var express=require('express'),	
	server = express(),
	swig = require('swig'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	flash = require('connect-flash'),
	RedisStore = require('connect-redis')(session),
	port=process.env.PORT || 8000;
   
//body parser, cookies, sessiones
	server.use(bodyParser.urlencoded({extended:false}));
	server.use(cookieParser());
	server.use(session({
		store : new RedisStore({
			host : '127.0.0.1',
			port : 6379,
			db : 1
		}),
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: true
	}));//las sesiones guardan las estancias por defecto en un memorystore
	server.use(flash());//mensaje rápido

	//passport
	require('./config/passport')(server);
	
// temaplates
	server.engine('html',swig.renderFile);
	server.set('view engine', 'html');
	server.set('views', __dirname + '/views');
	swig.setDefaults({cache: false});
	
// static files
	server.use(express.static(__dirname + '/public'));

	server.listen(port, function(){
		console.log("servidor escuchando al puerto "+ port);
	});

	server.use(function(req,res,next){//con esto enviamos el req.user a todos los templastes del proyecto 
		server.locals.user = req.user;//user: la variable que se va a enviar al template
		next();
	});
	if(process.env.NODE_ENV=='dev'){
		require('./config/server/local')(server);
	}
	if(process.env.NODE_ENV == 'prod'){
		require('./config/server/prod')(server);
	}

	require('./routers')(server);
