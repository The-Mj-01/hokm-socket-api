const borCard = require('./shuffleDeck');
const { nextof } = require('./Location');

function  getCardsToSetHakem(e) {
    const players = e.players;
    let bored = borCard();
    for (let i = 0; i < bored.length; i++) {
        if (bored[i] === 12 || bored[i] === 25 || bored[i] === 38 || bored[i] === 51) return {bored,i,players};
    }
}

async function run(e) {
   if (e.getRoundPlayed() === 0){
       const { bored , i , players} = getCardsToSetHakem(e);
       const hakem = players[i % 4];
       e.hakem = hakem;
       await e.teamPush('setHakem', {
           roundOne:true, cards: bored, i: i, hakem: hakem.toView(), start: players[0].toView(),
       });

   } else {
       if (e.preRoundteamScore.rightL > e.preRoundteamScore.topB){
           if (e.hakem.location === 2 || e.hakem.location === 0) await setNewHakem(e)
       }
       else if (e.preRoundteamScore.rightL < e.preRoundteamScore.topB){
           if (e.hakem.location === 3 || e.hakem.location === 1) await setNewHakem(e)
       }
   }



}
async function setNewHakem(e){
    const newHakemLoc = nextof(e.hakem.location,1);
    e.hakem = e.players[newHakemLoc];
    await e.teamPush('setHakem', {
        roundOne:false, hakem: e.hakem.toView(),
    });
}

module.exports=run;