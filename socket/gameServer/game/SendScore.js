x = function(e) {
   e.teamPush('teamScore', {
      round: e.preRoundteamScore,
      game: e.roundteamScore
   });
};

module.exports = x;
