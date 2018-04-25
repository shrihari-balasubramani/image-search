// server.js
// where your node app starts

// init project
var express = require('express');
var app = express(),
    fs     = require('fs'),
    db = require('./db'),
	  ImageSearchMapping = require('./imageSearchMappingSchema'),
    path = require('path'),
    urlIDMappingModel,
	  request = require('request');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.set('view engine', 'hbs');
// http://expressjs.com/en/starter/basic-routing.html

app.get('/api/imagesSearched',function(req,res, next){
	ImageSearchMapping.find({},{ '_id': 0,searchTerm:1,when:1}).sort({ when: -1 }).limit(10).lean().exec(function(err,data){
		console.log(err,data);
		if(err){
			res.json({"error":"error fetching data"})
			return;
		}

		res.json(data);	
	})
	
})
function addToDb(searchQuery){
	var imageSearchMappingModel = new ImageSearchMapping({searchTerm:searchQuery,when:new Date()});
	imageSearchMappingModel.save();
}
app.get('/images/:searchFor/:pageCount',function(req,res, next){
	var apiSearchString = 'https://api.imgur.com/3/gallery/search/{pageIndexHolder}?q={searchQuery}';
	apiSearchString = apiSearchString.replace(/\{pageIndexHolder\}/,req.params.pageCount).replace(/\{searchQuery\}/,req.params.searchFor);
	var options = {
	  url:apiSearchString ,
	  headers: {
		    "Authorization": process.env.imgurSecret
	  }
	};
	request(options, function(error, response, resultBody){
		if(error){
			res.json({"error":"Something went wrong.Please try after sometime"});
		}else{
			addToDb(req.params.searchFor);
			var resultData = JSON.parse(resultBody).data.map(function(eachResult){
				var tagsList = eachResult.tags.map((tagNames)=>{return tagNames.name});
				return {title:eachResult.title, link: eachResult.link , tags:tagsList}
			});
			res.json(resultData);
		}
	});
})
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
