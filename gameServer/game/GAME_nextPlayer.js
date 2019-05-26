let borCard=require('./shuffleDeck');

function run(e,res) {
    let preRoundGame=e.preRoundGame;
    e.teamEmit('setTurn',{player:preRoundGame[e.roundNum],zamine:e.get().zamine,suit:e.suit});


}

module.exports=run;