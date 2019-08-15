
const gamesManager = require('./gamesManager');


let roomNum=0;
const get_RoomID = () => (`globalRoom_${roomNum}`);
let QueGame = newGame();

function newGame () {
    roomNum++;
    return gamesManager.createGlobal(get_RoomID(), {});
}

newPlayer=function (client , playerData) {
    const { game_id , rounds } = playerData;
    if (game_id && rounds) {
        const game = gamesManager.createPrivate(game_id , { rounds });
        return game.addplayer(client , null , {
            name: playerData.userName,
            tgID: playerData.id
        });
    }
    QueGame.addplayer(client , null , {
        name: playerData.userName,
        tgID: playerData.id
    });
    if (QueGame._isGameStarted){
        QueGame = newGame()
    }

};


exports.newPlayer=newPlayer;
