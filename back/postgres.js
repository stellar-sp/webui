var Sequelize = require('sequelize');

// export const sequelize = new Sequelize(
//   process.env.DEV ? "postgres://localhost/dashboard?sslmode=disable" : process.env.POSTGRES_URL,
//   process.env.DEV ? {} : {dialect: 'postgres', dialectOptions: {ssl: false}}
// );

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {ssl: false}
});

const Worker = sequelize.define('workers', {
    public_key: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    horizon_address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    network_passphrase: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ipfs_address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    is_up: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    indexes: [
        {unique: true, fields: ['public_key']}
    ]
});

sequelize.sync();

module.exports.Worker = Worker;
module.exports.sequelize = sequelize;
