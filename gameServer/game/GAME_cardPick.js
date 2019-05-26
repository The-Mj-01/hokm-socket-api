let borCard=require('./shuffleDeck');
let GAME_nextPlayer=require('./GAME_nextPlayer');
let GAME_endPreRound=require('./GAME_endPreRound');

function run(e,res) {
    let roundNum=e.roundNum*1;

    let preRoundGame=e.preRoundGame;
    let suit=e.suit;
    //let hokmSuit=e.suit
    let location=e.getPlayerLoc({location:res.location});
    if (suit==='notSet'){
        let roundNum=e.roundNum;
        preRoundGame[roundNum].card=res.card;
        e.setPreRoundGame(preRoundGame);
        roundNum ++;
        e.setRounNum(roundNum);
        e.setSuit(res.card.suit);
        res.card.hasSuit=true;
        GAME_nextPlayer(e);
        emit(res,e)
    }
    else {
        if (roundNum < 4) {

            if (res.card.suit * 1 == suit * 1) add();
            else if (res.card.hasSuit === false) add();
            if (roundNum===4){
                setTimeout(()=>{
                    GAME_endPreRound(e); 
                },2000)
                
            }
            function add() {
                preRoundGame[roundNum].card = res.card;
                preRoundGame.forEach((p)=>{
                 //   console.log(p.card)
                });
                e.setPreRoundGame(preRoundGame);
                roundNum++;
                e.setRounNum(roundNum);

                GAME_nextPlayer(e);
                emit(res, e)
            }

        }
    }




}
function emit(mess,e){
    e.teamEmit('playerPickCard',mess);
}
module.exports=run;