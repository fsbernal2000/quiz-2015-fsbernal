var models = require ('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {

	models.Quiz
		.find({
				where: { id: Number(quizId)},
				include: [{model: models.Comment}]
			  })
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

	var condicionTxtMayus = whereTxtMayus = '';
	var filtroUsu = '';
	var filtroTema = false;
	var whereSql = [];

	//Si no recibe las querys 'searchTxt' ni 'searchTema' (o esta última es 'todos'
	//se muestran todas las preguntas
	if (!req.query.searchTxt && !req.query.searchTema){
		
		models.Quiz.findAll()
			.then(
				function(quizes) {
						res.render('quizes/index', {quizes: quizes, 
													filtro:'*',
													errors: []});
				}
			).catch(function(error) { next(error);})
	}
	else {

		//Si se ha seleccionado algún tema se construye la condición del where
		if (req.query.searchTema){
			whereSql.push('tema=? ',req.query.searchTema);
			filtroTema = true;
			filtroUsu = req.query.searchTema;
		}

		if (req.query.searchTxt) {
			//La condición/filtro de búsqueda se construye a partir de la query 'searchTxt' donde 
			//sustituimos espacios en blanco por un '%' más uno al inicio y otro al final
			whereTxtMayus = ' upper(pregunta) like ? ';
			condicionTxtMayus = ('%' + req.query.searchTxt.trim() + '%')
								.replace(/\s+/g, '%')
								.toUpperCase();
			if (filtroTema) {
				whereSql[0] += ' and ' + whereTxtMayus; 
				filtroUsu += ' + "' + req.query.searchTxt + '"';
			}
			else
			{
				whereSql.push(whereTxtMayus);
				filtroUsu = req.query.searchTxt;
			}
			whereSql.push(condicionTxtMayus);
		}
		models.Quiz.findAll({where: whereSql, 
						     order: 'pregunta ASC'})
			.then(
				function(quizes) {
					res.render('quizes/index', {quizes: quizes, 
												filtro: filtroUsu,
												errors: []});
				})
			.catch(function(error) { next(error);})
	}
};


// GET /quizes/:quizId
exports.show = function(req, res) {

	res.render('quizes/show', { quiz: req.quiz, errors: []});

};


//GET /quizes/:quizId/answer
exports.answer = function (req, res) {

	var resultado = (req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase()) ? 'Correcto' : 'Incorrecto';
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});

};



// GET /quizes/new
exports.new = function (req, res) {

	//Se crea un objeto Quiz
	var quiz = models.Quiz.build ( 
			{pregunta:"Pregunta", respuesta:"Respuesta", tema:"otro"}
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
						.save({fields: ["pregunta", "respuesta", "tema"]})
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
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz
	   .validate()
	   .then(
			function(err){
				if (err) {
					res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
				} 
				else {
					req.quiz   
					.save( {fields: ["pregunta", "respuesta", "tema"]})
					.then( function(){ res.redirect('/quizes');}); // /quizes/index.ejs
				}     
			}
	   );
};


// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz
	   .destroy()
	   .then( function() {
			res.redirect('/quizes');
		})
	   .catch(function(error){next(error)});
};