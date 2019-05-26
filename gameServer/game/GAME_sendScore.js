x=function (e) {
e.teamEmit('teamScore',{
    round:e.preRoundteamScore,game:e.roundteamScore
})
};

module.exports=x;