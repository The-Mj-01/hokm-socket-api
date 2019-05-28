
const EndPreRound = require("./EndPreRound");
const timeout = ms => new Promise(res => setTimeout(res, ms));
const Round = require("./Round");

function nextPlayer(e){
    e.teamEmit('setTurn',{player:e.preRoundGame[e.roundNum],zamine:e.zamine,suit:e.suit});
}
newPreRound = function(e , _starter){
    e.zamine = 'notSet';
    e.suit = 'notSet';
    if (_starter) e.roundNum = 0;
    const starter = _starter || e.preRoundStarter;
    const players=e.players;
    const first=e.getPlayerLoc(starter);
    const second=e.nextOf(starter,1);
    const third=e.nextOf(starter,2);
    const fourth=e.nextOf(starter,3);
    e.preRoundGame = [
        players[first],
        players[second],
        players[third],
        players[fourth]
    ];
    nextPlayer(e , e.hakem);
};

onPlayerPick = function(e) {
    if (e.roundNum === 3) {
        endPreRound(e);
        return
    }
    e.roundNum ++;
    nextPlayer(e)
};
endPreRound = async function(e){
    await timeout(1000);
    EndPreRound(e);
    await timeout(1000);
    checkToEndPreRoundOrNot(e)


};
checkToEndPreRoundOrNot = function(e){
    const rl=e.preRoundteamScore.rightL;
    const tb= e.preRoundteamScore.topB;
    if (tb<7 && rl<7) newPreRound(e);
    else Round.onRoundEnd(e);
};
exports.newPreRound = newPreRound;
exports.onPlayerPick = onPlayerPick;