const timeout = ms => new Promise(res => setTimeout(res, ms));

async function run(e) {
    const cards = e.cards.slice(0, 5);
    e.teamEmit('newRound', {
        mode: 'setHokm', hakemCards: cards, hakem: e.hakem
    });
    await timeout(3000);

    e.teamEmit("setHokm",e.hakem);
}
module.exports=run;