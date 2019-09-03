async function run(e) {
    e._isGameStarted = true;
    const payload = e.players.toArray()
        .map(p => p.toView());
    await e.teamPush('game_start' , payload);
    e.run('newRound');
}
module.exports=run;