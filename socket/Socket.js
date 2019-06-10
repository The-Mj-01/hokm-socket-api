const namespaces = require('./Namespaces');
const port = require('../glob_var').app.ports.socket;
const io = require('./io');
const db = require('./gameServer/database');

module.exports = () => {
    db.newDB();
    namespaces.addNS(io);
    io.set('transports', ['websocket']); //only ws
    io.listen(port,{'pingTimeout':4000, 'pingInterval':2000});
    console.log('Socket RUNNING')
};

