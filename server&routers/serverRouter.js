const apiResponse = require("./API_response");
const querystring = require("querystring");
const siteRouter = require("./../website/siteRouter");
const url = require("url");

route = function (req , res ) {
    let pathname=url.parse(req.url).pathname;
    req.urlquery=querystring.parse(url.parse(req.url).query);
    req.parsed_url = pathname.split("/");
    req.apiRes = apiResponse;
    if(req.url==='/favicon.ico') return;
    siteRouter.req(req , res);
};



exports.route = route;
