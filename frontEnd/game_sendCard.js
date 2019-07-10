import config from './config'

export default function (cards, nc, game) {
    if (window.socket.connected) {
        const yourCard = game.run.getPlayers()[0].row.cards;
        let hasSuit = false;
        const currnetSuit = config.getSuit() * 1;
        if (currnetSuit === 0 || currnetSuit === 1 || currnetSuit === 2 || currnetSuit === 3) {
            let plyaer_i = game.run.getPlayers()[0];
            let myCards = plyaer_i.row.cards;
            myCards.forEach((e) => {
                if (e.suit === currnetSuit) hasSuit = true
            })
        }

        window.gameEmitor('pickCard', {
                card: {
                    id: nc.id,
                    num: nc.num,
                    suit: nc.suit,
                    hasSuit: hasSuit
                }
            }
        );

        yourCard.forEach((card) => {
            card.display.setSelectable(false)
        });
        return true;

    } else {
        alert("disconnected from server");
        return false;
    }
};
