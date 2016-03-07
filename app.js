var express = require('express');
var request = require('request');
var Sequelize = require('sequelize');
var db = require("./db.js");

var app = express();
var PORT = process.env.PORT || 3000;

var API_ID = "4c1cf5063764a40";
var API_KEY = "950f81d315fc5b9eb097a5c2c8b0f51f33f1b6ad";

app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res){
	res.render('index');
});

request('http://www.imgur.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
  }
})

app.listen(PORT, function(){
	console.log("Express listeneing on port " + PORT);
});