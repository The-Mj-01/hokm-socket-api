const path = require('path');

run = function (req , res) {
    res.sendFile(path.join(__dirname + '/pingTest.html'))
};

exports.run = run;
