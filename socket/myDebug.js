const colors = require('colors');
const debug = function(title, socket , mess){
    if (process.env.DBU === "T") console.log(`${(title).green} -- ${socket.id} -- ${JSON.stringify(mess)}`)

};
module.exports = debug;