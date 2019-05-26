const openFile = require('../../openFile');
const api_res = require('../../../server&routers/API_response');
const page404 = require('../404/404');
const newRoom = require("../../../gameServer/newRoom");
const path = require('path');
const hokmPgae = require("../hokm/hokm");


run = function (req , res) {
        if ( req.parsed_url[2]==='getS' ) getSession(req , res);
        else setSession(req , res);
};
function setSession (req , res){

    if (req.postData){
        let data = req.postData;
        const userName = data.userName || "noname";
        const id = data.id * 1;
        if (userName && id){
            req.session.data={
                id,
                userName
            };
            hokmPgae.servPgae(req , res);
        }
    }
    else if (req.query){
        let data=req.query;
        const userName = data.userName || "noname";
        const id = data.id * 1;
        if (userName && id){
            req.session.data={
                id,
                userName
            };
            hokmPgae.servPgae(req , res);
        }
    }
    else  {api_res.err(req , res,"userName or id notFound")}
}

function getSession (req , res){
    let session = req.session;
    if (session){
        if(session.data)
            api_res.Ok(req , res ,session.data)
    }
    else  api_res.err(req , res,"noSession")
}








exports.run = run;

