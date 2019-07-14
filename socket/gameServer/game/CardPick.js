const onPlayerPick = require('./PreRound').onPlayerPick;

async function emit(e, mess, location) {
    mess.location = location;
    await e.teamEmit('playerPickCard', mess);
}


async function run(e, res, location) {
    console.log('P');

    async function add() {
        e.preRoundGame[e.roundNum].card = res.card;
        await emit(e, res, location);
        onPlayerPick(e)
    }

    if (e.suit === 'notSet') {
        e.suit = res.card.suit;
        res.card.hasSuit = true;
        await add();
    } else {
        if (res.card.suit === e.suit) await add();
        else if (res.card.hasSuit === false) await add();
        else {
            console.log("WTF 1".yellow);
            console.log(JSON.stringify(res));
        }
    }
}


module.exports = run;