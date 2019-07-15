const { toNum } = require('./Location');
const EventEmitter = require('events');
const auth = require('../auth');
const Promise = require('bluebird');
const crypto = require("crypto");
const c = require('colors');
const mess_ID_Gen = () => crypto.randomBytes(5).toString('hex');
Player = function (scoket , location , Game ,name , tgID) {
    this.Game = Game;
    this.name = name;
    this.tgID = tgID;
    this.gameType = 'Global';
    this.location = toNum(location);
    this.events = new EventEmitter();
    this.on = this.events.on;
    this.once = this.events.once;
    this.isOnline = true;
    this.messQueue = [];
    this.isWaitingForCB = false;
    this.setGameEvents();


    this.setupNewSocket(scoket);
    this.sendConfig();
    this.sendToken();
};

Player.prototype.setupNewSocket = function (socket) {
    this.socket = socket;
    socket.join(this.Game.room_id);
    setEvents(this.socket , this.events , this);
    const self = this;
    if (!this.isOnline){
        this.Game.teamEmit('player_connect' , {
            location: self.location,
        });

        this.isOnline = true;
    }
};

Player.prototype.sendConfig = function () {
    this.socket.emit('config' , {
        room_id: this.Game.room_id,
        location: this.location
    })
};

Player.prototype.setGameEvents = function () {
    const Game = this.Game;
    this.events.on('chat' , (mess) => {
        Game.sendChat(mess , this.location);
    });
    this.events.on('update' , () => {
        Game.setUpdate();
    });
    this.events.on('disconnect' , () => {
        this.isOnline = false;
        const self = this;
        if (this.Game) this.Game.teamEmit('player_disconnect' , {
            location: self.location,
        } , true)
    });
    this.events.on('forceStop' , () => {
        Game._forceEndGame(this)
    });
    this.events.on('_CALLBACK' , (ID) => {
        this.events.emit(`messID_${ID}` , true);
    })


};

Player.prototype.toView = function () {
    return {
        name: this.name,
        location: this.location,
        tg_id: this.tg_id ? this.tg_id : undefined
    }
};

Player.prototype.sendToken = function () {
    const token = auth.sign({
        room_id: this.Game.room_id,
        location: this.location
    });
    this.socket.emit('token' , token)
};

Player.prototype.send = function (COM , res , withoutCallback , mess_ID) {
    if (!mess_ID) mess_ID = mess_ID_Gen();
    const mess = withoutCallback ? { COM , res } : { COM , res , mess_ID };
    const send = () => this.socket.emit('GAME' , mess);
    send();
    if (withoutCallback) return;
    this.isWaitingForCB = true;
    return new Promise((resolve , reject) => {
        const sendInterval = setInterval(send , 5000);
        this.events.once(`messID_${mess_ID}` , () => {
            clearInterval(sendInterval);
            this.isWaitingForCB = false;
            resolve();
        });
        setTimeout(() => {
            clearInterval(sendInterval);
            reject()
        }, 60 * 1000);

  });
};

Player.prototype.addQueue = function (COM , res) {
    function deleteMess(mess_ID){
        Player.messQueue =  Player.messQueue.filter((m) => m !== mess_ID )
    }

    const Player = this;
    const mess_ID = mess_ID_Gen();
    this.messQueue.push(mess_ID);
    Player.events.once(`_exec${mess_ID}` , () => {
        Player.send(COM , res , false , mess_ID)
            .then(() => {
                deleteMess(mess_ID);
                Player.checkQueue();
            })
            .catch(e => {
                deleteMess(mess_ID);
                Player.checkQueue();
                console.log("err while sending ")
            })
    });
    if (!this.isWaitingForCB) Player.checkQueue();

};
Player.prototype.checkQueue = function () {
    console.log(this.messQueue);
    if (this.messQueue.length > 0){
        const mess_ID = this.messQueue[0];
        this.events.emit(`_exec${mess_ID}`)
    }
};

const setEvents = (socket , events , game) => {
    socket.on('GAME' , (mess) => {
        const { COM , res } = mess;
        console.log(`PLAYER: ${game.name} | ${game.location} | ${COM} | ${JSON.stringify(res)}`.green);
        events.emit(COM , res);
        events.emit('update');
    });
    socket.on('disconnect' , (r) => {
        events.emit('disconnect' , r);
        this.isOnline = false;

    });
    socket.on('error' , (r) => {
        events.emit('error' , r);
    });
    socket.on('_CALLBACK' , (r) => {
        events.emit('_CALLBACK' , r);
    });

};

module.exports = Player;