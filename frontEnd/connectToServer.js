import socket_io from "./socket_io";
import loadingPage from "./loadingPage";
import NamePage from "./NamePage";
import game_core from "./game_core";
import config from "./config";
import ui from "./ui";

console.log('v3.2');

const useUrl = true;
const SOCKET_URL = useUrl ? 'ws://95.216.106.170' : '';

let socket = null;
let last_mess_id = 0;
const setIntervalTime = 5000;
let evenDisconnected = false;
let pingTimeStart = null;
let pinginterval = null;
let pingResp = true;
let token;
const pingTimeDom = $("#pingTime");
pingTimeDom.html('V3.2');


const Game = {
  connect: function() {
    const url = new URL(document.location.href);
    this.userName = this.userName || url.searchParams.get("userName");
    if (!this.userName) return NamePage();
    this.id = url.searchParams.get("id");
    this.game_id = url.searchParams.get("game") || undefined;
    this.rounds = parseInt(url.searchParams.get("rounds")) || undefined;

    connectTOS();
  },
  setName: function(name) {
    this.userName = name;
    this.connect();
  }
};

function socketConnect() {
  socket = socket_io(`${SOCKET_URL}/Hokm`, {
    reconnection: true,
    reconnectionDelay: 200,
    reconnectionDelayMax: 1000,
    transports: ["websocket"]
  });
  socket.heartbeatTimeout = 5000;
  return socket;
}

const join_room = () => {
  const { id, userName, game_id, rounds } = Game;
  socket.emit("JOIN_ME", { id, userName, game_id, rounds });
  $("#login_page")
    .removeClass("show")
    .addClass("hide");
  ui.showMessage("تا رسیدن بقیه بازیکن ها صبر کنید.");
  loadingPage.load(true);
};
const connectTOS = function() {
  socket = socketConnect();
  window.socket = socket;
  socket.on("connect", onConnect);
  socket.on("disconnect", r => {
    pingTimeDom.html("Disconnected!!!");
    evenDisconnected = true;
    console.log("socket disconnect", r);
  });

  socket.on("config", mess => {
    console.log("config", mess);
    config.setRoom_id(mess.room_id);
    config.setLocation(mess.location);
  });

  socket.on("GAME", mess => {
    console.log(mess);

    if (mess.mess_ID) {
      const { mess_ID } = mess;
      if (mess_ID - last_mess_id === 1) last_mess_id = mess_ID;
      else {
        console.warn("bad mess ID", { last_mess_id, mess_ID });
        if (mess_ID > last_mess_id) {
          ping()
          updatePingDom('updating...')
        }
        return;
      }
    }
    game_core(mess);
  });
  socket.on("connect_error", error => console.log("connect_error", error));
  socket.on("error", error => {
    console.log("error", error);
  });
  socket.on("connect_timeout", error => console.log("connect_timeout", error));
  socket.on("reconnect", x => console.log("reconnect", x));
  socket.on("reconnecting", x => console.log("reconnecting", x));
  socket.on("reconnect_error", x => console.log("reconnect_error", x));
  socket.on("reconnect_failed", x => console.log("reconnect_failed", x));
  socket.on("S_ERR", res => game_core({ COM: "alert", res }));
  socket.on("setSocketID", id => (socket_ID = id));
  socket.on("room_id", room_id => (room = room_id));
  socket.on("pongT", () => {
    pingResp = true;
    const pingTime = Date.now() - pingTimeStart;
    updatePingDom(pingTime + " ms");
  });
  socket.on("token", t => (token = t));
};

function onConnect() {
  pingTimeDom.html("Connected");
  if (token) socket.emit("token", token);
  else if (!evenDisconnected) join_room();
  else alert("اتصال شما با سرور ناپایدار است.");
  window.gameEmitor = function(COM, res) {
    if (!socket.connected) return alert("اتصال شما با سرور قطع شده است");
    socket.emit("GAME", {
      COM,
      res
    });
  };
  loadingPage.errBoxRemove();
  if (pinginterval) clearInterval(pinginterval);
  pinginterval = setInterval(ping, setIntervalTime);
}

function ping() {
  if (!pingResp) updatePingDom("Time Out!!!");
  pingResp = false;
  pingTimeStart = new Date().getTime();
  socket.emit("pingT", last_mess_id);
}

function updatePingDom(ping) {
  pingTimeDom.html(ping);
}

export default function() {
  Game.connect();
}
export const setName = function(name) {
  Game.setName(name);
};
