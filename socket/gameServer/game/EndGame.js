const apiReq = require('../../server&routers/apiGetReq');
const url = require('../../../glob_var').app.hook_url;
const removeGame = require('../gamesManager').removeGame;

function run(e, mode, forceEndPlayer) {
   if (e._isGameFinished) return;
   e._isGameFinished = true;
   let dataX = null;
   const playerData = daleteBadPlayersData(e);

   if (mode === 0) {
      e.teamPush('gameEnd', true, true);
      dataX = post_endGame(e, playerData);
   } else if (mode === 1) {
      e.teamPush('gameEnd', { player: { name: forceEndPlayer.name } }, true);
      dataX = post_forceEndGame(e, playerData, forceEndPlayer);
   } else if (mode === 2) {
      e.teamPush('gameEnd', { player: { name: forceEndPlayer.name } }, true);
      dataX = post_gameIsClose(e, playerData, forceEndPlayer);
   }
   console.log(`to host: ${JSON.stringify(dataX)}`);
   apiReq.post(url, dataX, data => {
      //console.log(data);
   });

   removeGame(e.room_id);
}

function post_endGame(e, PD) {
   return {
      mode: 0,
      gameType: e.gameType,
      room_id: e.Game,
      players: PD,
      teamScore: e.roundteamScore
   };
}

function post_forceEndGame(e, PD, forceEndPlayer) {
   return {
      mode: 1,
      gameType: e.gameType,
      forceEndPlayer: {
         name: forceEndPlayer.name,
         location: forceEndPlayer.location
      },
      room_id: e.room_id,
      players: PD,
      teamScore: e.roundteamScore
   };
}

function post_gameIsClose(e, PD, forceEndPlayer) {
   return {
      mode: 2,
      gameType: e.gameType,
      forceEndPlayer: {
         name: forceEndPlayer.name,
         location: forceEndPlayer.location
      },
      room_id: e.room_id,
      players: PD,
      teamScore: e.roundteamScore
   };
}

daleteBadPlayersData = function(e) {
   let p = [];
   e.players.toArray().forEach(player => {
      p.push({
         name: player.name,
         location: player.location
      });
      if (player.id) {
         p.push({
            id: player.id
         });
      }
   });
   return e.players.toArray().map(p => {
      const { name, location, tgID } = p;
      return { name, location, tgID };
   });
};
module.exports = run;
