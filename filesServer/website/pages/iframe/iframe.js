const path = require('path');
const hokmPage = require("../hokm/hokm");


ind = function (app , route) {
    app.get(route , hokmPage.servPage)
};

exports.ind = ind;

