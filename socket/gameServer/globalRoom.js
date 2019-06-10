
const gamesManager = require('./gamesManager');



let playersQueue=[];
let roomNum=0;
let loc=["bottom","left","top","right"];
const globalHokm = require('../io').of('/globalHokm');


newPlayer=function (client,pData,socket_ID) {
    client.join('globalWaiters');
    client.emit('room_id','globalWaiters');
    if (socket_ID){
        playersQueue.push({
            socket_ID,
            client,
            pData,
        });

    }
    if (playersQueue.length===4)newGlobalGame();
    else if (playersQueue.length>4)console.log("playersQueue.length>4  WTF?!!!");
    else newPlayerEmit(pData.userName)



};
newPlayerEmit=function (name) {
    globalHokm.in('globalWaiters').emit("GAME",{
        COM:'newPlayer',
        res:{
            name:name,
            length : playersQueue.length
        }

    })
};
leftPlayerEmit=function (name) {
    globalHokm.in('globalWaiters').emit("GAME",{
        COM:'leftPlayer',
        res:{
            name:name,
            length : playersQueue.length
        }

    })
};

removePlayer=function (socket_ID) {
 playersQueue.forEach((item, index, object)=>{
     if (item.socket_ID === socket_ID){
         object.splice(index, 1);
         leftPlayerEmit(item.pData.userName)
     }
 })
};
newGlobalGame=function(){
    let room_id=newRoom();
    let roomData={
        room_id,
        rounds:null,
        players:[]
    };
    playersQueue.forEach((player,ind)=>{

        roomData.players[ind]={
            id:player.pData.id,
            name:player.pData.userName,
            location:loc[ind],
            score:''
        };
        clientEmit(player.client,room_id,roomData.players[ind].location);
    });
    playersQueue=[];
    gamesManager.createGlobal(room_id , roomData)
};
function clientEmit(client,room_id,location) {
    client.leave("globalWaiters");
    client.join(room_id);
    client.emit('room_id',room_id);
    client.emit("GAME",({
        COM:'config',
        res:{
            room_id:room_id,
            location:location
        }
    }))
}
function newRoom(){
    let room_id=`globalGame${roomNum}`;
    roomNum++;
    return room_id;
}


exports.newPlayer=newPlayer;
exports.removePlayer=removePlayer;
