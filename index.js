console.clear();

process.setUncaughtExceptionCaptureCallback = function(err){
    console.warn('BAD ERR')
    console.warn(err);
}

const files = require('./filesServer/Files');
const socket = require('./socket/Socket');

const server = files();
socket(server);
