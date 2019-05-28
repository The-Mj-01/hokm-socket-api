let dba=require('../database');
let newListenner=require('./GameHookRouter').newListenner;

let borCard=require('./shuffleDeck');
const Game=require('./gameClass');

run=function (roomData,io) {
    let room_id=roomData.id;
    let rounds=roomData.rounds;

    let playersSorted=[];
    playersSorted[0]=findPlayer('bottom',roomData);
    playersSorted[1]=findPlayer('left',roomData);
    playersSorted[2]=findPlayer('top',roomData);
    playersSorted[3]=findPlayer('right',roomData);
    roomData.players=playersSorted;
    roomData.type="private";
   let game=new Game(room_id,rounds,roomData,io);
    newListenner(room_id,(id,mess)=>{
       game.hook(id,mess)
    });
   game.setStatus('start');
   game.run();

};
function findPlayer(loc,roomData){
    return roomData.players.find(p=>{return p.location === loc})
}

module.exports=run;