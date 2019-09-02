const Player = require('./Player');
const cardPick = require('./CardPick');
const endGame = require('./EndGame');
const io = require('../../io');
const chat = require('./chat');
const { toNum } = require('./Location');
const maxTimeWithoutActivity = 100 * 1000;

const routes = {
  start: require('./gameStart'),
  newRound: require('./Round').newRound,
  setHakem: require('./SetHakem'),
  newPreRound: require('./PreRound'),
  onHokmSeted: require('./Round').onHokmSet
};

Game = function(room_id, roomData) {
  this.room_id = room_id;
  this.timer = null;
  this.players = {
    0: null,
    1: null,
    2: null,
    3: null
  };
  this.players.toArray = function() {
    return [this[0], this[1], this[2], this[3]].filter(p => p != null);
  };
  this.table = {
    cards: [],
    suit: null,
    preRound: 0,
    players: []
  };
  this.table.getTurnPlayer = function() {
    return this.players[this.preRound];
  };

  this.rounds = roomData.rounds;
  this.gameType = roomData.type;
  this.namespace = 'Hokm';
  this.preRoundteamScore = {
    topB: 0,
    rightL: 0
  };
  this.roundteamScore = {
    topB: 0,
    rightL: 0
  };
  this._isGameStarted = false;
  this._isGameFinished = false;
  this.isHokmSet = false;
  this.cards = [];
  this.status = 'start';
  this.preRoundPlayerNum = 0;
  this.preRoundGame = [];
  this.numofPlayers = 0;
  this.waitingForPlayer;
  this.setUpdate();
};

Game.prototype.emit = function(x, y) {
  // todo: remove
  io.of('/globalHokm')
    .in(this.room_id)
    .emit(x, y);
};

Game.prototype.addplayer = function(socket, location, playerData) {
  const { name, tgID } = playerData;
  if (location) location = toNum(location);
  else location = this.getEmptyLocations()[0];

  if (this.players[location]) this.players[location].setupNewSocket(socket);
  else {
    if (this.players.toArray().length === 4) {
      socket.emit('S_ERR', 'GAME IS FULL');
      socket.disconnect();
    }
    this.numofPlayers++;
    const player = new Player(socket, location, this, name, tgID);
    this.players[location] = player;
    const onlines = this.numofPlayers;
    if (onlines < 4) this.teamEmit('newPlayer', { name, length: onlines });
    player.events.once('disconnect', () => {
      if (!this._isGameStarted) {
        this.numofPlayers--;
        delete this.players[location];
        this.teamEmit('leftPlayer', { name, length: this.numofPlayers });
      }
    });
    if (!this._isGameStarted && this.players.toArray().length >= 4) {
      this._isGameStarted = true;
      this.setUpdate();
      this.run('start');
    }
  }
};

Game.prototype.teamEmit = function(COM, res, withoutCB) {
  console.log(`TEAM ${COM} | ${JSON.stringify(res)} | ${withoutCB}`.white);
  this.players.toArray().map(p => p.send(COM, res, withoutCB));
};
Game.prototype.run = function(status) {
  if (status) this.status = status;
  if (typeof routes[this.status] === 'function') routes[this.status](this);
};
Game.prototype.setStatus = function(status) {
  if (status) this.status = status;
};

Game.prototype.setHokm = async function(hokm) {
  this.hokm = hokm;
  if (this.hokm && this.hakem) {
    await this.teamEmit('setHokm', this.hakem);
  }
};
Game.prototype.sendChat = function(chatMess, location) {
  chat(this, chatMess, location);
};
Game.prototype._setHokmEvent = async function(hokm, emit) {
  if (hokm && !this.isHokmSet) {
    this.isHokmSet = true;
    this.hokm = hokm;
    if (emit) await this.teamEmit('hokmSeted', hokm);
    this.run('onHokmSeted');
  } else {
    console.log('bad status');
    console.log(this.status);
  }
};

Game.prototype._joinOfflinePlayer = function(socket) {
  if (!this._isGameStarted) return;
  const { location } = socket.userData;
  console.log(location);
  const [player] = this.players.toArray().filter(p => p.location === location);
  if (player) player.setupNewSocket(socket);
};

Game.prototype._forceEndGame = function(player) {
  endGame(this, 1, player);
};
Game.prototype._pickCard = function(card, location) {
  cardPick(this, card, location);
  this.setUpdate();
};
Game.prototype.hook = function(id, mess) {
  const { COM } = mess;
  if (COM === 'JOIN_ME') this._joinOfflinePlayer(mess.res);
};

Game.prototype.getRoundPlayed = function() {
  return this.roundteamScore.topB + this.roundteamScore.rightL;
};

Game.prototype.renewPreRoundScore = function() {
  this.preRoundteamScore.rightL = 0;
  this.preRoundteamScore.topB = 0;
  this.roundNum = 0;
};

Game.prototype.getEmptyLocations = function() {
  const defaultLocations = [0, 1, 2, 3];
  const usedLocations = this.players.toArray().map(p => p.location);
  return defaultLocations.filter(loc => {
    const location = usedLocations.filter(l => loc === l);
    return location.length === 0;
  });
};

Game.prototype.removeListeners = function() {
  console.log('____removeListeners');
  this.players.toArray().forEach(p => p._removeListeners());
};

Game.prototype.internalServerError = function(error) {
  console.log(error);
  this.teamEmit('alert', error);
  endGame(this, 0);
};

Game.prototype.setUpdate = function() {
  this.lastActivity = Date.now();
  setTimeout(() => {
    if (Date.now() - this.lastActivity < maxTimeWithoutActivity) return;
    if (!this._isGameStarted) return;
    endGame(this, 2, this.waitingForPlayer);
  }, maxTimeWithoutActivity + 1000);
};

module.exports = Game;
