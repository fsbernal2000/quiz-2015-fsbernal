var path = require('path');

//Cargar ORM
var Sequelize = require('sequelize');

//Usar BD SQLite
var sequelize = new Sequelize(null, null,null,
						{dialect: "sqlite", storage: "quiz.sqlite"}
					);

//Importar la definición de la tabla Quiz (está en quiz.js)
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; //exporta definición de la tabla Quiz

//Crear e inicializar la tabla de preguntas en la BD
sequelize.sync().success(function(){
	//success(...) ejecuta el manejador tras crear la tabla
	Quiz.count().success(function(numfilas) {
		if (numfilas === 0) { //la tabla se inicializa solo si está vacía
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma'
						})
			.success(function(){console.log('Base de datos inicializada')});
		};
	});
});