let borCard=require('./shuffleDeck');
let setHokm=require('./GAME_setHokm');
let endGame=require('./GAME_endGame');

function run(e) {

    let this_round = e.getRoundPlayed();
    if (this_round < e.rounds) {
        e.setPreRound(0);
        e.setHokm('notSet');
        e.setPreRoundStarter(e.hakem);
            let boredCard = [];
            boredCard = borCard();
            e.setCards(boredCard);
            let hakem = e.hakem;
            e.setCards(boredCard);
            let cards = boredCard.slice(0, 5);

            if (hakem) {
                e.setStatus('waitForSetHokm');
                e.teamEmit('newRound', {
                    mode: 'setHokm', hakemCards: cards, hakem: hakem
                });
            }
            if (this_round>0){
                e.teamEmit('readyForNew',true);
                setHokm(e);
            }

    }
    else   endGame(e,0);


}
module.exports=run;