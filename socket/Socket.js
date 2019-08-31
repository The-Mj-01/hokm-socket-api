const namespaces = require('./Namespaces');
const io = require('./io');

module.exports = (server) => {
    const socket = io(server , {'pingInterval': 2000});
    namespaces.addNS(socket);
    console.log('Socket RUNNING')
};

