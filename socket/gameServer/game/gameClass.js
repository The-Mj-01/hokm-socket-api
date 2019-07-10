const Player = require('./Player');
const cardPick = require('./CardPick');
const endGame=require('./EndGame');
const returnMeBackToRoom = require('./returnMeBackToRoom');
const io = require('../../io');
const myDebuger = require('../../myDebug');
const chat = require('./chat');
const { toNum } = require('./Location');
const Promise = require('bluebird');




const routes = {
    start:require('./gameStart'),
    newRound:require('./Round').newRound,
    setHakem:require('./SetHakem'),
    newPreRound:require('./PreRound'),
    onHokmSeted :require('./Round').onHokmSet,
};

Game=function (room_id,rounds,roomData) {
    this.newTime=0;
    this.oldTime=new Date().getTime();
    this.room_id = room_id;
    

    this.commits = [];
    this.timer=null;
    this.players = {
        0: null,
        1: null,
        2: null,
        3: null
    };
    this.players.toArray = function () {
        const players = [ this[0] , this[1] , this[2] , this[3] ];
        return  players.filter((p) => p != null);
    };


    this.rounds = rounds;
    this.gameType = roomData.type;
    this.namespace = roomData.namespace;
    this.preRoundteamScore={
        topB:0,
        rightL:0
    };
    this.roundteamScore={
        topB:0,
        rightL:0
    };
    this._isGameStarted = false;
    this.hakem='notSet';
    this.hokm='';
    this.cards=[];
    this.roundNum=0;
    this.suit='notSet';
    this.status= 'start';
    this.preRound= 0;
    this.preRoundStarter='notSet';
    this.preRoundPlayerNum = 0;
    this.zamine='notSet';
    this.preRoundGame=[];
    this.numofPlayers = 0;
    this.setUpdate();


};

Game.prototype.emit = function(x , y){ // todo: remove
    io.of('/globalHokm').in(this.room_id).emit(x, y)
};

Game.prototype.addplayer = function(scoket ,location , playerData) {
    const {name, tgID} = playerData;
    if (location) location = toNum(location);
    else location = this.getEmptyLocations()[0];

    if (this.players[location]) this.players[location].setupNewSocket(scoket);

    else {
        this.numofPlayers++;
        const player = new Player(scoket, location, this, name, tgID);
        this.players[location] = player;
        const onlines = this.numofPlayers;
        if (onlines < 4 )this.teamEmit('newPlayer', {name , length: onlines});
        player.events.on('disconnect' , () => {
            if (!this._isGameStarted) {
                this.numofPlayers--;
                delete this.players[location]
            }
        });
        if (!this._isGameStarted && this.players.toArray().length >= 4){
            this.run('start');
        }
    }
};

// Game.prototype.teamEmit=function(COM,res){
//     this.emit('GAME', {
//         COM: COM,
//         res: res
//     });
// };
Game.prototype.teamEmit = function(COM , res , withoutCB){
    return Promise.all(this.players.toArray().map(p => p.send(COM , res , withoutCB)))
};
Game.prototype.run=function(status){
    if (status) this.status = status;
    if (typeof routes[this.status]==='function')routes[this.status](this)
};
Game.prototype.setStatus=function(status){
    if (status)this.status=status;
};

Game.prototype.setHokm = async function(hokm){
        this.hokm = hokm;
        if (this.hokm && this.hokm !== 'notSet' && this.hakem){
            await this.teamEmit("setHokm",this.hakem)
        }
};
Game.prototype.sendChat = function(chatMess , location){
    chat(this , chatMess , location);
};
Game.prototype._setHokmEvent = async function(hokm,emit){
    if (hokm && this.status==='waitForSetHokm') {
        this.hokm = hokm;
        if (emit) await this.teamEmit('hokmSeted', hokm);
        this.run('onHokmSeted');
    }
    else  {
        console.log('bad status');
        console.log(this.status)
    }
};

Game.prototype._joinOfflinePlayer = function(socket){
    if (!this._isGameStarted) return;
    const { location } = socket.userData;
    console.log(location);
    const [player] = this.players.toArray().filter((p) => p.location === location);
    if (player) player.setupNewSocket(socket);
};

Game.prototype._forceEndGame = function(player){
    endGame(this,1, player.name)
};
Game.prototype._pickCard=function(card , location){
    cardPick(this , card , location)
};
Game.prototype.hook=function(id,mess){
    this.setUpdate();
    const  { COM } = mess;
    if (COM === 'JOIN_ME') this._joinOfflinePlayer(mess.res);
};

Game.prototype.getRoundPlayed=function(){
    return this.roundteamScore.topB + this.roundteamScore.rightL
};


Game.prototype.nextOf=function(player,x){  // todo: remove
  let a={bottom:0,left:1,top:2,right:3};
  let b=a[player.location]+x;
    if (b===4)b=0;
    if (b===5)b=1;
    if (b===6)b=2;
    if (b===7)b=3;
    return b
};

Game.prototype.setUpdate=function(){
    self=this;
    this.stopUpdateTime();
    this.newTime = new Date().getTime();
    this.oldTime = this.newTime;

    this.timer = setTimeout(()=>{
         checkUpdateTime(this)
     },(5*60*1000)+100)
};
Game.prototype.stopUpdateTime=function(){
    if (this.timer)clearTimeout(this.timer);
};
Game.prototype.renewPreRoundScore=function () {
    this.preRoundteamScore.rightL=0;
    this.preRoundteamScore.topB=0;
    this.roundNum = 0
};

Game.prototype.getEmptyLocations=function () {
    const defaultLocations = [0 , 1 , 2 , 3];
    const usedLocations = this.players.toArray().map((p) => p.location);
    return defaultLocations.filter((loc) => {
        const location = usedLocations.filter((l) => loc === l );
        return (location.length === 0);
    });
};

function checkUpdateTime(self){
    self.newTime = new Date().getTime();
    let delta = self.newTime - self.oldTime;
    if (delta > (5*60*1000) && this._isGameStarted){
     endGame(self,2)
    }
}




module.exports=Game;