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
    const playerData = daleteBadPlayersData(e);


    if (mode === 0) {
        e.teamEmit("gameEnd", true , true);
        dataX = post_endGame(e , playerData);

    } else if (mode === 1) {
        e.teamEmit("gameEnd", {player: {name: forceEndPlayer}} , true);

    } else if (mode === 2) {
        e.teamEmit("gameEnd", true , true);
        dataX = post_gameIsClose(e , playerData);
    }
    console.log(`to host: ${JSON.stringify(dataX)}`);
    apiReq.post(url, dataX, (data) => {
        //console.log(data);
    });

    clearFromDb(e);
    e.players.toArray().map((p) => {
        p.delete();
    });
    removeGame(e.room_id);

}

function post_endGame(e , PD) {
    return {
        mode: 0,
        gameType:e.gameType,
        room_id: e.Game,
        players: PD,
        teamScore: e.roundteamScore
    };



}

function post_forceEndGame(e, forceEndPlayer , PD) {
    if (forceEndPlayer) {
        return {
            mode: 1,
            gameType:e.gameType,
            forceEndPlayer: forceEndPlayer,
            room_id: e.Game,
            players: PD,
            teamScore: e.roundteamScore
        }

    }

}

function post_gameIsClose(e , PD) {
    return {
        mode: 2,
        gameType:e.gameType,
        room_id: e.Game,
        players: PD,
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
    let p = [];
    e.players.toArray().forEach(player=>{
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
    return e.players.toArray().map(p => {
        const { name , location ,  tgID} = p;
        return { name , location , tgID }
    });
};
module.exports = run;


