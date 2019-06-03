//const GAME_nextPlayer=require('./GAME_nextPlayer');
const onPlayerPick = require('./PreRound').onPlayerPick;

function run(e,res) {
    if (e.preRoundGame[e.roundNum].location === res.location) {
        if (e.suit === 'notSet') {
            e.preRoundGame[e.roundNum].card = res.card;
            e.suit = res.card.suit;
            res.card.hasSuit = true;
            emit(res, e);
            onPlayerPick(e)
        } else {
            if (res.card.suit * 1 === e.suit * 1) add();
            else if (res.card.hasSuit === false) add();

            function add() {
                e.preRoundGame[e.roundNum].card = res.card;
                e.preRoundGame = (e.preRoundGame);
                emit(res, e);
                onPlayerPick(e)
            }
        }
    }
}

function emit(mess,e){
    e.teamEmit('playerPickCard',mess);
}
module.exports=run;