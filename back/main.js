var http = require('http');
var axios = require("axios");

var bodyParser = require('body-parser')
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen(port);

app.get('/workers', function (req, res) {
	
	workers = [];
	
	res.status(500).send(workers)
})
