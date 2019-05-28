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

function run(e) {
   if (e.getRoundPlayed() === 0){
       const { bored , i , players} = getCardsToSetHakem(e);
       const hakem = players[i % 4];
       e.hakem = hakem;
       e.teamEmit('setHakem', {
           roundOne:true, cards: bored, i: i, hakem: hakem, start: players[0],
       });
   } else {
       if (e.preRoundteamScore.rightL > e.preRoundteamScore.topB){
           if (e.hakem.location ==='top' || e.hakem.location ==='bottom') setNewHakem(e)
       }
       else if (e.preRoundteamScore.rightL < e.preRoundteamScore.topB){
           if (e.hakem.location ==='right' || e.hakem.location ==='left') setNewHakem(e)
       }
   }



}
function setNewHakem(e){
    const hakemLoc = e.nextOf(e.hakem,1);
    e.hakem = e.players[hakemLoc];
    e.teamEmit('setHakem', {
        roundOne:false, hakem: e.hakem,
    });
}

module.exports=run;