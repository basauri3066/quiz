// definición del modelo de comment con validación

module.exports = function(sequelize, Datatypes) {
	return sequelize.define(
			'Comment',
			{ texto: {
				type :Datatypes.STRING,
				validate: {notEmpty: {msg: "-> Falta comentario"}}
			},
			publicado: { type: Datatypes.BOOLEAN, defaultValue: false }
			
		});
}