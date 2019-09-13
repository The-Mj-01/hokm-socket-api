module.exports = (game, player) => {
   try {
      const sendCard = card => {
         card.hasSuit = false;
         game.sendChat('🤖', player.location);
         return player.events.emit('pickCard', { card });
      };

      player.isTurn = false;
      const { hokm } = game;
      const { suit } = game.table;

      const avaibledSuits = player.cards.filter(card => card.suit === suit);

      if (avaibledSuits.length > 0) {
         const card = avaibledSuits[avaibledSuits.length - 1];
         return sendCard(card);
      }

      // const hokmCards = player.cards.filter(card => card.suit === hokm);

      // if (hokmCards.length > 0) {
      //    const card = hokmCards[hokmCards.length - 1];
      //    sendCard(card);
      // }

      const card = player.cards[0];
      if (!card) return;
      return sendCard(card);
   } catch (e) {
      console.warn('autoCardError');
      console.warn(e);
      e.internalServerError('autoCardError');
   }
};
