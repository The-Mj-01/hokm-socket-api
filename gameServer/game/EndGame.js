const apiReq = require('../../server&routers/apiGetReq');
const funcx = require('funcx')(Function);
const url = require('../../glob_var').app.hook_url;
const input_router = require('./GameHookRouter');
const dba = require('../database');
let dataX;

function run(e, mode, forceEndPlayer) {

    dataX = undefined;
    try {
        e.stopUpdateTime();
    } catch (error) {
        mode = 2;
        console.log(e);
        console.log(error)
    }
    funcx(daleteBadPlayersData)(e)(err=>{
        console.log(err)
    });

    if (mode === 0) {
        e.teamEmit("gameEnd", true);
        dataX = post_endGame(e);
        input_router.removeListenner(e.room_id);

    } else if (mode === 1) {
        e.teamEmit("gameEnd", true);
        if (forceEndPlayer)
            if (forceEndPlayer.name)
        e.teamEmit("alert", forceEndPlayer.name + " بازی را ترک کرد");
        dataX = post_forceEndGame(e, forceEndPlayer);
        input_router.removeListenner(e.room_id);

    } else if (mode === 2) {
        e.teamEmit("alert", "بازی به علت غیرفعال بودن بازیکنان، تمام شد.");
        e.teamEmit("gameEnd", true);
        dataX = post_gameIsClose(e);
        input_router.removeListenner(e.room_id);

    }
    if (dataX) {
       apiReq.post(url, dataX, (data) => {});
    }
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
    let room = dba.getRoomsUpdate();
    room.chain().find({'id': e.room_id}).update((x) => {
        x.id = null;
        x.players = [];
        x.rounds = null;
    })

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


