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
  this.on = this.events.on;
  this.once = this.events.once;
  this.numOfMess = 0;
  this._isOnline = true;
  this.messQueue = [];
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
    this.Game.teamEmit('player_connect', { location }, true);
  } else if (!state && this._isOnline)
    this.Game.teamEmit('player_disconnect', { location }, true);
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
  this._messQueueIndex();
  console.log(this.messQueue);

  const p = Promise.all(
    this.messQueue.map(mess =>
      this._pushEvent(mess.COM, mess.res, mess.mess_ID)
    )
  );
  return p;
};
Player.prototype.sendToken = function() {
  const token = auth.sign({
    room_id: this.Game.room_id,
    location: this.location
  });
  this.socket.emit('token', token);
};
Player.prototype.send = function(COM, res, withoutCallback) {
  if (withoutCallback) return this._send(COM, res, undefined, true);
  this.numOfMess++;
  const mess_ID = this.numOfMess;
  this._pushEvent(COM, res, mess_ID);
};
Player.prototype._pushEvent = function(COM, res, mess_ID) {
  this._send(COM, res, mess_ID, false).catch(e => {
    if (this.playerLeft) return;
    this._addQueue(COM, res, mess_ID);
    if (e === 1) return this._sendToMaster();
    this.setOnlineState(false);
    console.log(`Promise TimeOut: ${mess_ID} for ${this.name}`);
  });
};
Player.prototype._send = function(COM, res, mess_ID, withoutCallback) {
  const mess = withoutCallback ? { COM, res } : { COM, res, mess_ID };
  this.socket.emit('GAME', mess);
  if (withoutCallback) return;
  return new Promise((resolve, reject) => {
    this.events.once(`messID_${mess_ID}`, resolve);
    this.events.once(`_MESS_REJECT_${mess_ID}`, () => reject(1));

    setTimeout(() => {
      this.events.off(`messID_${mess_ID}`, resolve);
      this.events.off(`_MESS_REJECT_${mess_ID}`, () => reject(1));
      reject(0);
    }, 10000);
  });
};

Player.prototype._addQueue = function(COM, res, mess_ID) {
  const existMess = this.messQueue.find(mess => mess.mess_ID === mess_ID);
  if (existMess) return console.log(`${mess_ID} already exist in queue`);
  this.messQueue.push({ COM, res, mess_ID });
};

Player.prototype._messQueueIndex = function(maxMessId) {
  if (maxMessId)
    this.messQueue = this.messQueue.filter(mess => mess.mess_ID > maxMessId);
  this.messQueue = this.messQueue.sort((a, b) => a.mess_ID - b.mess_ID);
};

Player.prototype._MessLost = function(last_mess_id) {
  console.log(`${this.name} _MessLost ${last_mess_id}`);
  const mess = this.messQueue.find(mess => mess.mess_ID === last_mess_id);
  if (!mess) return this.Game.internalServerError('ISR ERROR:1');
  this._messQueueIndex(last_mess_id);
  this._sendToMaster();
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
  this.events.on('_CALLBACK', ID => {
    this._messQueueIndex(ID);
    this.setOnlineState(true);
    this.events.emit(`messID_${ID}`, true);
  });
  this.events.on('pingT', () => this.setOnlineState(true));
  this.events.on('_MessLost', last_messID => this._MessLost(last_messID));
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
  socket.on('pingT', () => events.emit('pingT'));
  socket.on('error', r => events.emit('error', r));
  socket.on('_CALLBACK', r => events.emit('_CALLBACK', r));
  socket.on('_MESS_REJECT', ({ last_mess_id, mess_ID }) => {
    events.emit('_MessLost', last_mess_id);
    events.emit(`_MESS_REJECT_${mess_ID}`);
  });
};

module.exports = Player;
