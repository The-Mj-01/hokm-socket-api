const timeout = ms => new Promise(res => setTimeout(res, ms));

async function run(e) {
    const cards = e.cards.slice(0, 5);
    await e.teamEmit('newRound', {
        mode: 'setHokm', hakemCards: cards, hakem: e.hakem.toView()
    });
    await timeout(3000);

    await e.teamEmit("setHokm",e.hakem.toView());
    e.hakem.events.once('setHokm' , (mess) => e._setHokmEvent(mess.hokm , true))

}
module.exports=run;