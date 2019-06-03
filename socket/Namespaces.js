const    nameSpaces = ['hokm' , 'globalHokm' ,  'pingTest'];
const    M_globalRoom = require('./gameServer/globalRoom');
const    M_loginRoomStart = require('./gameServer/loginRoomStart');
const    M_loginRoom = require('./gameServer/loginRoom');
const    GameHookRouter = require('./gameServer/gamesManager').route;
const    io = require('./io');
const    myDebug = require('./myDebug');



getNameSpaces = function(NSs){
    let returnNSpaces = {};
    NSs.forEach((ns)=>{
        returnNSpaces[ns]= io.of(ns)
    });
    return returnNSpaces
};

addNS=function() {
    const {hokm , globalHokm , pingTest} = getNameSpaces(nameSpaces);

    pingTest.on('connection', client => {
        client.on('pingT',()=>{
            client.emit('pongT');
        });
    });
    hokm.on('connection', client => {
        const socket= {io: hokm,client: client};
        everyNS(client,socket);
        client.on('loginRoom',(room)=>{
            const socketID="stb_"+client.id;
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
            myDebug('singUpGlobalRoom',client,data);

            (M_globalRoom.newPlayer)(client, data, client.id, globalHokm)
        });
        client.on('disconnect', (r) => {
            myDebug('disconnect',client, r);

            (M_globalRoom.removePlayer)(client.id)
        })

    });




};
function everyNS(client) {
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
       // GameHookRouter(client.id, message);


    });
    client.on('GAME', (mess) => {
        myDebug('mess',client,mess);
        GameHookRouter(client.id, mess);

    });
    client.on('getMyID', (mess) => {
        client.emit("GAME", {
            COM: "test", res: client.id
        })
    });
    client.on('error', function (err) {
        myDebug('error',client,err);
    });

}


exports.addNS=addNS;
