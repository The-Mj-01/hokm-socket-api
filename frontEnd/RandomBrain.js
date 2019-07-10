import Brain from './Brain'
//import $ from './jquery-2.0.3.min'


const RandomBrain = function (user) {
    Brain.call(this, user);
};

RandomBrain.prototype = Object.create(Brain.prototype);

RandomBrain.prototype.decide = function (validCards) {
    return $.Deferred().resolve(validCards[Math.floor(Math.random() * validCards.length)].ind);
};

export default RandomBrain;
