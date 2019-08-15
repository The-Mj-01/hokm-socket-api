
const gamesManager = require('./gamesManager');

newPlayer=function (client , playerData) {
    const { game_id , rounds } = playerData;
    if (game_id && rounds) {
        const game = gamesManager.getPrivate(game_id , { rounds });
        return game.addplayer(client , null , {
            name: playerData.userName,
            tgID: playerData.id
        });
    }
    else {
        const game = gamesManager.getGlobal();
        return game.addplayer(client , null , {
            name: playerData.userName,
            tgID: playerData.id
        });

    }
};


exports.newPlayer=newPlayer;
