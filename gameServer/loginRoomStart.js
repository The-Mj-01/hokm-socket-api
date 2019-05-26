let dba=require('./database');
let startGame=require('./game/startPrim');
let newPlayer=require('./game/newPlayer');let x;


run = function (socket, r) {

    let x;
    let rooms = dba.getRooms();
    if (r)
        if (r.room_id)
        try {x = rooms.findOne({'id': r.room_id});} catch (e) {console.log(e)}
        if (x)
            if (r.location==="auto")autoSelect(r,x);
            if (typeof x.players !== 'object') x.players = [];
            let player = {
                name: r.userName,
                location: r.location,
                score: ''
            };
            socket.client.join(r.room_id);
            x.players.push(player);
            emit(socket, r.location);
            if (x.players.length === 4) startGame(x,socket.io);
            else newPlayerEmit(socket,r.room_id,r.userName)

};
function newPlayerEmit(socket,room_id,username) {
    socket.io.in(room_id).emit("GAME",{
        COM:'newPlayer',
        res:{
            name:username
        }
    })
}
function emit(socket,location){
    socket.client.emit('LoginOk', location);
}
function autoSelect(r,x){
    let loc=["bottom","left","top","right"];
    let players=x.players.length;
    r.location=loc[players]

}
module.exports = run;