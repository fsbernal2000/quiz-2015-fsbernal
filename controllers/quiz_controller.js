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
					res.render('quizes/index', {quizes: quizes, 
												filtro: req.query.search,
												errors: []});
				})
			.catch(function(error) { next(error);})
	}
	else {//Si no recibe la query 'search' se muestran todas las preguntas
		models.Quiz.findAll()
			.then(
				function(quizes) {
						res.render('quizes/index', {quizes: quizes, 
													filtro:'*',
													errors: []});
				}
			).catch(function(error) { next(error);})
	}
};


// GET /quizes/:quizId
exports.show = function(req, res) {

	res.render('quizes/show', { quiz: req.quiz, errors: []});

};


//GET /quizes/:quizId/answer
exports.answer = function (req, res) {

	var resultado = (req.query.respuesta === req.quiz.respuesta) ? 'Correcto' : 'Incorrecto';
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});

};



// GET /quizes/new
exports.new = function (req, res) {

	//Se crea un objeto Quiz
	var quiz = models.Quiz.build ( 
			{pregunta:"Pregunta", respuesta:"Respuesta"}
		);
	//Se renderiza la página con el formulario de alta
	res.render('quizes/new', {quiz : quiz, errors: []});

};


// POST /quizes/create
exports.create = function(req, res) {

	var quiz = models.Quiz.build(req.body.quiz);

	//Valida y guarda (si es correcto) en la bd 
	//los campos pregunta y respuesta de quiz
	quiz.validate()
		.then(
			function(err){
				if (err) {
					res.render('quizes/new', {quiz: quiz, errors: err.errors});
				} else {
					quiz 
						.save({fields: ["pregunta", "respuesta"]})
						.then( function(){ res.redirect('/quizes')}) // /quizes/index.ejs
				}      
			}
		);

};


// GET /quizes/:id/edit
exports.edit = function(req, res) {

  // req.quiz: se ha hecho autoload de instancia de quiz (con un id)
  res.render('quizes/edit', {quiz: req.quiz, errors: []});

};


// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta  = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
	   .validate()
	   .then(
			function(err){
				if (err) {
					res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
				} 
				else {
					req.quiz   
					.save( {fields: ["pregunta", "respuesta"]})
					.then( function(){ res.redirect('/quizes');}); // /quizes/index.ejs
				}     
			}
	   );
};

