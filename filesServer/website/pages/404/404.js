const path = require('path');

res = function (req ,res) {
    res.sendFile(path.join(__dirname + '/404.html'))
};

exports.res = res;
