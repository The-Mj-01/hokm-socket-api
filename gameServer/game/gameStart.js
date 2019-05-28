function run(e) {
    e.teamEmit('game_start',e.players);
    e.run('newRound');
}
module.exports=run;