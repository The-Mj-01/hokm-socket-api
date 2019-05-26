const S_res=require('./serverResponse');
Ok=function (req , res ,data) {
    let newData={
        ok:true,
        result:data

    };
    S_res.write(req , res ,JSON.stringify(newData));

};
err=function (req ,rse ,err,msg) {
     let newData={
        ok:false,
        detail:err
    };
     if (msg) newData.msgtext=msg;
    S_res.write(req , rse ,JSON.stringify(newData));

};
cls=function(req ,res ,cls,detail){
    let newData={
        ok:true,
        detail:detail
    };


    S_res.write(req ,res ,JSON.stringify(newData));

};

exports.Ok=Ok;
exports.err=err;
exports.cls=cls;