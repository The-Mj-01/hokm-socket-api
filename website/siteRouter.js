var siteRoutes = {};


siteRoutes['hokm'] = require("./pages/hokm/hokm").run;
siteRoutes['GlobalHokm'] = require("./pages/globalHokm/ghokm").run;
siteRoutes['pingTest'] = require("./pages/pingTest/pingTest").run;
siteRoutes['IGHokm'] = require("./pages/iframe/iframe").run;





req = function (req , res) {
    let cond = typeof siteRoutes[req.parsed_url[1]] === 'function';
    if (cond) siteRoutes[req.parsed_url[1]](req , res);

    else {
        if (req.method.toLowerCase()==='post') res.status(404).send({status:'err',err:'404 not found'});
        else require("./pages/404/404").run(req , res);
    }

};



exports.req = req;
