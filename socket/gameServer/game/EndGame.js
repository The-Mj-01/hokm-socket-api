const apiReq = require('../../server&routers/apiGetReq');
const url = require('../../../glob_var').app.hook_url;
const removeGame = require('../gamesManager').removeGame;
const dba = require('../database');

function run(e, mode, forceEndPlayer) {
    let dataX = null;

    try {
        e.stopUpdateTime();
    } catch (error) {
        mode = 2;
        console.log(e);
        console.log(error)
    }
    daleteBadPlayersData(e);


    if (mode === 0) {
        e.teamEmit("gameEnd", true);
        dataX = post_endGame(e);
        removeGame(e.room_id);

    } else if (mode === 1) {
        e.teamEmit("gameEnd", true);
        if (forceEndPlayer)
            if (forceEndPlayer.name)
        e.teamEmit("alert", forceEndPlayer.name + " بازی را ترک کرد");
        dataX = post_forceEndGame(e, forceEndPlayer);
        removeGame(e.room_id);

    } else if (mode === 2) {
        e.teamEmit("alert", "بازی به علت غیرفعال بودن بازیکنان، تمام شد.");
        e.teamEmit("gameEnd", true);
        dataX = post_gameIsClose(e);
        removeGame(e.room_id);
    }
    if (dataX) apiReq.post(url, dataX, (data) => {});

    clearFromDb(e);
}

function post_endGame(e) {
    return {
        mode: 0,
        gameType:e.gameType,
        room_id: e.room_id,
        players: e.players,
        teamScore: e.roundteamScore
    };



}

function post_forceEndGame(e, forceEndPlayer) {
    if (forceEndPlayer) {
        return {
            mode: 1,
            gameType:e.gameType,
            forceEndPlayer: forceEndPlayer,
            room_id: e.room_id,
            players: e.players,
            teamScore: e.roundteamScore
        }

    }

}

function post_gameIsClose(e) {
    return {
        mode: 2,
        gameType:e.gameType,
        room_id: e.room_id,
        players: e.players,
        teamScore: e.roundteamScore
    };

}

function clearFromDb(e) {
    const room = dba.getRoomsUpdate();
    try {
        room.chain().find({'id': e.room_id}).update((x) => {
            x.id = null;
            x.players = [];
            x.rounds = null;
        })
    }
    catch (e) {
        console.log('no game fined in loki to remove')
    }


}
daleteBadPlayersData=function(e){
    let p=[];
    e.players.forEach(player=>{
        p.push({
            name:player.name,
            location:player.location
        });
        if (player.id){
            p.push({
                id:player.id
            });
        }
    });
    e.players=p;
};
module.exports = run;


