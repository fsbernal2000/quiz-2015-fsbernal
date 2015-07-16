var models = require ('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {

	models.Quiz.find(quizId)
		.then(
			function(quiz) {
				if (quiz) {
					req.quiz = quiz;
					next();
				} 
				else { 
					next(new Error('No existe quizId=' + quizId)); 
				}
			})
		.catch(function(error) { next(error);});

};


// GET /quizes con filtro/busqueda de preguntas opcional
exports.index = function(req, res, next) {
	if (req.query.search) {
		//La condición/filtro de búsqueda se construye a partir de la query 'search' donde 
		//sustituimos espacios en blanco por un '%' más uno al inicio y otro al final
		var condicionMayus = ('%' + req.query.search.trim() + '%')
							.replace(/\s+/g, '%')
							.toUpperCase();

		//Consulta los registros de la tabla Quiz cuya pregunta (en mayúsculas) contenga 
		//la condicion, ordenando los resultados alfabéticamente por el campo pregunta 
		//y renderizandolos en la vista index.ejs 
		models.Quiz.findAll({where: ["upper(pregunta) like ?", condicionMayus], 
						     order: 'pregunta ASC'})
			.then(
				function(quizes) {
					res.render('quizes/index', {quizes: quizes, filtro: req.query.search});
				})
			.catch(function(error) { next(error);})
	}
	else {//Si no recibe la query 'search' se muestran todas las preguntas
		models.Quiz.findAll()
			.then(
				function(quizes) {
						res.render('quizes/index', {quizes: quizes, filtro:'*'});
				}
			).catch(function(error) { next(error);})
	}
};


// GET /quizes/:quizId
exports.show = function(req, res) {

	res.render('quizes/show', { quiz: req.quiz});

};


//GET /quizes/:quizId/answer
exports.answer = function (req, res) {

	var resultado = (req.query.respuesta === req.quiz.respuesta) ? 'Correcto' : 'Incorrecto';
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});

};
