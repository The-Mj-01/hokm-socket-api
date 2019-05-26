let borCard=require('./shuffleDeck');

function run(e) {

    let hokm=e.hokm;
    //console.log(hokm);
        let hakem = e.get().hakem;
        e.setPreRoundStarter(e.hakem);
        let cards = e.get().cards;
        e.teamEmit('newRound', {
                mode: 'allPlayers', cards: cards, hakem: hakem
            });
        e.setStatus('newPreRound');
    setTimeout(()=>{
        e.run()
    },12000)




}
module.exports=run;