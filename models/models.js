var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

//Cargar ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

/////////////////////////////////
//  TABLA DE PREGUNTAS (QUIZ)  //
/////////////////////////////////

//Importar la definición de la tabla Quiz (está en quiz.js)
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//Crear e inicializar la tabla de preguntas en la BD
sequelize.sync().then(function(){
	//then(...) ejecuta el manejador tras crear la tabla
	Quiz.count().then(function(numfilas) {
		if (numfilas === 0) { //la tabla se inicializa solo si está vacía
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma',
						  tema: 'humanidades'
						});
			Quiz.create({ pregunta: 'Capital de Portugal',
						  respuesta: 'Lisboa',
						  tema: 'geografía'
						})
				.then(function(){console.log('Base de datos inicializada')});
		};
	});
});


//////////////////////////////////
//  TABLA COMENTARIOS (COMMENT) //
//////////////////////////////////

//Importar la definición de la tabla Comment (está en comment.js)
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

//Relación con Quiz
Comment.belongsTo(Quiz, { onDelete: 'cascade' });
Quiz.hasMany(Comment, { onDelete: 'cascade' });


/////////////////////////////
//  EXPORTACION DE TABLAS  //
/////////////////////////////

//Exportación de definiciones de tablas
exports.Quiz = Quiz; 		//exporta definición de la tabla Quiz
exports.Comment = Comment;	//exporta definición de la tabla Comment
