var _ = require('lodash');
var moment = require('moment');
var net = require('net');
var postgres = require('./postgres.js')

const NODE_ERROR = -1;
const NODE_TIMEOUT = -2;

function checkNode(node) {
    return new Promise((resolve, reject) => {
        let client = new net.Socket();
        let start = moment();
        client.setTimeout(10 * 1000);
        console.log("checkNode: connecting to: " + node.address)

        client.connect(path = node.address, function () {
            client.end();
            resolve({id: node.public_key, connectedIn: moment().diff(start)});
        });

        client.on('error', () => {
            client.end();
            resolve({id: node.public_key, connectedIn: NODE_ERROR});
        });

        client.on('timeout', () => {
            client.end();
            resolve({id: node.public_key, connectedIn: NODE_TIMEOUT});
        });
    });
}

function checkNodes() {

    let date = moment().seconds(0).milliseconds(0);

    // Check uptime every 2 minutes
    if (date.minutes() % 2 != 0) {
        console.log("checkNodes: not time " + date.format("YYYY-MM-DD HH:mm"))
        return;
    }

    postgres.sequelize.query("select * from workers", {model: postgres.Worker})
        .then(workers => {
            for (let worker of workers) {
                checkNode(worker.dataValues)
                    .then(result => {

                        return postgres.Worker.update({ is_up : result.connectedIn }, { where : { public_key : worker.public_key } }).then(() => {
                            console.log(`updated node uptime stats for ${date}!`);
                        });
                    });
            }
        })

}

setInterval(checkNodes, 60 * 1000);
checkNodes();
