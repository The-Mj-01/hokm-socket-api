const  siteRoutes = {};
const P404 = require('./website/pages/404/404');
siteRoutes['/hokm'] = require("./website/pages/hokm/hokm").ind;
siteRoutes['/GlobalHokm'] = require("./website/pages/globalHokm/ghokm").ind;
siteRoutes['/pingTest'] = require("./website/pages/pingTest/pingTest").ind;
siteRoutes['/IGHokm'] = require("./website/pages/iframe/iframe").ind;



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
