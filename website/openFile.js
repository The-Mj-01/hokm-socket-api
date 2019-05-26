const fs = require('fs');
const glob = require('../glob_var');
const S_res = require('../server&routers/serverResponse');
let htmlChunk = '';

let ram_Data={};

FS_errCB = function (req_data, error) {
    let msg = 'FS Error:' + '\nOn url:' + req_data.url ;
    console.log('FS ERROR: '+req_data.url+'\n'+error);
    S_res.writeErr(req_data, msg);

};


//----------------------------------------------------
html = function (req_data, htmlFileName, callback) {
       if (glob.app.cache_pages ===false)ram_Data[htmlFileName]=false;
    if(ram_Data[htmlFileName]){
        //load from ram
        callback(req_data, ram_Data[htmlFileName]);
    }
    else {
        let urlChunk = './website/pages/' + htmlFileName  + '.html';
        fs.readFile(urlChunk, "UTF-8", function (err, data) {
                if (err) {
                    FS_errCB(req_data, err, req_data.url);
                }
                if (data) {
                    htmlChunk = data.toString();
                    ram_Data[htmlFileName] = htmlChunk;
                    //load from HDD
                    callback(req_data, htmlChunk);
                }
            }
        );
    }

};
servPage = function (req_data, CB_html) {
    try {

        req_data.response.writeHead(200, {"Content-Type": "text/html"});
        req_data.response.end(CB_html);
    }
    catch (e) {

        console.log('that e');

    }

};




exports.html = html;
exports.servPage = servPage;


