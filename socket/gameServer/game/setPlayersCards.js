const { times } = require('ramda');
const { nextof } = require('./Location');

const sliceCards = (cards) => {

    const slicedCards = [];
    cards = cards.map(id => ({
        id,
        num : id % 13 + 1,
        suit: id % 4
    }))
    let t = 0;
    times((i) => {
        const eachPlayerCard = i === 0 ? 5 : 4;
        times(() => {
            slicedCards.push(cards.slice(t , t + eachPlayerCard));
            t = t + eachPlayerCard;
        } , 4)
    } , 3)

    const sliceByPlayer = [[] , [] , [] , []];
    times((i) => {
        const player = i % 4;
        sliceByPlayer[player].push(...slicedCards[i]);
    } , slicedCards.length)
    return sliceByPlayer;
}

module.exports = (e) => {
    cards = e.cards.length === 52 ? sliceCards(e.cards) : undefined;
    const hakemLocation = e.hakem.location;
    const players = e.players.toArray();

    players[hakemLocation].cards = cards[0]
    players[nextof(hakemLocation , 1)].cards = cards[1]
    players[nextof(hakemLocation , 2)].cards = cards[2]
    players[nextof(hakemLocation , 3)].cards = cards[3]

}