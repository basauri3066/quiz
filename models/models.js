var path = require('path');

//Cargar el modelo ORM
var Sequelize = require('sequelize');

//User BBDD SQLite: stotage es el fichero donde se guardaran los datos
var sequelize = new Sequelize(null,null,null, {dialect:"sqlite", storage:"quiz.sqlite"});

//Importar la definición de la tabla Quiz que estas en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; //Exportamos la fefinición de la tabla quiz

//Con sequelize.sync() se crea e inicializa las tablas que tenemos definidas (Quiz)
sequelize.sync().success(function() {
	//success(..)ejecuta el manejador una vez que se han creado las tablas
	Quiz.count().success(function(count){
		if (count===0) { //La tabla se inicializa solo si esta vacia
			Quiz.create({pregunta: 'Capital de Italia', respuesta: 'Roma'})
			.success(function(){console.log('Base de datos inicializada')});				
		};
	});
});