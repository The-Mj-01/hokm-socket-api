const  shuffleCards = require('./shuffleDeck');
const endGame = require('./EndGame');
const heyHakemSetHokm = require('./heyHakemSetHokm');
const PreRound = require('./PreRound');
const setNewHakem = require('./SetHakem');
const timeout = ms => new Promise(res => setTimeout(res, ms));
const sendScore = require("./SendScore");
const globalRounds = require('../../../glob_var').game.globalRounds;


newRound = async function (e) {
    setNewHakem(e);
    e.renewPreRoundScore();
    sendScore(e);
    e.cards = shuffleCards();
    await timeout(1500);
    heyHakemSetHokm(e);
    e.status = 'waitForSetHokm';
};

onHokmSet = async function (e) {
    e.teamEmit('newRound', {
        mode: 'allPlayers', cards: e.cards, hakem: e.hakem
    });
    await timeout(10000);

    PreRound.newPreRound(e , e.hakem);
};

onRoundEnd = function (e) {
    let roundWinner;
    if (e.preRoundteamScore.rightL > e.preRoundteamScore.topB){
        roundWinner='rightL';
        game_CheckCoat(e);
        e.roundteamScore.rightL++;
    }
    else if (e.preRoundteamScore.rightL < e.preRoundteamScore.topB){
        roundWinner = 'topB';
        game_CheckCoat(e);
        e.roundteamScore.topB++;

    }
    if (endGameCondition(e)) {
        sendScore(e);
        endGame(e,0);
        return
    }
    newRound(e);

    function game_CheckCoat(e) {
        if (e.preRoundteamScore.rightL === 0 || e.preRoundteamScore.topB=== 0)
            if (roundWinner === 'topB' || roundWinner === 'rightL')
                if (e.hakem.location === 'top' || e.hakem.location === 'bottom') {
                    if (roundWinner === 'topB') e.roundteamScore.topB++;
                    else if (roundWinner === 'rightL') e.roundteamScore.rightL += 2
                }
                else  if (e.hakem.location === 'right' || e.hakem.location === 'left') {
                    if (roundWinner === 'rightL') e.roundteamScore.rightL++;
                    else if (roundWinner === 'topB') e.roundteamScore.topB += 2
                }

    }
};

endGameCondition = function(e){
  if (e.gameType === 'global'){
      return (e.roundteamScore.rightL >= globalRounds || e.roundteamScore.topB >= globalRounds)
  }
  else return (e.getRoundPlayed() >= e.rounds)
};






exports.newRound = newRound;
exports.onHokmSet = onHokmSet;
exports.onRoundEnd = onRoundEnd;