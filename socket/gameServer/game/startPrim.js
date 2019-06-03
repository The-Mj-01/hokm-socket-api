const createGame=require('../gamesManager').createPrivate;

run=function (roomData,io) {
    let room_id=roomData.id;
    let rounds=roomData.rounds;

    let playersSorted=[];
    playersSorted[0]=findPlayer('bottom',roomData);
    playersSorted[1]=findPlayer('left',roomData);
    playersSorted[2]=findPlayer('top',roomData);
    playersSorted[3]=findPlayer('right',roomData);
    roomData.players=playersSorted;
    createGame(room_id , roomData)

};
function findPlayer(loc,roomData){
    return roomData.players.find(p => {return p.location === loc})
}

module.exports=run;