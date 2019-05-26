function run(e) {
    e.setStatus('setHakem');
    e.teamEmit('game_start',e.players);
    e.run();
}
module.exports=run;