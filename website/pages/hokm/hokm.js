const openFile = require('../../openFile');
const newRoom = require("../../../gameServer/newRoom");
const path = require('path');


run = function (req , res) {
if (req.method.toLowerCase()==='get') servPgae(req , res);
else if (req.method.toLowerCase()==='post')newRoom.postnew(req , res) ;

};



servPgae = function (req , res) {
    res.sendFile(path.join(__dirname + '/index.html'))
};




exports.run = run;
exports.servPgae = servPgae;

