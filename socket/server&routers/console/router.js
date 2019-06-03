const gio=require('../socket_io');
let routes={};

routes.clear=console.clear;
routes.test=function (cm) {
   let  io=gio.getIo();
    io.to("test").emit('GAME',{
        COM: 'test',
        res:'test one'
    });
};
routes.testAll=function (cm) {
    let  io=gio.getIo();
    io.emit('GAME',{
        COM: 'test',
        res:'test one'
    });
};
routes.testPlayers=function (cm) {
    let  io=gio.getIo();
    io.sockets.clinet

};

route=function (command) {
    if (typeof routes[command]==='function'){
        routes[command](command);
        console.log("command RUN")
    }
    else console.log("CM not found");
};

function parse(com){
    return com.split(' ');
}

module.exports=route;