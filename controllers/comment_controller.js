var models = require ('../models/models.js');

// Autoload - factoriza el código si ruta incluye :commentId
exports.load = function (req, res, next, commentId) {

	models.Comment.find({where: {id:Number(commentId)} })
				  .then(function(comment){
				 		if (comment){
				 			req.comment = comment;
				 			next();
				 		}
				 		else{
			 				next(new Error('No existe el comentario ' + commentId));
				 		}})
				  .catch(function(error){next(error);});

};


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
							.then(function(){ res.redirect('/quizes/'+req.params.quizId)}) 
						//	.catch(function(error){next(error);});
					}      
				}
			);
};


//GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res){

	//Actualiza el campo publicado del registro (precargado en load)
	req.comment.publicado = true;

	req.comment.save({fields: ["publicado"]})
			   .then(function(){ res.redirect('/quizes/'+req.params.quizId)}) 
			//   .catch(function(error){next(error);});

};