// Definición del modelo QUIZ

module.exports = function (sequelize, DataTypes) {
	return sequelize.define ('Quiz',
			{ pregunta: DataTypes.STRING,
			  respuesta: DataTypes.STRING,
			});
}