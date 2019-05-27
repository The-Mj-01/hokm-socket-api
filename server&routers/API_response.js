Ok=function (req , res ,data) {
    let newData={
        ok:true,
        result:data
    };
    res.status(200).send(newData)

};
err=function (req ,res ,err,msg) {
     let newData={
        ok:false,
        detail:err
    };
     if (msg) newData.msgtext=msg;
     res.status(400).send(newData)

};
cls=function(req ,res ,cls,detail){
    let newData={
        ok:true,
        detail:detail
    };
    res.status(300).send(newData)

};

exports.Ok=Ok;
exports.err=err;
exports.cls=cls;