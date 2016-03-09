var express = require('express');
var request = require('request');
var Sequelize = require('sequelize');
var Bing = require('node-bing-api')({
	accKey: "ilUTd0pcELN33xb0Sy4PHCdZaiBsqp3VdT2VLZrfBq8"
});
var bodyParser = require('body-parser');

var db = require("./db.js");
var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', function(req, res) {
	res.render('index');
});

app.post('/search/', function(req, res) {
	res.redirect('/search/' + req.body.query);
});

app.get('/search/:query', function(req, res) {
	query = req.params.query;
	var array = [];
	if (query === undefined) {
		res.send({
			"Error": "No search parameters!"
		})
	}
	Bing.images(query, {
		imageFilters: {
			size: 'small',
			color: 'monochrome'
		}
	}, function(error, res, body) {
		db.imageSearch.create({
			searchString: query
		});
		for (i = 0; i < 10; i++) {
			var obj = {
				imageUrl: body.d.results[i].MediaUrl,
				pageUrl: body.d.results[i].SourceUrl,
				altText: body.d.results[i].Title
			};
			array.push(obj);
		}
		console.log(array);

	});
	res.send("Yeah!");

});

app.get('/recent', function(req, res) {
	db.imageSearch.findAll({}).then(function(data) {
		res.send(data);
	});
});

/*

api parsing

var array = [];
	query = req.params.query.toString();
	Bing.images(query, {
    imageFilters: {
      size: 'small',
      color: 'monochrome'
    }
  }, function(error, res, body){
	console.log(body.d.results.length); 
	for (result of body.d.results){
		array.push(result);
	}
	console.log(array);
  });

  */

db.sequelize.sync({}).then(function() {
	app.listen(PORT, function() {
		console.log("Express listening on port " + PORT);
	});
});