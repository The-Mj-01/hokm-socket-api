console.clear();
const files = require('./filesServer/Files');
const socket = require('./socket/Socket');

const server = files();
socket(server);
