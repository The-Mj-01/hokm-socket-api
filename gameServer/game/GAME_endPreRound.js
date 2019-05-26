const sendScore = require("./GAME_sendScore");
let borCard=require('./shuffleDeck');

let hs={pik:0,del:1,gish:2,khesht:3};

function run(e) {
    let hokmSwit=hs[e.hokm];
    let preRoundGame=(e.get().preRoundGame);
   // let newP=[];
    let winner={};
    let winnerScore=0;
    preRoundGame.forEach((p)=>{
        let c=p.card;
        c.isHokm=p.card.suit*1 === hokmSwit*1;
        c.isSuit=p.card.suit*1 === e.suit*1;
        c.score=c.num;
        if (c.isSuit === true) c.score=  c.score + 100;
        if (c.isHokm === true) c.score=  c.score + 10000;
        if (c.score>winnerScore){winnerScore=c.score;winner=p}
    });

    winner.location==='top'||winner.location==='bottom' ? e.preRoundteamScore.topB++ : e.preRoundteamScore.rightL++;
/*
    if (winner.location==='top'||winner.location==='bottom'){
        e.preRoundteamScore.topB++;
    }
    else {
        e.preRoundteamScore.rightL++;
    }*/
    e.teamEmit('toWaste',{
        location:winner.location,
        card:winner.card
    });

    sendScore(e);

    e.setPreRoundStarter(winner);
    e.setStatus('newPreRound');
    e.run()


}
module.exports=run;