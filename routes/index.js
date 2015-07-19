var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

//  GET página por defecto (home)
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

// GET página del autor
router.get('/author', function(req, res, next) {
  res.render('author', { nombre: 'Felipe Sánchez Bernal',
  						 foto: 'images/jd.jpg',
  						 nota: 'Curso Desarrollo de servicios en la nube con HTML5, Javascript y node.js' 
  					   }
			 );
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);  

// Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new',                  quizController.new);
router.post('/quizes/create',              quizController.create);


module.exports = router;
