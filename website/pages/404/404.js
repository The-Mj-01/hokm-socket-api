const path = require('path');

run = function (req , res) {
    res.sendFile(path.join(__dirname + '/404.html'))
};

exports.run = run;
