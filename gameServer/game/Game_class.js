const cardPick=require('./GAME_cardPick');
const endGame=require('./GAME_endGame');
const returnMeBackToRoom = require('./returnMeBackToRoom');
let io;



const routes = {
    start:require('./GAME_start'),
    setHakem:require('./GAME_setHakem'),
    newRound:require('./GAME_newRound'),
    newPreRound:require('./GAME_newPreRound'),
    hokmSeted:require('./GAME_hokmSeted'),
};

Game=function (room_id,rounds,roomData,_io) {
    this.newTime=0;
    this.oldTime=new Date().getTime();
    this.commits = [];
    this.timer=null;
     io = _io;
     this.setUpdate();


    this.room_id=room_id;
    this.rounds=rounds;
    this.gameType=roomData.type;
    this.players=roomData.players;
    this.preRoundteamScore={
        topB:0,
        rightL:0
    };
    this.roundteamScore={
        topB:0,
        rightL:0
    };
    this.hakem='notSet';
    this.hokm='';
    this.cards=[];
    this.roundNum=0;
    this.suit='notSet';
    this.status='start';
    this.round=0;
    this.preRound=0;
    this.preRoundStarter='notSet';
    this.zamine='notSet';
    this.preRoundGame=[];

};
Game.prototype.teamEmit=function(COM,res){
    this.commits.push({
        COM, res
    });
    io.in(this.room_id).emit('GAME', {
        COM: COM,
        res: res
    });

};
Game.prototype.run=function(){
    if (typeof routes[this.status]==='function')routes[this.status](this)
};
Game.prototype.setStatus=function(status){
    if (status)this.status=status;
};
Game.prototype.setHakem=function(hakem){
    if (hakem)this.hakem=hakem;
};

Game.prototype.setHokm=function(hokm){
        this.hokm = hokm;
};
Game.prototype.setHokmHook=function(hokm,emit){
    if (hokm && this.status==='waitForSetHokm') {
        this.hokm = hokm;
        if (emit) this.teamEmit('hokmSeted', hokm);
        this.setStatus('hokmSeted');
        this.run();
    }
    else  console.log(this.status)


};


Game.prototype.pickCard=function(res){
   cardPick(this,res)
};
Game.prototype.hook=function(id,mess){
    this.setUpdate();
    const com = mess.COM;
    if (com === 'setHokm') this.setHokmHook(mess.res.hokm,true);
    else if (com === 'pickCard') this.pickCard(mess.res);
    else if (com ==='forceStop') endGame(this,1,mess.res)
    else if (com ==='returnMeBackToRoom') returnMeBackToRoom(this,mess.res)
};
Game.prototype.setCards=function(C){
    this.cards=C;
};

Game.prototype.setPreRoundStarter=function(C){
    this.preRoundStarter=C;
};

Game.prototype.setRound=function(C){
    this.round=C;
};

Game.prototype.getRoundPlayed=function(){
    return this.roundteamScore.topB + this.roundteamScore.rightL
};
Game.prototype.setPreRound=function(C){
    this.preRound=C;
};

Game.prototype.get=function(){
    return this
};
Game.prototype.setZamine=function(c){
    this.zamine=c
};
Game.prototype.setPreRoundGame=function(c){
    this.preRoundGame=c
};
Game.prototype.setSuit=function(c){
    this.suit=c
};
Game.prototype.setRounNum=function(c){
    this.roundNum=c
};

Game.prototype.nextOf=function(player,x){
  let a={bottom:0,left:1,top:2,right:3};
  let b=a[player.location]+x;
    if (b===4)b=0;
    if (b===5)b=1;
    if (b===6)b=2;
    if (b===7)b=3;
    return b
};
Game.prototype.getPlayerLoc=function(player){
    return {bottom:0,left:1,top:2,right:3}[player.location]
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
    this.preRoundteamScore.topB=0
};
function checkUpdateTime(self){
    self.newTime = new Date().getTime();
    let delta = self.newTime - self.oldTime;
    if (delta > (5*60*1000)){
     endGame(self,2)
    }

}




module.exports=Game;