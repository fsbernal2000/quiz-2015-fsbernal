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

router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

module.exports = router;
