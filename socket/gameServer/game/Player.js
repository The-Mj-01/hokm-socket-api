const { toNum } = require('./Location');
const EventEmitter = require('events');
const auth = require('../auth');
const c = require('colors');
Player = function(scoket, location, Game, name, tgID) {
   this.Game = Game;
   this.name = name;
   this.tgID = tgID;
   this.location = toNum(location);
   this.events = new EventEmitter();
   this.cards = [];
   this.isTurn = false;
   this.playerLeft = false;
   this.numOfMess = 0;
   this._isOnline = true;
   this.messQueue = [];
   this._socketHealth = true;
   this.isWaitingForCB = false;
   this.setGameEvents();
   this.setupNewSocket(scoket);
   this.sendConfig();
   this.sendToken();
};

Player.prototype.setupNewSocket = function(socket) {
   this.socket = socket;
   socket.join(this.Game.room_id);
   setEvents(this.socket, this.events, this);
   this.setOnlineState(true);
};

Player.prototype.sendConfig = function() {
   this.socket.emit('config', {
      room_id: this.Game.room_id,
      location: this.location
   });
};
Player.prototype.setOnlineState = function(state) {
   const location = this.location;
   if (state && !this._isOnline) {
      this._sendToMaster();
      this.Game.teamPush('player_connect', { location }, true);
   } else if (!state && this._isOnline)
      this.Game.teamPush('player_disconnect', { location }, true);
   this._isOnline = state;
};

Player.prototype.toView = function() {
   return {
      name: this.name,
      location: this.location,
      tg_id: this.tg_id ? this.tg_id : undefined
   };
};
Player.prototype._sendToMaster = function() {
   console.log(`_sendToMaster ${this.name}`);

   this._messQueueIndex();
   this.messQueue.map(mess => {
      const { COM, res, mess_ID } = mess;
      this.socket.emit('GAME', { COM, res, mess_ID });
   });
};
Player.prototype.sendToken = function() {
   const token = auth.sign({
      room_id: this.Game.room_id,
      location: this.location
   });
   this.socket.emit('token', token);
};
Player.prototype.send = function(COM, res) {
   this.socket.emit('GAME', { COM, res });
};
Player.prototype.pushEvent = function(COM, res) {
   this.numOfMess++;
   const mess_ID = this.numOfMess;
   this._addQueue(COM, res, mess_ID);
   this.socket.emit('GAME', { COM, res, mess_ID });
};

Player.prototype._addQueue = function(COM, res, mess_ID) {
   const existMess = this.messQueue.find(mess => mess.mess_ID === mess_ID);
   if (existMess) return console.log(`${mess_ID} already exist in queue`);
   this.messQueue.push({ COM, res, mess_ID });
};

Player.prototype._messQueueIndex = function(maxMessId) {
   if (maxMessId) {
      this.messQueue = this.messQueue.filter(mess => mess.mess_ID > maxMessId);
   }
   this.messQueue = this.messQueue.sort((a, b) => a.mess_ID - b.mess_ID);
};

Player.prototype._removeListeners = function() {
   this.playerLeft = true;
   this.messQueue = [];
   this.events.removeAllListeners();
   this.socket.removeAllListeners();
};

Player.prototype.setGameEvents = function() {
   const Game = this.Game;
   this.events.on('chat', mess => {
      Game.sendChat(mess, this.location);
   });
   this.events.on('disconnect', () => this.setOnlineState(false));
   this.events.on('EXIT_GAME', () => {
      Game._forceEndGame(this);
   });
   this.events.on('pingT', last_mess_id => {
      this.setOnlineState(true);
      this._messQueueIndex(last_mess_id);
      if (this.messQueue.length > 0) this._sendToMaster();
   });
};

const setEvents = (socket, events, game) => {
   socket.on('GAME', mess => {
      const { COM, res } = mess;
      console.log(
         `PLAYER: ${game.name} | ${game.location} | ${COM} | ${JSON.stringify(
            res
         )}`.green
      );
      events.emit(COM, res);
   });
   socket.on('disconnect', r => events.emit('disconnect', r));
   socket.on('pingT', last_mess_id => events.emit('pingT', last_mess_id));
   socket.on('error', r => events.emit('error', r));
};

module.exports = Player;
