const newRoom = require("../../../../socket/gameServer/newRoom");
const path = require('path');


ind = function (app , route) {
    app.get(route , servPage);
    app.post(route , newRoom.postnew);
};



servPage = function (req , res) {
    res.sendFile(path.join(__dirname + '/index.html'))
};

exports.ind = ind;
exports.servPage = servPage;

