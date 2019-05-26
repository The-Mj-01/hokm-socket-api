let borCard=require('./shuffleDeck');
let setHokm=require('./GAME_setHokm');

function run(e) {
    var players=e.players;
    let bored = borCard(), hakem;
    for (let i = 0; i < bored.length; i++) {
        if (bored[i] === 12 || bored[i] === 25 || bored[i] === 38 || bored[i] === 51) {
            send(i,e);
            break;
        }
    }

    function send(i,e) {
        hakem = players[i % 4];
        e.setHakem(hakem);
        e.teamEmit('setHakem', {
            roundOne:true,cards: bored, i: i, hakem: hakem, start: players[0],
        });
        e.setHokm('notSet',false);
        e.setStatus('newRound');

       setTimeout(()=>{
           e.run();
           setHokm(e)
       },5000);
    }

}
module.exports=run;