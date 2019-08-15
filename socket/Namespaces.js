const    nameSpaces = ['Hokm' ,'pingTest'];
const    GameFactory = require('./gameServer/GameFactory');
// const    M_loginRoomStart = require('./gameServer/loginRoomStart');
// const    M_loginRoom = require('./gameServer/loginRoom');
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
    const {Hokm , pingTest} = getNameSpaces(nameSpaces);

    pingTest.on('connection', client => {
        client.on('pingT',() => client.emit('pongT'));
    });
    Hokm.on('connection', (client) => {
        everyNS(client);
        client.once('JOIN_ME', (data) => GameFactory.newPlayer(client, data));
    });

};
function everyNS(client) {
    client.on('pingT',()=> client.emit('pongT'));

    client.on('token', (token) => {
        const userData = auth.verify(token);
        if (userData) {
            client.userData = userData;
            GameHookRouter(client , {COM: 'JOIN_ME' , res: client})
        }

    });

    client.on('error', function (err) {
        console.log('ERROR' , err);
        myDebug('error',client,err);
    });

}


exports.addNS=addNS;
