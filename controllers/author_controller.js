//GET /author

exports.author = function(req,res){
	res.render('author', {autor:'Jose Antonio Fernadez'});
};

