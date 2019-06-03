const hokmPage = require("../hokm/hokm");


ind = function (app , routeName) {
        app.get(routeName , hokmPage.servPage)
};

exports.ind = ind;

