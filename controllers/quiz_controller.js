//GET /quizes/question
var models = require('../models/models.js');



//Autoload - Factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
		models.Quiz.find(quizId).then (
				function(quiz){
					if (quiz) {
						req.quiz = quiz;						
						next(); //con esto llama al siguiente middleware
					} else {next(new Error('No existe quizId=' + quizId));}
		}
	).catch(function(error){next(error);});
};


//GET /quizes
//exports.index = function(req,res){
//	models.Quiz.findAll().then(function(quizes) {
//		res.render('quizes/index.ejs', {quizes:quizes});
//	})
//};

// ejercicio cápitulo 7 búsqueda por texto
exports.index = function(req,res){	 
	var filtro = req.query.search;
	if(filtro) { //Caso de que se ha puesto alguna condición de búsqueda
		var condicion = ('%' + filtro + '%').replace(/ /g,'%');
		
		models.Quiz.findAll({
			where: ["pregunta like ?", condicion],
			order: [['pregunta', 'ASC']]}
			).then(function(quizes) {	
			res.render('quizes/index.ejs', {quizes: quizes, errors: []});			
			}).catch(function(error) {next(error);});
		
	}	  
	else{ //caso de que no se haya puesto ningún criterio de búsqueda
			models.Quiz.findAll().then(function(quizes) {
				res.render('quizes/index', {quizes: quizes, errors: []});
			}).catch(function(error) {next(error);});
		}
};


//GET /quizes/new
exports.new = function(req,res){	
	var quiz = models.Quiz.build( //Crea un objeto del tipo Quiz
		{pregunta: "Pregunta", respuesta: "respuesta"}
		);	
		res.render('quizes/new', {quiz: quiz, errors: []});	
};

//GET /quizes/:id
exports.show = function(req,res){	
		res.render('quizes/show', {quiz:req.quiz,errors: []});	
};


//POST /quizes/create
//no esta funcionando el validate
exports.create = function(req, res) {
	var quiz = models.Quiz.build (req.body.quiz);
		quiz.validate().then( function(err) {
		if (err) {
       		res.render('quizes/new', {quiz: quiz, errors: err.errors});
      	} else {
        	quiz.save({fields: ["pregunta", "respuesta","tema"]})
			.then( function() { res.redirect('/quizes');
			})
      	}      // res.redirect: Redirección HTTP a lista de preguntas
     }
	);
};


//POST /quizes/create para cuando la versión de Squelize no admite el uso de then
/*
exports.create = function(req,res){	
		var quiz = models.Quiz.build( req.body.quiz);
		//Guardamos en la BD los campos pregunta y respuesta del quiz
		quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
			res.redirect('/quizes'); //Redireccioamos a la página inicial
		})
};
*/



//GET /quizes/:id/answer
exports.answer = function(req, res) {
		var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta) {
			resultado = 'Correcto';		
		}
		res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});	
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
		var quiz = req.quiz;  //se obtien en el autoload de quiz export.load = ...
		res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
		req.quiz.pregunta = req.body.quiz.pregunta;
		req.quiz.respuesta = req.body.quiz.respuesta;
		req.quiz.tema = req.body.quiz.tema;
		req.quiz.validate().then (function (err){
				if (err) {
						res.render('quizes/edit', {quiz: req.quiz, errors:err.errors});
				} else {
					req.quiz
					.save({fields: ["pregunta", "respuesta", "tema"]})
					.then (function(){res.redirect('/quizes');});
				}
			}
		);
};


// Pongo esto temporalmente porque no me esta funcionado el procedimiento de validar los campos
// de la base de daots (funcion validate) EL PROBLEMA ERA LA VERSION DEL SQUELIZE
/*
exports.update = function(req, res) {
		req.quiz.pregunta = req.body.quiz.pregunta;
		req.quiz.respuesta = req.body.quiz.respuesta;
		
					req.quiz
					.save({fields: ["pregunta", "respuesta"]})
					.then (function(){res.redirect('/quizes');
				});				
				
};
*/

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(function() {res.redirect('/quizes');
	}).catch(function(error) {next(error)});
};

