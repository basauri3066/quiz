var path = require('path');


//Postgres DATABASE_URL = postgres://user:/passwd@host:port/database
//SQlite DATABASE_URL = sqlite://:@/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
//var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user    = (url[2]||null);
var pwd     = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port    = (url[5]||null);
var host    = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

//cargar Modelo ORM
var Sequelize = require ('sequelize');

//Usar BBDD SQlite o Postgres

var sequelize = new Sequelize(DB_name,user,pwd,
                    { dialect: protocol,
                      protocol:protocol,
                      port: port,
                      host: host,
                      storage: storage, //solo SQlite(.env)
                      omitNull: true    //solo Postgress
                  }


                    );

//Importar la definicion de la tabla Quiz
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));


exports.Quiz = Quiz; //Exportamos la fefinición de la tabla quiz

//Con sequelize.sync() se crea e inicializa las tablas que tenemos definidas (Quiz)
// con sequelize.sync({force: true}) forzamos a que se vuelvan a crear las tablas
//quitar {force:true} para que no se vuelva a crear la tabla

sequelize.sync().then(function(){
	//success(..)ejecuta el manejador una vez que se han creado las tablas
	 Quiz.count().then(function(count){
		if (count===0) { //La tabla se inicializa solo si esta vacia
			Quiz.create({pregunta: 'Capital de Italia', respuesta: 'Roma'})
			.success(function(){console.log('Base de datos inicializada')});				
		};
	});
});