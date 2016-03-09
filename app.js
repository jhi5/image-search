var express = require('express');
var request = require('request');
var Sequelize = require('sequelize');
var Bing = require('node-bing-api')({
	accKey: "ilUTd0pcELN33xb0Sy4PHCdZaiBsqp3VdT2VLZrfBq8"
});
var bodyParser = require('body-parser');
var async = require('async');

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

app.get('/search/:query/:offset?', function(req, res) {
	offset = req.params.offset || 1;
	if(offset > 5){
		res.send("This API only provides 50 results. Your offset cannot be larger than 5. Sorry!");
	}
	query = req.params.query;	
	if (query === undefined) {
		res.send({
			"Error": "No search parameters!"
		})
	}
	var array = [];
	async.series([
		function() {
			Bing.images(query, {
				imageFilters: {
					size: 'small',
					color: 'monochrome'
				}
			}, function(error, response, body) {
				db.imageSearch.create({
					searchString: query
				});
				for (i = ((offset - 1)*10); i < offset*10; i++) {
					var obj = {
						imageUrl: body.d.results[i].MediaUrl,
						pageUrl: body.d.results[i].SourceUrl,
						altText: body.d.results[i].Title
					};
					array.push(obj);
				}
				console.log(array);
				res.send(array);
			});
		}]
	);
});

app.get('/recent', function(req, res) {
	db.imageSearch.findAll({
		limit: 10,
		order: '"updatedAt" DESC'
	}).then(function(data) {
		res.send(data);
	});
});

db.sequelize.sync({force:true}).then(function() {
	app.listen(PORT, function() {
		console.log("Express listening on port " + PORT);
	});
});