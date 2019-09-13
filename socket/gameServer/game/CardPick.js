const onPlayerPick = require('./PreRound').onPlayerPick;

async function emit(e, mess, location) {
   mess.location = location;
   await e.teamPush('playerPickCard', mess);
}

async function run(e, card, location) {
   async function add(player) {
      player.card = card;
      player.cards = player.cards.filter((c) => c.id !== card.id);
      e.table.preRound++;
      await emit(e, { card }, location);
      onPlayerPick(e);
   }

   const player = e.table.getTurnPlayer();
   if (!player) return console.log('alert no player');
   if (!player.cards.map(c => c.id).includes(card.id)) return player.pushEvent('moveMess' , 'BAD CARD')
   if (typeof e.table.suit === 'undefined') {
      // don't use !e.table.suit
      e.table.suit = card.suit;
      card.hasSuit = true;
      await add(player);
   } else {
      if (card.suit === e.table.suit) await add(player);
      else if (card.hasSuit === false) await add(player);
      else {
         console.log('WTF 1'.yellow);
         console.log(JSON.stringify(card));
      }
   }
}

module.exports = run;
