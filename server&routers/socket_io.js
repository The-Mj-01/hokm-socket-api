const funcx = require("funcx")(Function);
const nameSpaces = ['hokm' , 'globalHokm' ,  'pingTest'];

const    M_globalRoom = require('../gameServer/globalRoom')
const    M_loginRoomStart = require('../gameServer/loginRoomStart')
const    M_loginRoom = require('../gameServer/loginRoom')
const    GAME_input_router = require('../gameServer/game/GameHookRouter');

getNameSpaces = function(NSs, io){
    let returnNSpaces = {};
    NSs.forEach((ns)=>{
      returnNSpaces[ns]= io.of(ns)
    });
    return returnNSpaces
};

let io;
newSocket=function(_io) {
    io = _io;
    const {hokm , globalHokm , pingTest} = getNameSpaces(nameSpaces , io);

    pingTest.on('connection', client => {
        client.on('pingT',()=>{
            client.emit('pongT');
        });
    });

    hokm.on('connection', client => {
        const socket= {io: hokm,client: client};
        everyNS(client,socket);
        client.on('loginRoom',(room)=>{
            let socketID="stb_"+client.id;
            client.emit('setSocketID',socketID);
            client.socketID=socketID;
            M_loginRoom(socket,room)
        });

        client.on('loginRoomStart',(room) => {
            M_loginRoomStart(socket,room)
        });

    });
    globalHokm.on('connection', (client) => {

        const  socket = {io: globalHokm, client: client};
        everyNS(client, socket);
        client.on('singUpGlobalRoom', (data) => {
            funcx(M_globalRoom.newPlayer)(client, data, client.id, globalHokm)
        });
        client.on('disconnect', (r) => {
            funcx(M_globalRoom.removePlayer)(client.id)
        })

    });
    io.connectX();



};
function everyNS(client,socket) {
        client.on('pingT', (x) => {
            client.emit('pongT', true);
        });

        client.on('returnRoom', (mess) => {
            client.join(mess.room);
            const message = {
                room_id: mess.room,
                COM: 'returnMeBackToRoom',
                res: {client , lastCOM: mess.lastCOM}
            };
            funcx(GAME_input_router.route)(client.id, message);


        });
        client.on('GAME', (mess) => {
            funcx(GAME_input_router.route)(client.id, mess);

        });
        client.on('getMyID', (mess) => {
            client.emit("GAME", {
                COM: "test", res: client.id
            })
        });
        client.on('error', function (err) {
            console.log(err)
        });

}
function getIo(){
    return io;
}



exports.new=newSocket;
exports.getIo=getIo;