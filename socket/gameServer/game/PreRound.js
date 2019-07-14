const { nextof } = require('./Location');
const EndPreRound = require("./EndPreRound");
const timeout = ms => new Promise(res => setTimeout(res, ms));
const Round = require("./Round");

async function nextPlayer(e){
    const player = e.preRoundGame[e.roundNum];
    await e.teamEmit('setTurn',{
        player : player.toView(),
        zamine : e.zamine,
        suit   : e.suit
    });

    player.events.once('pickCard' , ( card ) => {
        e._pickCard(card , player.location , player)
    })

}
newPreRound = async function(e , _starter){
    e.zamine = 'notSet';
    e.suit = 'notSet';
    e.roundNum = 0;
    const starter = _starter || e.preRoundStarter;
    const players = e.players;
    const first = starter.location;
    const second = nextof(starter.location ,1);
    const third = nextof(starter.location ,2);
    const fourth = nextof(starter.location ,3);
    e.preRoundGame = [
        players[first],
        players[second],
        players[third],
        players[fourth]
    ];
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