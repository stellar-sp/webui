var http = require('http');
var axios = require("axios");

var bodyParser = require('body-parser')
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

const Pool = require('pg').Pool
const dbPool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen(port);

app.get('/workers', function (req, res) {
	
	dbPool.query('select * from workers', (error, results) => {
        if (error) {
            throw error
        }

        res.status(200).json(results.rows)
    });
})

app.post('/workers', function (req, res) {

    const { public_key, address, horizon_address, network_passphrase, ipfs_address } = req.body

    dbPool.query('insert into workers(public_key, address, horizon_address, network_passphrase, ipfs_address) values ($1, $2, $3, $4, $5)', [public_key, address, horizon_address, network_passphrase, ipfs_address], (error, results) => {

        if (error) {
          throw error
        }

        response.status(201).send(`User added with ID: ${result.insertId}`);
    });
})


