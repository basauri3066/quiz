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



//GET /quizes/:id
exports.show = function(req,res){	
		res.render('quizes/show', {quiz:req.quiz});	
};

//GET /quizes/:id/answer
exports.answer = function(req, res) {
		var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta) {
			resultado = 'Correcto';		
		}
		res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});	
};
