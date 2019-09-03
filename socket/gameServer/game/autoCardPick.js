module.exports = (game, player) => {
   const sendCard = card => {
      card.hasSuit = false;
      game.sendChat('🤖' , player.location)
      return game._pickCard(card, player.location, player);
   };

   player.isTurn = false;
   const { hokm } = game;
   console.log('hokm', hokm);
   const { suit } = game.table;
   const avaibledSuits = player.cards.filter(card => card.suit === suit);

   if (avaibledSuits.length > 0) {
      console.log('bySuit', avaibledSuits.length);
      const card = avaibledSuits[avaibledSuits.length - 1];
      sendCard(card);

   }

   const hokmCards = player.cards.filter(card => card.suit === hokm);

   if (hokmCards.length > 0) {
      console.log('byHokm', hokmCards.length);
      const card = hokmCards[hokmCards.length - 1];
      sendCard(card);
   }
   console.log('brReg');

   const card = player.cards[0];
   if (!card) return;
   sendCard(card);

};
