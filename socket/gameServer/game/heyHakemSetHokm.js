const timeout = ms => new Promise(res => setTimeout(res, ms));

async function run(e) {
  const cards = e.cards.slice(0, 5);
  await e.teamPush("newRound", {
    mode: "setHokm",
    hakemCards: cards,
    hakem: e.hakem.toView()
  });
  await timeout(3000);

  e.hakem.events.once("setHokm", mess => e._setHokmEvent(mess.hokm, true));
  e.waitingForPlayer = e.hakem;
  await e.teamPush("setHokm", e.hakem.toView());
}
module.exports = run;
