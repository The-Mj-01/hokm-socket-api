let playersQueue=[];
let roomNum=0;
let rounds=7;
let loc=["bottom","left","top","right"];
const  newRoomMod=require("./newRoom");
let io;
const newListenner=require('./game/GameHookRouter').newListenner;
const Game = require('./game/gameClass');


newPlayer=function (client,pData,socket_ID,_io) {
    io=_io;
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
    io.in('globalWaiters').emit("GAME",{
        COM:'newPlayer',
        res:{
            name:name,
            length : playersQueue.length
        }

    })
};
leftPlayerEmit=function (name) {
    io.in('globalWaiters').emit("GAME",{
        COM:'leftPlayer',
        res:{
            name:name,
            length : playersQueue.length
        }

    })
};

function x(df){
    if (df)return df.pData;
    else return "NOTSET"
}
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
        rounds:rounds,
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
    roomData.type="global";
    playersQueue=[];
    runGame(room_id,roomData)

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
    newRoomMod.newRoom(room_id,rounds);
    return room_id;
}
function runGame(room_id,roomData){
    let game = new Game(room_id,rounds,roomData,io);
    newListenner(room_id,(id,mess)=>{
        game.hook(id,mess)
    });

    game.setStatus('start');
    game.run();
}



exports.newPlayer=newPlayer;
exports.removePlayer=removePlayer;