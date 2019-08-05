const onPlayerPick = require('./PreRound').onPlayerPick;

async function emit(e, mess, location) {
    mess.location = location;
    await e.teamEmit('playerPickCard', mess);
}


async function run(e, res, location) {
    console.log('P');

    async function add() {
        e.table.getTurnPlayer().card = res.card;
        e.table.preRound++;
        await emit(e, res, location);
        onPlayerPick(e)
    }

    if (typeof e.table.suit === 'undefined') { // don't use !e.table.suit
        e.table.suit = res.card.suit;
        res.card.hasSuit = true;
        await add();
    } else {
        if (res.card.suit === e.table.suit) await add();
        else if (res.card.hasSuit === false) await add();
        else {
            console.log("WTF 1".yellow);
            console.log(JSON.stringify(res));
        }
    }
}


module.exports = run;