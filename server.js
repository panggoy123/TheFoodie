var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var dbURL = "mongodb://localhost:27017/";

var app = express();

//middleware to be able to parse form info.
app.use(express.urlencoded({extended: false}));
//middleware to parse json
app.use(express.json());


//serve all static pages.
app.use(express.static('./'));

//load thefoodie.html as the main page.
app.get("/", function(req,res){

	res.sendFile(__dirname + "/TheFoodie.html");
});

app.post("/create_food", function(req, res){
//somehow json sent from the body is converted into a javascript Obj.

	console.log("post req received");

	console.log(req.body);

	MongoClient.connect(dbURL, function(err, db){

		if(err) throw err;

		//var dbInput = {{dish: req.body.ateInDish, instrucion: req.body.ateInInstructions}}

		//insert to database
		var dbObj = db.db("foodie");

		dbObj.collection("food").insertOne(req.body, function(err, res){

			if(err) throw err;

			console.log("inserted!");
			db.close();
		});
	});


	//console log all database contents
	MongoClient.connect(dbURL, function(err, db) {
		if (err) throw err;

		var dbo = db.db("foodie");

		dbo.collection("food").find({}).toArray(function(err, result) {
			if (err) throw err;
			console.log(result);
			db.close();
		});

	});


	res.end();
});


app.listen(8080);
