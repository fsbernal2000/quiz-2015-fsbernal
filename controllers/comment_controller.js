var models = require ('../models/models.js');

// GET /quizes/:quizId/comments/new
exports.new = function (req, res) {

	//Se renderiza la página con el formulario de alta de comentario
	//asociado a la pregunta quizid
	res.render('comments/new.ejs', {quizid : req.params.quizId, errors: []});

};


// POST /quizes/:quizId/comments
exports.create = function(req, res) {

	var comment = models.Comment.build(
				{
					texto: req.body.comment.texto,
					QuizId: req.params.quizId

				});

	//Valida y guarda (si es correcto) en la bd 
	//el comentario asociado a la pregunta
	comment.validate()
		   .then(
				function(err){
					if (err) {
						res.render('comments/new.ejs', {comment: comment,
														quizid: req.params.quizId,
														errors: err.errors});
					} else {
						comment 
							.save({fields: ["texto", "QuizId"]})
							.then( function(){ res.redirect('/quizes/'+req.params.quizId)}) 
					}      
				}
			);

};