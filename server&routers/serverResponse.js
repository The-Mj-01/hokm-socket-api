
writeM=function (req_data,data) {

    req_data.response.write(data);

};


writeHeadERR=function (req , res) {
    try {
        res.writeHead(404, {"Content-Type": "application/json"});
    }
    catch (e) {
        console.log(e);
    }
};
writeHead=function (req , res) {
    try {
        res.writeHead(200, {"Content-Type": "application/json"});
    }
    catch (e) {
        console.log(e);
    }
};

writeEnd=function (req , res) {
    req.close = true;
    res.end();

};
write=function (req , res ,data) {

   if (!req.close) {

       writeHead(req , res);

       res.write(data);
       writeEnd(req , res);
   } else console.log('ERR: serverResponse: this mess sent over close: ' + data);



};
writeErr=function (req , res ,data) {


    if(!req.close) {
        writeHeadERR(req , res);
        res.write(data);
        writeEnd(req , res);
    }
    else console.log('ERR: serverResponse: this mess sent over close: '+data);


};

exports.write = write;
exports.writeHead = writeHead;
exports.writeEnd = writeEnd;
exports.writeM = writeM;
exports.writeErr = writeErr;