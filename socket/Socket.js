const namespaces = require('./Namespaces');
const io = require('./io');

module.exports = server => {
   const socket = io(server);
   socket.set('heartbeat timeout', 10000);
   socket.set('heartbeat interval', 5000);
   namespaces.addNS(socket);
   console.log('Socket RUNNING');
};
