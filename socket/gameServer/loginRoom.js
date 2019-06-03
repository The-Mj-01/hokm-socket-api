let dba=require('./database');

run = function (socket, data) {
    let room_id=data.room;
    let rooms = dba.getRoomsUpdate();

    if (room_id) {
        try {
            let x = rooms.find({'id': room_id});
            if (x.length === 1) {
                x=x[0];
                if (x.players){
                    if (x.players.length<4) ok(socket,x.players);
                    else socket.client.emit('errBOX','این بازی پر هست!!!');
                }
                else ok(socket,[]);
            }
            else socket.client.emit('errBOX','این بازی وجود ندارد.');
        } catch (e) {
            console.log(e);
        }
    }

};
function ok(socket,players){
    socket.client.emit('checkOK', players);
}
module.exports = run;