const io = require('socket.io');
let socket;
module.exports = (server) => {
    if (!socket){
        socket = io(server)
    }
    return socket
};