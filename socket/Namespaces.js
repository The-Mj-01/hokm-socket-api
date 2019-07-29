const    nameSpaces = ['hokm' , 'globalHokm' ,  'pingTest'];
const    M_globalRoom = require('./gameServer/globalRoom');
const    M_loginRoomStart = require('./gameServer/loginRoomStart');
const    M_loginRoom = require('./gameServer/loginRoom');
const    GameHookRouter = require('./gameServer/gamesManager').route;
const    myDebug = require('./myDebug');
const auth = require('./gameServer/auth');
let io;




getNameSpaces = function(NSs){
    let returnNSpaces = {};
    NSs.forEach((ns)=>{
        returnNSpaces[ns]= io.of(`/${ns}`)
    });
    return returnNSpaces
};

addNS=function(_io) {
    io = _io;
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
            //myDebug('singUpGlobalRoom',client,data);
            //console.log(client.handshake.headers);


            (M_globalRoom.newPlayer)(client, data, client.id, globalHokm)
        });


    });




};
function everyNS(client) {
    client.on('pingT', (x) => {
        client.emit('pongT', true);
    });

    client.on('token', (token) => {
        const userData = auth.verify(token);
        if (userData) {
            client.userData = userData;
            GameHookRouter(client , {COM: 'JOIN_ME' , res: client})
        }

    });

    client.on('error', function (err) {
        myDebug('error',client,err);
    });

}


exports.addNS=addNS;
