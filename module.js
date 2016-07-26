'use strict';

const Hapi = require('hapi');
const Promise = require('bluebird');
const seneca = require('seneca');

const server = new Hapi.Server();
server.connection({ port: 3000 });

const senecaClient = seneca()
    .client({
        host: process.env.USERS_PORT_10101_TCP_ADDR,
        port: process.env.USERS_PORT_10101_TCP_PORT,
    })
    .client({
        host: process.env.COOPERATIVES_PORT_10101_TCP_ADDR,
        port: process.env.COOPERATIVES_PORT_10101_TCP_PORT,
    });

const act = Promise.promisify(senecaClient.act, { context: senecaClient });

server.route({
    method: 'GET',
    path: '/users',
    handler: (req, done) => {
        act({ role: 'users', cmd: 'find' })
            .then(res => done(res));
    }
});

server.route({
    method: 'POST',
    path: '/cooperatives',
    config: {
        payload: {
            output: 'data',
            parse: true,
        },
    },
    handler: (req, done) => {
        act({ role: 'cooperative', cmd: 'create', cooperative: req.payload })
            .then(res => done(res));
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
