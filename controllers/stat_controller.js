var models = require ('../models/models.js');

// GET /quizes/statistics
exports.show = function(req, res, next) {

	var stats = {
		pregs : 0,
		coms : 0,
		avgComPreg : 0.0,
		pregSinCom : 0,
		pregConCom : 0
	};

	//Cuenta preguntas
	models.Quiz.count().then(function (numQuest) {
	    stats.pregs = numQuest;
	    //Cuenta comentarios
	    models.Comment.count().then(function (numComm) {
		    stats.coms = numComm;
			stats.avgComPreg =  stats.pregs ? (stats.coms / stats.pregs).toFixed(2) : 0; 
			//Cuenta preguntas con comentarios
			models.Quiz.count({ distinct: true, 
								include: [{model: models.Comment}],
								where: ['"Comments"."QuizId" IS NOT NULL'] })
			.then(function (pregConCom) {
						if (!isNaN(pregConCom)) {
						    stats.pregConCom = pregConCom;
							stats.pregSinCom = stats.pregs - stats.pregConCom; 
						}
						//Visualiza la página de las estadísticas
						res.render('quizes/statistics', {stats: stats, errors: []});

			}).catch(function(error) {next(error)})
		}).catch(function(error) {next(error)})
	}).catch(function(error) {next(error)});

};
