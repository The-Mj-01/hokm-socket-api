const namespaces = require('./Namespaces');
const port = require('../glob_var').app.ports.socket;
const io = require('./io');
const db = require('./gameServer/database');

module.exports = (server) => {
    const socket = io(server , {'pingInterval': 2000});

    db.newDB();
    namespaces.addNS(socket);

    console.log('Socket RUNNING')
};

