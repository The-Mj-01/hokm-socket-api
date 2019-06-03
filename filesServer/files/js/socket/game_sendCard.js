define(["../config",],(config)=>{
    return function (cards,nc,game) {
        if (window.socket.connected) {
            let yourCard = game.run.getPlayers()[0].row.cards;
            let hasSuit = false;
            let currnetSuit = config.getSuit() * 1;
            if (currnetSuit === 0 || currnetSuit === 1 || currnetSuit === 2 || currnetSuit === 3) {
                let plyaer_i = game.run.getPlayers()[0];
                let myCards = plyaer_i.row.cards;
                myCards.forEach((e) => {
                    if (e.suit == currnetSuit) hasSuit = true
                })
            }

            let room_id = config.getRoom_id();
            window.socket.emit('GAME', {
                room_id: room_id,
                COM: 'pickCard',
                res: {
                    card: {
                        id: nc.id,
                        num: nc.num,
                        suit: nc.suit,
                        hasSuit: hasSuit
                    },
                    location: config.getLocation()
                }
            });

            yourCard.forEach((card) => {
                card.display.setSelectable(false)
            });
        }
        else console.log("you are disconnected!")
    }
});