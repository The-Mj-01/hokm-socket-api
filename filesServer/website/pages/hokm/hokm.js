const path = require('path');

exports.ind = function (app , route) {
    app.get(route , (req , res) => {
        res.sendFile(path.join(__dirname + '/index.html'))
    });
};

