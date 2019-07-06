
const gamesManager = require('./gamesManager');


let roomNum=0;
const get_RoomID = () => (`globalRoom_${roomNum}`);
let QueGame = newGame();

function newGame () {
    roomNum++;
    return gamesManager.createGlobal( get_RoomID() , {});
};

newPlayer=function (client , playerData) {
    QueGame.addplayer(client , null , {
        name: playerData.userName,
        tgID: playerData.id
    });
    if (QueGame._isGameStarted){
        QueGame = newGame()
    }

};


exports.newPlayer=newPlayer;
