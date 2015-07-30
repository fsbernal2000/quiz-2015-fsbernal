var express = require('express');
var router = express.Router();

var quizController    = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

//  GET página por defecto (home)
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', errors: []});
});

// GET página del autor
router.get('/author', function(req, res, next) {
  res.render('author', 
  			 {nombre: 'Felipe Sánchez Bernal',
			  foto: 'images/jd.jpg',
			  nota: 'Curso Desarrollo de servicios en la nube con HTML5, Javascript y node.js', 
			  errors: []});
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);  

// Definición de rutas de sesión
router.get('/login',	sessionController.new);
router.post('/login',   sessionController.create);
router.get('/logout',	sessionController.destroy);

// Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new',                sessionController.loginRequired, quizController.new);
router.post('/quizes/create',            sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',      sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',   sessionController.loginRequired, quizController.destroy);

// rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',    commentController.create);

module.exports = router;
