//Definición del modelo de Quiz

//ATENCION Cada vez que cambiamos el modelo hay que forzar a que se vuleva a regenerar la tabla
//para ello en models.js ponemos la opcion forze en la sincorinzación
//sequelize.sync({force: true}).success(function() {


module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Quiz',
		{pregunta: { 
			type: DataTypes.STRING, 
			validate: {notEmpty : {msg: "->Falta Pregunta"}}
		},
		 respuesta: {
		 	type: DataTypes.STRING, 
		 	validate: {notEmpty : {msg: "->Falta Pregunta"}}
		},
		tema: {	type: DataTypes.STRING	}	
	}	
	);
}

