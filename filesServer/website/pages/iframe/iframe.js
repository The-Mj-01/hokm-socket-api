const path = require('path');

ind = function (app , route) {
    app.get(route , (req , res) =>{
        res.sendFile(path.join(__dirname + '/iframe.html'))
    });
};

exports.ind = ind;

