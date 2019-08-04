const { nextof } = require('./Location');
const EndPreRound = require("./EndPreRound");
const timeout = ms => new Promise(res => setTimeout(res, ms));
const Round = require("./Round");

async function nextPlayer(e){
    const player = e.table.getTurnPlayer();
    player.events.once('pickCard' , ( card ) => {
        player.isTurn = false;
        e._pickCard(card , player.location , player)
    });
    await e.teamEmit('setTurn',{
        player : player.toView(),
        suit   : e.table.suit
    });
    player.isTurn = true;


}
newPreRound = async function(e , _starter){
    e.table.suit = 'notSet';
    const starter = _starter || e.preRoundStarter;

    const { players } = e;
    e.table.players = [
        players[starter.location],
        players[nextof(starter.location ,1)],
        players[nextof(starter.location ,2)],
        players[nextof(starter.location ,3)]
    ];
    e.table.preRound = 0;
    await nextPlayer(e);
};

onPlayerPick = async function(e) {
    if (e.roundNum === 3) {
        await endPreRound(e);
        return
    }
    e.roundNum ++;
    await nextPlayer(e)
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