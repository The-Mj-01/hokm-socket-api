const timeout = ms => new Promise(res => setTimeout(res, ms));
const hokmString = ['pik', 'del', 'gish', 'khesht'];

async function run(e) {
   const cards = e.cards.slice(0, 5);
   await e.teamPush('newRound', {
      mode: 'setHokm',
      hakemCards: cards,
      hakem: e.hakem.toView()
   });
   await timeout(3000);

   const autoHokmTimeout = setTimeout(
      //todo fix;
      () =>
         e.hakem.events.emit('setHokm', {
            hokm: hokmString[Math.floor(Math.random() * 4)]
         }),
      e.hakem.getBotTimeout()
   );

   e.hakem.events.once('setHokm', mess => {
      clearTimeout(autoHokmTimeout);
      e._setHokmEvent(mess.hokm, true);
   });

   e.waitingForPlayer = e.hakem;
   await e.teamPush('setHokm', e.hakem.toView());
}
module.exports = run;
