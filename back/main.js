var nodes = require('./nodes.js');
var postgres = require('./postgres.js')

var bodyParser = require('body-parser')
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

var cors = require('cors');

app.use(cors({origin: '*'}));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen(port);

app.get('/api/workers', function (req, res) {

    postgres.Worker.findAll().then(workers => {
        res.status(200).json(workers)
    });
})

app.post('/api/workers', function (req, res) {

    const { public_key, address, horizon_address, network_passphrase, ipfs_address } = req.body
    let worker = {
        public_key: public_key,
        address: address,
        horizon_address: horizon_address,
        network_passphrase: network_passphrase,
        ipfs_address: ipfs_address,
        is_up: 0
    }

    postgres.Worker.create(worker).then(result => {
        if (result) {
            res.status(201).send(`worker added!`);
        }
        else {
            res.status(500).send(error);
        }
    })
})
