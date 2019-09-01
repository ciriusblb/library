'use strict';
var middlewares={
	isLoggedIn : function(req,res,next){ //middlewares es lo que esta entre lo que pide el cliente y el controlador
		if(req.user){//si el usuario esta lgoeuado entonces continua 
			next();
			return;
		}; // sino te redireccionamos al inicio
		res.redirect('/');
	}
};
module.exports = middlewares;