const  siteRoutes = {};
const P404 = require('./website/pages/404/404');
siteRoutes['/'] = require("./website/pages/hokm/hokm").ind;
siteRoutes['/pingTest'] = require("./website/pages/pingTest/pingTest").ind;

index = function (app) {
    for(let route in siteRoutes) {
        siteRoutes[route](app , route);
    }
    app.get('*', P404.res);
    app.post('*', (req , res) => {
        res.status(404).send({err : "API not found"})
    })


};



module.exports = index;
