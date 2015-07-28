
// GET /login  Formulario de login
exports.new = function (req, res) {

	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new.ejs', {errors: errors});

};


// POST /login  Crear la sesión
exports.create = function(req, res) {

	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller')
	userController.autenticar(login, password, function(error, user){
		if (error){
			//Si hay error retornamos errores de sesión y se redirige a login de nuevo
			req.session.errors = [{"message": "Se ha producido un error: " + error}];
			res.redirect("/login");
			return;
		}

		//Crear req.session.user y guardar campos id y username
		//La sesión se define por la existencia de req.session.user
		req.session.user = {id: user.id, username: user.username};

		//Redirección a path anterior a login
		res.redirect(req.session.redir.toString());
	});

};

// GET /logout  Destruir la sesión
exports.destroy = function (req, res) {

	//La sesión se define por la existencia de req.session.user
	delete req.session.user;

	//Redirección a path anterior a login/logout
	res.redirect(req.session.redir.toString());
};