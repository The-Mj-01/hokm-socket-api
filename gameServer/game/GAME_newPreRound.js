let borCard=require('./shuffleDeck');
const sendScore = require("./GAME_sendScore");
let roundWinner;


function run(e) {

    e.setZamine('notSet');
    e.setRounNum(0);
    e.setSuit('notSet');
    e.setRounNum(0);

    let rl=e.preRoundteamScore.rightL;
    let tb= e.preRoundteamScore.topB;
    if (tb<7 && rl<7)newRound(e);
    else endRound(e);


}
function setNewHakem(e){
    let hakemLoc=e.nextOf(e.hakem,1);
    e.setHakem(e.players[hakemLoc]);
    e.teamEmit('setHakem', {
        roundOne:false, hakem: e.hakem,
    });


}
function game_CheckCoat(e) {
    if (e.preRoundteamScore.rightL === 0 || e.preRoundteamScore.topB=== 0)
    if (roundWinner === 'topB' || roundWinner === 'rightL')
        if (e.hakem.location === 'top' || e.hakem.location === 'bottom') {
            if (roundWinner === 'topB') e.roundteamScore.topB++;
            else if (roundWinner === 'rightL') e.roundteamScore.rightL += 2
        }
       else  if (e.hakem.location === 'right' || e.hakem.location === 'left') {
            if (roundWinner === 'rightL') e.roundteamScore.rightL++;
            else if (roundWinner === 'topB') e.roundteamScore.topB += 2
        }

}
function endRound(e){

    if (e.preRoundteamScore.rightL > e.preRoundteamScore.topB){
        roundWinner='rightL';
        game_CheckCoat(e);
        e.roundteamScore.rightL++;
        if (e.hakem.location ==='top' || e.hakem.location ==='bottom') setNewHakem(e)


    }
    else if (e.preRoundteamScore.rightL < e.preRoundteamScore.topB){
        roundWinner='topB';
        game_CheckCoat(e);
        e.roundteamScore.topB++;
        if (e.hakem.location ==='right' || e.hakem.location ==='left') setNewHakem(e)

    }

    e.renewPreRoundScore();
    setTimeout(()=>{sendScore(e);},3000);
    e.setStatus('newRound');
    e.run()
}
function newRound(e){
    let preRound=e.getRoundPlayed();
    let starter=e.get().preRoundStarter;
    if (starter) {
        let players=e.get().players;
        let first=e.getPlayerLoc(starter);
        let second=e.nextOf(starter,1);
        let third=e.nextOf(starter,2);
        let fourth=e.nextOf(starter,3);
        let preRoundGame=[
            players[first],
            players[second],
            players[third],
            players[fourth]
        ];
        e.setPreRoundGame(preRoundGame);
        e.teamEmit('setTurn',{player:preRoundGame[0],zamine:e.zamine,suit:e.suit});
        e.setPreRound(preRound + 1);
        e.setStatus('resumePreRound')

    }
}
module.exports=run;