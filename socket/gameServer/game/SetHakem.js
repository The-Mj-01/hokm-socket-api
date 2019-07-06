let borCard=require('./shuffleDeck');
let setHokm=require('./heyHakemSetHokm');


function  getCardsToSetHakem(e) {
    const players = e.players;
    let bored = borCard();
    for (let i = 0; i < bored.length; i++) {
        if (bored[i] === 12 || bored[i] === 25 || bored[i] === 38 || bored[i] === 51) {
            return {bored,i,players};
        }
    }
}

async function run(e) {
   if (e.getRoundPlayed() === 0){
       const { bored , i , players} = getCardsToSetHakem(e);
       const hakem = players[i % 4];
       e.hakem = hakem;
       await e.teamEmit('setHakem', {
           roundOne:true, cards: bored, i: i, hakem: hakem.toView(), start: players[0].toView(),
       });

   } else {
       if (e.preRoundteamScore.rightL > e.preRoundteamScore.topB){
           if (e.hakem.location ==='top' || e.hakem.location ==='bottom') await setNewHakem(e)
       }
       else if (e.preRoundteamScore.rightL < e.preRoundteamScore.topB){
           if (e.hakem.location ==='right' || e.hakem.location ==='left') await setNewHakem(e)
       }
   }



}
async function setNewHakem(e){
    const hakemLoc = e.nextOf(e.hakem,1);
    e.hakem = e.players[hakemLoc];
    await e.teamEmit('setHakem', {
        roundOne:false, hakem: e.hakem.toView(),
    });
}

module.exports=run;